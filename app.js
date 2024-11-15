require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const bodyParser = require("body-parser");

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();

app.use(compression());

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ["Content-Type", "Authorization", "X-Access-Token"]
};

// ใช้ CORS middleware สำหรับทุก request
app.use(cors(corsOptions));

// การจัดการ OPTIONS requests
app.options('*', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Access-Token");
  res.sendStatus(200);
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());

app.use(require('./router/router'));

app.get("/*", (req, res) => {
  res.send("Welcome to the API");
});

module.exports = app;
