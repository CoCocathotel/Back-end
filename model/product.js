// product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: String, required: true },
    type: { type: String, required: true },
    description:{ type: String, required: true },
   // email: { type: String },
   //cin: { type: Date, default: Date.now() },
   // cout: { type: Date}
});

module.exports = mongoose.model('Product', productSchema);
