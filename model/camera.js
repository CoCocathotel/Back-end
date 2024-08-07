const mongoose = require('mongoose');

const cameraSchema = new mongoose.Schema({
    camera: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
});

module.exports = mongoose.model('Camera', cameraSchema);
