const themeToggle = document.getElementById("themeToggle");

// 1. ĐỒNG BỘ THEME
window.addEventListener("load", () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.setAttribute("data-theme", "dark");
    if (themeToggle) themeToggle.textContent = "☀️";
  } else {
    document.body.removeAttribute("data-theme");
    if (themeToggle) themeToggle.textContent = "🌙";
  }
});

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

// 2. DATA STORAGE CONVERTER
const dataRates = {
  b: 1, // bit
  B: 8, // Byte
  KB: 8 * 1024,
  MB: 8 * Math.pow(1024, 2),
  GB: 8 * Math.pow(1024, 3),
  TB: 8 * Math.pow(1024, 4),
};

function convertData() {
  const inputVal = parseFloat(document.getElementById("dataInput").value);
  if (isNaN(inputVal)) {
    document.getElementById("dataResult").textContent = "---";
    return;
  }

  const fromUnit = document.getElementById("dataFrom").value;
  const toUnit = document.getElementById("dataTo").value;
  const inBits = inputVal * dataRates[fromUnit];
  const result = inBits / dataRates[toUnit];

  let formattedResult = +result.toFixed(6);
  document.getElementById("dataResult").textContent =
    `${formattedResult} ${toUnit}`;
}

// 3. BINARY / BASE CONVERTER
function convertBase(source) {
  let decValue;
  const decInput = document.getElementById("decInput");
  const binInput = document.getElementById("binInput");
  const hexInput = document.getElementById("hexInput");
  const octInput = document.getElementById("octInput");

  try {
    if (source === "dec") decValue = parseInt(decInput.value, 10);
    if (source === "bin") decValue = parseInt(binInput.value, 2);
    if (source === "hex") decValue = parseInt(hexInput.value, 16);
    if (source === "oct") decValue = parseInt(octInput.value, 8);

    if (isNaN(decValue)) {
      if (source !== "dec") decInput.value = "";
      if (source !== "bin") binInput.value = "";
      if (source !== "hex") hexInput.value = "";
      if (source !== "oct") octInput.value = "";
      return;
    }

    if (source !== "dec") decInput.value = decValue.toString(10);
    if (source !== "bin") binInput.value = decValue.toString(2);
    if (source !== "hex") hexInput.value = decValue.toString(16).toUpperCase();
    if (source !== "oct") octInput.value = decValue.toString(8);
  } catch (e) {}
}

// 4. COLOR CONVERTER
const colorPicker = document.getElementById("colorPicker");
const hexInput = document.getElementById("hexColorInput");
const rgbResult = document.getElementById("rgbResult");
const hslResult = document.getElementById("hslResult");
const colorPreview = document.getElementById("colorPreview");

function convertColor() {
  let hex = colorPicker.value;
  hexInput.value = hex.toUpperCase();
  updateColorOutputs(hex);
}

function convertColorFromText() {
  let hex = hexInput.value;
  if (!hex.startsWith("#")) hex = "#" + hex;

  if (/^#[0-9A-F]{6}$/i.test(hex)) {
    colorPicker.value = hex;
    updateColorOutputs(hex);
  }
}

function updateColorOutputs(hex) {
  colorPreview.style.backgroundColor = hex;

  // Convert HEX to RGB
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  rgbResult.textContent = `rgb(${r}, ${g}, ${b})`;

  // Convert RGB to HSL
  let rRatio = r / 255,
    gRatio = g / 255,
    bRatio = b / 255;
  let max = Math.max(rRatio, gRatio, bRatio),
    min = Math.min(rRatio, gRatio, bRatio);
  let h,
    s,
    l = (max + min) / 2;

  if (max == min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rRatio:
        h = (gRatio - bRatio) / d + (gRatio < bRatio ? 6 : 0);
        break;
      case gRatio:
        h = (bRatio - rRatio) / d + 2;
        break;
      case bRatio:
        h = (rRatio - gRatio) / d + 4;
        break;
    }
    h /= 6;
  }

  hslResult.textContent = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

// Initialization run
convertData();
