const mongoose = require('mongoose');

const cameraSchema = new mongoose.Schema({
    camera: { type: Number,  default: 0 }
});

module.exports = mongoose.model('Camera', cameraSchema);
