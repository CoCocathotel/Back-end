const mongoose = require("mongoose");

const footerSchema = new mongoose.Schema({
    headFooter: { type: String, required: true },
    addressFooter: { type: String, required: true },
    phoneFooter: { type: String, required: true },
    lineFooter: { type: String, required: true },
    tiktokFooter: { type: String, required: true },
});

module.exports = mongoose.model("Footer", footerSchema);
