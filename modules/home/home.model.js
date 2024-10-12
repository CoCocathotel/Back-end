const mongoose = require("mongoose");

const homeSchema = new mongoose.Schema({
    heroImage: [String],
    title: { type: String},
    reviewImage: [String],
    mapImage: { type: String},
    mapDetail: { type: String},
});


module.exports = mongoose.model("Home", homeSchema);
