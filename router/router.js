var express = require('express');
var router = express.Router();

router.use('/home', require('../modules/home/home.route'));
router.use('/room', require('../modules/room/room.route'));


module.exports = router;