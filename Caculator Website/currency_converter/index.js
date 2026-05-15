const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const exchangeResult = document.getElementById("exchangeResult");
const resultContainer = document.getElementById("resultContainer");
const historyList = document.getElementById("currencyHistoryList");
const themeToggle = document.getElementById("themeToggle");

window.onload = () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.setAttribute("data-theme", "dark");
    if (themeToggle) themeToggle.textContent = "☀️";
  }
  loadHistory();
  updatePopularRates();
};

// 1. Main conversion logic
async function convertCurrency() {
  const amount = parseFloat(amountInput.value);
  const from = fromCurrency.value.toLowerCase();
  const to = toCurrency.value.toLowerCase();

  if (isNaN(amount) || amount <= 0)
    return alert("Please enter a valid amount!");

  try {
    // Call API to get exchange rate
    const response = await fetch(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies${from}.json`,
    );
    const data = await response.json();
    const rate = data[from][to];
    const result = amount * rate;

    resultContainer.style.display = "block";
    const formattedResult = result.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    exchangeResult.textContent = `${amount.toLocaleString()} ${from.toUpperCase()} = ${formattedResult} ${to.toUpperCase()}`;

    saveHistory(
      `${amount} ${from.toUpperCase()} ➔ ${formattedResult} ${to.toUpperCase()}`,
    );
  } catch (error) {
    alert("Error fetching exchange rates. Please try again later.");
  }
}

// 3. History
function saveHistory(item) {
  let history = JSON.parse(localStorage.getItem("currencyHistory")) || [];
  history.unshift(item);
  if (history.length > 5) history.pop();
  localStorage.setItem("currencyHistory", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  let history = JSON.parse(localStorage.getItem("currencyHistory")) || [];
  historyList.innerHTML = history
    .map((item) => `<li><span>${item}</span></li>`)
    .join("");
}

function loadHistory() {
  renderHistory();
}

function clearCurrencyHistory() {
  localStorage.removeItem("currencyHistory");
  renderHistory();
}

async function updatePopularRates() {
  const table = document.getElementById("popularRatesTable");

  try {
    // The actual API call can be made here, temporarily using the sample display panel you wrote
    table.innerHTML = `
            <tr><td class="col-name">USD to VND</td><td class="col-formula">~ 26,307.97</td></tr>
            <tr><td class="col-name">EUR to VND</td><td class="col-formula">~ 30,949</td></tr>
            <tr><td class="col-name">JPY to VND</td><td class="col-formula">~ 167.91</td></tr>
            <tr><td class="col-name">KRW to VND</td><td class="col-formula">~ 17.96</td></tr>
        `;
  } catch (e) {}
}

// 5. Theme Toggle
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = document.body.hasAttribute("data-theme");
    if (isDark) {
      document.body.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
      themeToggle.textContent = "🌙";
    } else {
      document.body.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      themeToggle.textContent = "☀️";
    }
  });
}
