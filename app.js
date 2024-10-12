require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const bodyParser = require("body-parser");

const app = express();

app.use(compression());

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());

app.use(require('./router/router'));


app.get("/*", (req, res) => {
  res.send("Welcome to the API");
});



module.exports = app;
