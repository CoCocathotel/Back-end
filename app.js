const express = require("express");
const cors = require("cors");
const app = express();

// Configuration for CORS
const corsOptions = {
  origin: '*', // กำหนดให้ทุกโดเมนสามารถเข้าถึงได้
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ["Content-Type", "Authorization", "X-Access-Token"]
};

// Apply CORS middleware globally
app.use(cors(corsOptions));

// ตัวเลือกพิเศษสำหรับ CORS
app.options('*', cors(corsOptions));

app.use(express.json());

// สุดท้าย โหลด route ของคุณ
app.use(require('./router/router'));

app.get("/*", (req, res) => {
  res.send("Welcome to the API");
});

module.exports = app;
