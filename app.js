require("dotenv").config();
require("./config/database").connect();
const express = require("express");
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

// Middleware to set CORS headers manually
app.use((req, res, next) => {
  const allowedOrigins = ['https://cococatfrontend.vercel.app', 'http://localhost:3000'];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Access-Token");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());

app.use(require('./router/router'));

app.get("/*", (req, res) => {
  res.send("Welcome to the API");
});

module.exports = app;
