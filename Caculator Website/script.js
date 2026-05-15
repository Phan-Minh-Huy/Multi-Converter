const display = document.getElementById("display");
const degRadBtn = document.getElementById("degRadBtn");
const themeToggle = document.getElementById("themeToggle");
let isNewInput = true;
let ans = 0;
let memory = 0;
let isDegree = true;

// 1. BASIC INPUT FUNCTIONS

// Replace the appendString function
function appendString(str) {
  const operators = [
    "+",
    "-",
    "*",
    "/",
    "^",
    "^2",
    "^3",
    "%",
    "!",
    "E",
    "^(1/",
  ];

  if (
    display.value === "Syntax error" ||
    display.value === "NaN" ||
    display.value === "Syntax Error"
  ) {
    display.value = ""; // When there's an error, clear the display to show the placeholder
    isNewInput = true;
  }

  if (isNewInput) {
    if (operators.includes(str)) {
      if (display.value === "") {
        display.value = "0" + str;
      } else {
        display.value += str;
      }
    } else {
      display.value = str;
    }
    isNewInput = false;
  } else {
    display.value += str;
  }
}

// Replace the clearDisplay function (AC button)
function clearDisplay() {
  display.value = "";
  isNewInput = true;
}

// Replace the backspace function (Backspace button)
function backspace() {
  if (
    display.value.length > 1 &&
    display.value !== "Syntax Error" &&
    display.value !== "Syntax error"
  ) {
    display.value = display.value.slice(0, -1);
  } else {
    display.value = ""; // Delete the last character and return an empty string
    isNewInput = true;
  }
}

// Replace the toggleSign function (± button)
function toggleSign() {
  if (
    display.value !== "" &&
    display.value !== "0" &&
    display.value !== "Syntax Error"
  ) {
    if (display.value.startsWith("-")) {
      display.value = display.value.substring(1);
    } else {
      display.value = "-" + display.value;
    }
  }
}

// 2. LOGIC: CORNER, MEMORY & PREVIOUS RESULTS
function toggleAngleMode() {
  isDegree = !isDegree;
  degRadBtn.innerText = isDegree ? "Deg" : "Rad";
}

function appendAns() {
  appendString(ans.toString());
}

function memoryAdd() {
  let currentValue = evaluateExpression(display.value);
  if (!isNaN(currentValue)) {
    memory += currentValue;
    isNewInput = true;
  }
}

function memorySubtract() {
  let currentValue = evaluateExpression(display.value);
  if (!isNaN(currentValue)) {
    memory -= currentValue;
    isNewInput = true;
  }
}

function memoryRecall() {
  appendString(memory.toString());
}

// 3. ADVANCED MATHEMATICS

function factorial(n) {
  n = Math.round(n);
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

window.trigSin = function (x) {
  return Math.sin(isDegree ? (x * Math.PI) / 180 : x);
};
window.trigCos = function (x) {
  return Math.cos(isDegree ? (x * Math.PI) / 180 : x);
};
window.trigTan = function (x) {
  return Math.tan(isDegree ? (x * Math.PI) / 180 : x);
};
window.trigAsin = function (x) {
  let r = Math.asin(x);
  return isDegree ? (r * 180) / Math.PI : r;
};
window.trigAcos = function (x) {
  let r = Math.acos(x);
  return isDegree ? (r * 180) / Math.PI : r;
};
window.trigAtan = function (x) {
  let r = Math.atan(x);
  return isDegree ? (r * 180) / Math.PI : r;
};

// 4. MATHEMATICAL LANGUAGE PROCESSOR AND TRANSLATOR

function evaluateExpression(expr) {
  try {
    let parsed = expr;

    parsed = parsed.replace(/π/g, "Math.PI");
    parsed = parsed.replace(/(^|[^0-9.])e(?!x)/g, "$1Math.E");

    parsed = parsed.replace(/sin\(/g, "trigSin(");
    parsed = parsed.replace(/cos\(/g, "trigCos(");
    parsed = parsed.replace(/tan\(/g, "trigTan(");
    parsed = parsed.replace(/asin\(/g, "trigAsin(");
    parsed = parsed.replace(/acos\(/g, "trigAcos(");
    parsed = parsed.replace(/atan\(/g, "trigAtan(");

    parsed = parsed.replace(/ln\(/g, "Math.log(");
    parsed = parsed.replace(/log\(/g, "Math.log10(");

    parsed = parsed.replace(/√\(/g, "Math.sqrt(");
    parsed = parsed.replace(/cbrt\(/g, "Math.cbrt(");
    parsed = parsed.replace(/\^/g, "**");

    parsed = parsed.replace(/(\d+(\.\d+)?)!/g, "factorial($1)");

    parsed = parsed.replace(/%/g, "/100");

    let result = eval(parsed);

    if (result % 1 !== 0) {
      result = parseFloat(result.toFixed(10));
    }
    return result;
  } catch (error) {
    return NaN;
  }
}

// 5. HISTORY OF CALCULATIONS

const historyList = document.getElementById("history-list");

function addHistory(expression, result) {
  const emptyMsg = document.querySelector(".empty-msg");
  if (emptyMsg) emptyMsg.remove();

  const li = document.createElement("li");
  li.innerHTML = `
        <span class="history-expr">${expression} =</span>
        <span class="history-res">${result}</span>
    `;

  historyList.insertBefore(li, historyList.firstChild);
}

function clearHistory() {
  historyList.innerHTML =
    '<li class="empty-msg">No calculations have been made yet.</li>';
}

function calculate() {
  let originalExpression = display.value;
  let result = evaluateExpression(originalExpression);

  if (!isNaN(result)) {
    display.value = result;
    ans = result;
    isNewInput = true;

    if (originalExpression !== "0" && originalExpression !== "") {
      addHistory(originalExpression, result);
    }
  } else {
    display.value = "Error!";
    isNewInput = true;
  }
}

window.addEventListener("load", () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.setAttribute("data-theme", "dark");
    if (themeToggle) themeToggle.textContent = "☀️";
  } else {
    document.body.removeAttribute("data-theme");
    if (themeToggle) themeToggle.textContent = "🌙";
  }
});

// Theme Change Button
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

document.addEventListener("keydown", function (event) {
  const allowedKeys = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    ".",
    "+",
    "-",
    "*",
    "/",
    "(",
    ")",
    "%",
  ];

  if (allowedKeys.includes(event.key)) {
    event.preventDefault();
    appendString(event.key);
  }
  // Press the Enter key or the '=' key to calculate the result.
  else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    calculate();
  }
});
