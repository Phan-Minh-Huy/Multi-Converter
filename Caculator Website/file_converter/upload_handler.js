const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const libre = require("libreoffice-convert");
const mysql = require("mysql2/promise");

const router = express.Router();

// 1. Configure MySQL connection (Replace with your own information)
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "multi-converter",
};

// 2. Multer now only uses temporary memory (Memory Storage)
// to avoid creating temporary files in the uploads directory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.array("files"), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "File not found!" });
  }

  const file = req.files[0]; // File taken from cache (buffer)
  let targetFormat = req.body.formats;
  if (Array.isArray(targetFormat)) targetFormat = targetFormat[0];

  const outputExtension = `.${targetFormat.toLowerCase()}`;

  console.log(`[🔄] Converting & saving to MySQL: ${file.originalname}`);

  // CONVERT USING LIBREOFFICE
  libre.convert(file.buffer, outputExtension, undefined, async (err, done) => {
    if (err) {
      return res.status(500).json({ error: "Error converting file" });
    }

    try {
      // DB Connections
      const connection = await mysql.createConnection(dbConfig);

      // SAVE FILE INTO MYSQL (Use 'done' data as converted Buffer)
      const sql =
        "INSERT INTO converted_files (original_name, file_data, target_format) VALUES (?, ?, ?)";
      const [result] = await connection.execute(sql, [
        file.originalname,
        done,
        targetFormat,
      ]);

      console.log(`[✅] Saved to MySQL with ID: ${result.insertId}`);

      // RETURN THE FILE TO THE USER TO DOWNLOAD
      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${path.parse(file.originalname).name}_converted${outputExtension}`,
      );
      res.send(done);

      await connection.end();
    } catch (dbErr) {
      console.error("❌ [UPLOAD] Error connecting to Database:", dbErr);
      res.status(500).send("❌ [UPLOAD] Error storing data.");
    }
  });
});

module.exports = router;
