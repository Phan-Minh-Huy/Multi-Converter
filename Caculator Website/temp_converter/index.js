const textBox = document.getElementById("textBox");
const fromUnit = document.getElementById("fromUnit");
const toUnit = document.getElementById("toUnit");
const resultContainer = document.getElementById("resultContainer");
const resultText = document.getElementById("resultText");
const formulaDisplay = document.getElementById("formulaDisplay");
const historyList = document.getElementById("historyList");
const themeToggle = document.getElementById("themeToggle");

window.onload = () => {
  const savedHistory = JSON.parse(localStorage.getItem("tempHistory")) || [];
  savedHistory.forEach((item) => renderHistoryItem(item));

  if (localStorage.getItem("theme") === "dark") {
    document.body.setAttribute("data-theme", "dark");
    if (themeToggle) themeToggle.textContent = "☀️";
  }
};

function convert() {
  let val = parseFloat(textBox.value);
  if (isNaN(val)) return alert("Error! Enter the number ");

  let from = fromUnit.value;
  let to = toUnit.value;
  let c, formulaFrom, formulaTo;

  switch (from) {
    case "C":
      c = val;
      formulaFrom = `${val}°C`;
      break;
    case "F":
      c = ((val - 32) * 5) / 9;
      formulaFrom = `(${val}°F - 32) × 5/9`;
      break;
    case "K":
      c = val - 273.15;
      formulaFrom = `${val}K - 273.15`;
      break;
    case "R":
      c = ((val - 491.67) * 5) / 9;
      formulaFrom = `(${val}°R - 491.67) × 5/9`;
      break;
    case "Re":
      c = val * 1.25;
      formulaFrom = `${val}°Re × 1.25`;
      break;
  }

  let res;
  switch (to) {
    case "C":
      res = c;
      formulaTo = ` = ${res.toFixed(2)}°C`;
      break;
    case "F":
      res = (c * 9) / 5 + 32;
      formulaTo = ` × 9/5 + 32 = ${res.toFixed(2)}°F`;
      break;
    case "K":
      res = c + 273.15;
      formulaTo = ` + 273.15 = ${res.toFixed(2)}K`;
      break;
    case "R":
      res = (c * 9) / 5 + 491.67;
      formulaTo = ` × 9/5 + 491.67 = ${res.toFixed(2)}°R`;
      break;
    case "Re":
      res = c * 0.8;
      formulaTo = ` × 0.8 = ${res.toFixed(2)}°Re`;
      break;
  }

  // Show the results
  resultContainer.style.display = "block";
  let finalString = `${res.toFixed(2)} ${to}`;
  resultText.textContent = finalString;
  formulaDisplay.textContent = formulaFrom + formulaTo;

  saveHistory(`${val}${from} ➔ ${finalString}`);
}

function saveHistory(item) {
  let history = JSON.parse(localStorage.getItem("tempHistory")) || [];
  history.unshift(item);
  if (history.length > 10) history.pop();
  localStorage.setItem("tempHistory", JSON.stringify(history));
  renderHistoryItem(item, true);
}

function renderHistoryItem(text, isNew = false) {
  const li = document.createElement("li");
  li.innerHTML = `<span>${text}</span>`;
  if (isNew) historyList.prepend(li);
  else historyList.appendChild(li);
}

function clearHistory() {
  localStorage.removeItem("tempHistory");
  historyList.innerHTML = "";
}

function copyResult() {
  navigator.clipboard.writeText(resultText.textContent);
  alert("Copy Done ");
}

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
