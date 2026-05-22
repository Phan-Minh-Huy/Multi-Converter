require("dotenv").config(); // Allow reading environment variables
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const helmet = require("helmet"); // Security library
const rateLimit = require("express-rate-limit"); // Anti-Spam Library
const cron = require("node-cron"); // Scheduling Library
const mysql = require("mysql2/promise");
const app = express();
// 1. PREPARING FOR HOSTING: You must use process.env.PORT to allow the server to automatically assign ports.
const PORT = process.env.PORT || 3000;

// Security Class 1: HTTP & CORS SECURITY
// The helmet hides sensitive information from the Node.js server.
app.use(helmet({ contentSecurityPolicy: false }));

// CORS Restrictions: Only allow your domain name to call the API (Replace this when you have a real domain name).
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? ["https://your-domain-name.com"]
      : "*",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Security Class 2: RATE LIMIT
// Limit: Each IP address can only make 20 API calls every 15 minutes.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    error:
      "You've done too many operations! Please try again after 15 minutes.",
  },
});
// This only applies when the user is using the file conversion API.
app.use("/api/", apiLimiter);

// BROADCAST WEB INTERFACE
app.use(express.static(path.join(__dirname, "")));

// CONNECT TO FILE PROCESSING ROUTER
const fileConverterAPI = require("./file_converter/upload_handler");
app.use("/api/upload", fileConverterAPI);

// ==========================================
// Security Class 3: CRONJOB
// ==========================================
// Background programming: Every hour (minute 00), the uploads folder will scan.
// ==========================================
// LỚP BẢO VỆ 3: ROBOT DỌN RÁC (CRONJOB)
// ==========================================
// Cấu hình Database (Nhớ điền giống hệt bên upload_handler.js nhé)
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "", // Thay bằng mật khẩu của bạn nếu có
  database: "tên_database_cua_ban", // Thay tên DB của bạn vào đây
};

// Lập trình chạy ngầm: Cứ tròn 1 tiếng (phút 00) sẽ quét dọn 1 lần
cron.schedule("0 * * * *", async () => {
  console.log("🧹 [CRON] Start periodic system cleanup.");

  // NHIỆM VỤ 1: Dọn rác ổ cứng (Phòng hờ rớt mạng kẹt file tạm)
  const uploadDir = path.join(__dirname, "file_converter", "uploads");
  if (fs.existsSync(uploadDir)) {
    fs.readdir(uploadDir, (err, files) => {
      if (err) return;
      files.forEach((file) => {
        fs.unlink(path.join(uploadDir, file), (err) => {
          if (err) console.error("Error deleting physical junk file:", err);
        });
      });
    });
  }

  // NHIỆM VỤ 2: Dọn rác Database (Tháo ngòi nổ "Quả bom số 1")
  try {
    const connection = await mysql.createConnection(dbConfig);

    // Câu lệnh SQL: Tiêu diệt tất cả file cũ hơn 24 giờ (1 DAY)
    const sql =
      "DELETE FROM converted_files WHERE created_at < (NOW() - INTERVAL 1 DAY)";
    const [result] = await connection.execute(sql);

    if (result.affectedRows > 0) {
      console.log(
        `[CRON] Cleaned successfully ${result.affectedRows}  files from MySQL! 🗄️`,
      );
    } else {
      console.log(`[CRON] Database currently very clean. ✨`);
    }

    await connection.end(); // Nhớ đóng kết nối sau khi làm xong
  } catch (dbErr) {
    console.error(
      "❌ [CRON] Error when connecting to Database to clean junk:",
      dbErr,
    );
  }
});
// Start the server
app.listen(PORT, () => {
  console.log(`🛡️ The server is fully protected.`);
  console.log(`🌐 Running at: http://localhost:${PORT}/index.html`);
});
