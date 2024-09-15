require("dotenv").config();
const express = require("express");
const {MongoClient} = require("mongodb");
const axios = require("axios");
var cors = require('cors')

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@quadb.iqm8j.mongodb.net/?retryWrites=true&w=majority&appName=quadB`;
const client = new MongoClient(uri);

async function connectToDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }
}

const app = express();
app.use(cors());

connectToDB();

const dbName = "quadB";
const collectionName = "tickers";

async function fetchAndStoreTickers() {
  try {
    const response = await axios.get("https://api.wazirx.com/api/v2/tickers");
    const tickers = response.data;
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const top10Tickers = Object.keys(tickers).slice(0, 10);
    await Promise.all(
      top10Tickers.map((key) => {
        const ticker = tickers[key];
        return collection.insertOne({
          name: key,
          last: ticker.last,
          buy: ticker.buy,
          sell: ticker.sell,
          volume: ticker.volume,
          base_unit: ticker.base_unit,
        });
      })
    );

  } catch (err) {
    console.log(err);
  }
}

fetchAndStoreTickers();


app.get("/api/tickers", async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const data = await collection.find().toArray();
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error fetching data" });
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

