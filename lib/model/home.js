const mongoose = require("mongoose");

const homeSchema = new mongoose.Schema({
    heroImage: [String],
    title: { type: String, required: true },
    reviewImage: [String],
    mapImage: { type: String, required: true },
    mapDetail: { type: String, required: true },
});

module.exports = mongoose.model("Home", homeSchema);
