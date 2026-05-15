# 🛠️ Multi-Converter - All-in-One Utility Platform

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-Backend-43853D?logo=node.js)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?logo=mysql)
![LibreOffice](https://img.shields.io/badge/LibreOffice-Converter-18A303?logo=libreoffice)

## 🌟 About the Project

**Multi-Converter** is a versatile web platform providing an "All-in-One" utility suite. Designed with a modern **Glassmorphism** interface, it supports Dark/Light mode and delivers a seamless user experience through highly optimized client-side and server-side processing.

The core highlight of this project is the powerful **File Converter** suite:
- **Ultra-fast Image Conversion** processed entirely on the browser with zero server latency.
- **Advanced Document Conversion** (e.g., DOCX to PDF) that preserves 100% of the original formatting (tables, images) leveraging the LibreOffice engine. Converted files are securely stored in a MySQL database, accompanied by an automated cronjob system to optimize storage.

### ✨ Key Features:
* **🖼️ Image Converter:** Convert JPG, PNG, and WEBP locally utilizing the HTML5 Canvas API.
* **📄 Document Converter:** Convert DOCX to PDF (and vice versa) while keeping the original layout intact.
* **🗄️ Smart Data Management:** Securely stores files as BLOBs in MySQL, protected by Helmet & CORS, with an automated cronjob that purges junk files every 24 hours.
* **🧮 Additional Utilities:** Scientific Calculator, Unit/Currency Converters, and Data Encoders (Base64, Hex, Binary).

---

## ⚙️ Prerequisites

To run this project on your local machine, ensure you have the following installed:
1. **[Node.js](https://nodejs.org/):** The runtime environment for the backend.
2. **[pnpm](https://pnpm.io/):** A fast, disk-space efficient package manager. (Install via `npm install -g pnpm`).
3. **[MySQL](https://www.apachefriends.org/):** Database management system (XAMPP or MySQL Server).
4. **[LibreOffice](https://www.libreoffice.org/):** Required core software for the Node.js server to read and convert complex Word/PDF document structures.

---

## 🚀 Getting Started (How to Run)

### Step 1: Database Initialization
1. Open MySQL (or access `http://localhost/phpmyadmin` if using XAMPP).
2. Create a new database, for example, `smart_tools_db`.
3. Execute the following SQL script to create the file storage table:
   ```sql
   CREATE TABLE converted_files (
       id INT AUTO_INCREMENT PRIMARY KEY,
       original_name VARCHAR(255),
       file_data LONGBLOB,
       target_format VARCHAR(10),
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
Step 2: Clone and Configure
Clone this repository to your local machine:

Bash
git clone [https://github.com/YourUsername/smart-web-tools.git](https://github.com/YourUsername/smart-web-tools.git)
cd smart-web-tools
Open file_converter/upload_handler.js and server.js, locate the dbConfig object, and update it with your MySQL credentials:

JavaScript
const dbConfig = {
    host: 'localhost',
    user: 'root',         // Your MySQL username
    password: '',         // Your MySQL password (leave blank if using default XAMPP)
    database: 'smart_tools_db' // The database name you just created
};
Step 3: Install Dependencies & Run
Open your terminal in the root directory of the project and install the required dependencies using pnpm:

Bash
pnpm i
Start the server:

Bash
node server.js
Open your web browser and navigate to:
http://localhost:3000/main.html

🛡️ Security & Optimization Architecture
Rate Limiting: Prevents spam and DDoS attacks by restricting API calls (e.g., 20 requests / 15 minutes).

Memory Management: Strict RAM allocation, automatically rejecting file uploads exceeding 15MB to prevent server crashes (Out of Memory).

Cronjob Cleanup: A background task runs every hour to automatically collect and delete temporary conversion files, as well as database records older than 24 hours to prevent storage overload.

Developed by [Minh Huy Phan] - Passionate about building optimized & high-performance web solutions.
