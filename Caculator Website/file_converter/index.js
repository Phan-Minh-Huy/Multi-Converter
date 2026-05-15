const themeToggle = document.getElementById("themeToggle");

// ==========================================
//  THEME
// ==========================================
window.onload = () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.setAttribute("data-theme", "dark");
    if (themeToggle) themeToggle.textContent = "☀️";
  }
  loadHistory();
  updatePopularRates();
};

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
// ==========================================
// 1. IMAGE CONVERTER (LOCAL CANVAS API)
// ==========================================
const imgInput = document.getElementById("imgInput");
const imgPreview = document.getElementById("imgPreview");
const imgPreviewArea = document.getElementById("imgPreviewArea");
const imgInfo = document.getElementById("imgInfo");
const imgFormatSelect = document.getElementById("imgFormatSelect");
const imgZone = document.getElementById("imgZone");
let currentImage = new Image();
let originalImgName = "image";

imgInput.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    originalImgName = file.name.split(".")[0];
    imgInfo.textContent = `File: ${file.name} | Size: ${(file.size / 1024).toFixed(2)} KB`;

    const reader = new FileReader();
    reader.onload = function (event) {
      imgPreview.src = event.target.result;
      currentImage.src = event.target.result;
      imgPreviewArea.style.display = "block";
      imgZone.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
});

function convertImage() {
  if (!currentImage.src) {
    alert("Please upload an image first! 🖼️");
    return;
  }

  const format = imgFormatSelect.value;
  const ext = format === "image/jpeg" ? "jpg" : format.split("/")[1];

  const canvas = document.createElement("canvas");
  canvas.width = currentImage.width;
  canvas.height = currentImage.height;
  const ctx = canvas.getContext("2d");

  if (format === "image/jpeg") {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(currentImage, 0, 0);
  const dataUrl = canvas.toDataURL(format, 0.9);

  const link = document.createElement("a");
  link.download = `${originalImgName}_converted.${ext}`;
  link.href = dataUrl;
  link.click();
}

// ==========================================
// 2. DOCUMENT CONVERTER
// ==========================================
const docInput = document.getElementById("docInput");
const docPreviewArea = document.getElementById("docPreviewArea");
const docInfo = document.getElementById("docInfo");
const docZone = document.getElementById("docZone");
const docFormatSelect = document.getElementById("docFormatSelect");
const docStatus = document.getElementById("docStatus");
let docFileForBackend = null;

docInput.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    docFileForBackend = file;
    docInfo.textContent = `${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
    docPreviewArea.style.display = "block";
    docZone.style.display = "none";
    docStatus.textContent = ""; // Reset status
    docStatus.style.color = "inherit";
  }
});

async function convertDocument() {
  if (!docFileForBackend) {
    alert("Please upload a document first! 📝");
    return;
  }

  const targetFormat = docFormatSelect.value;
  const formData = new FormData();

  // Submit 2 correct information: file and format you want to change
  formData.append("files", docFileForBackend);
  formData.append("formats", targetFormat);

  docStatus.textContent = "Converting & Downloading... ⏳";
  docStatus.style.color = "var(--text)";

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const blob = await response.blob();

      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      const originalName = docFileForBackend.name.split(".")[0];
      a.download = `${originalName}_converted.${targetFormat.toLowerCase()}`;

      a.href = downloadUrl;
      document.body.appendChild(a);

      a.click();

      a.remove();
      window.URL.revokeObjectURL(downloadUrl);

      docStatus.textContent = `✅ Success! File downloaded.`;
      docStatus.style.color = "#10b981"; // Màu xanh lá
    } else {
      docStatus.textContent = "❌ Server Error. Please try again.";
      docStatus.style.color = "#ef4444"; // Màu đỏ
    }
  } catch (error) {
    docStatus.textContent = "🔌 Connection failed. Is Node.js running?";
    docStatus.style.color = "#ef4444";
  }
}
