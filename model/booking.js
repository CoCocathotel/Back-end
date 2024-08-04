const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    room: { type: String, required: true },
    email: { type: String },
    cin: { type: Date, default: Date.now },
    cout: { type: Date },
    status: { type: String, default: 'pending' },
    pay_way: { type: String, required: true },
    camerasBooked: { type: Number, required: true },
    image: { type: String }
});

module.exports = mongoose.model('Booking', bookingSchema);
