const mongoose = require("mongoose");

const homeSchema = new mongoose.Schema({
    heroImage: { type: String, required: true },
    title: { type: String, required: true },
    reviewImage: { type: String, required: true },
    mapImage: { type: String, required: true },
    mapDetail: { type: String, required: true },
});

module.exports = mongoose.model("Home", homeSchema);
