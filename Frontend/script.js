const tbody = document.getElementById("tickers-tbody");

fetch("http://localhost:3000/api/tickers")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((ticker, i) => {
      const row = document.createElement("tr");
      row.classList.add("ticker-row");
      row.innerHTML = `
        <td>${i + 1}</td>
        <td>${ticker.name}</td>
        <td>${ticker.last}</td>
        <td>${ticker.buy} / ${ticker.sell}</td>
        <td>${ticker.volume}</td>
        <td>${ticker.base_unit}</td>
      `;
      tbody.appendChild(row);
    });
  })
  .catch((err) => console.log(err));
