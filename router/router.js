var express = require('express');
var router = express.Router();

router.use('/home', require('../modules/home/home.route'));
router.use('/room', require('../modules/room/room.route'));
router.use('/booking', require('../modules/booking/booking.route'));
router.use('/user', require('../modules/user/user.route'));
router.use('/footer', require('../modules/footer/footer.route'));

module.exports = router;