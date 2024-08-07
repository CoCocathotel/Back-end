const mongoose = require('mongoose');

const book_cameraSchema = new mongoose.Schema({
    camera: { type: String},
    email: { type: String },
    cin: { type: Date, default: Date.now },
    cout: { type: Date },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }
});

module.exports = mongoose.model('Book_Camera', book_cameraSchema);
