// route 
const express = require('express');
const router = express.Router();
const bookingCont = require('./booking.cont');


router.get('/', bookingCont.getBooking);

router.post('/id/:id', bookingCont.getOneBookingById);
router.post('/type/:type', bookingCont.getOneBookingByType);
router.post('/createBooking', bookingCont.createBooking);
router.post('/getAllEvent', bookingCont.getAllEvent);
router.patch('/changeStatus', bookingCont.changeStatus);
router.patch('/updateBooking/:id', bookingCont.updateBooking);
// edit booking
// delete booking
// get one Booking


module.exports = router;
