// route 
const express = require('express');
const router = express.Router();
const bookingCont = require('./booking.cont');


router.get('/', bookingCont.getBooking);
router.get('/:id', bookingCont.getOneBooking);
router.post('/createBooking', bookingCont.createBooking);
// router.post('/createBooking', bookingCont.createRoom);
// edit booking
// delete booking
// get one Booking


module.exports = router;
