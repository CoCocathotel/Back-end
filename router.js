const express = require('express');
const router = express.Router();


router.use('/', require('./modules/home')); 

module.exports = router;