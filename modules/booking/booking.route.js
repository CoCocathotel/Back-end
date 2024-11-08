// route 
const express = require('express');
const router = express.Router();
const bookingCont = require('./booking.cont');
const authCont = require('../../middleware/auth');

router.get('/', bookingCont.getBooking);

router.post('/id/:id', bookingCont.getOneBookingById);
router.post('/type/:type', bookingCont.getOneBookingByType);
router.post('/createBooking',authCont.verifyToken, bookingCont.createBooking);
router.post('/getAllEvent', bookingCont.getAllEvent);
router.patch('/changeStatus', bookingCont.changeStatus);
router.patch('/updateBooking/:id', bookingCont.updateBooking);

module.exports = router;