var express = require('express');
var router = express.Router();

router.use('/home', require('../modules/home/home.route'));


module.exports = router;