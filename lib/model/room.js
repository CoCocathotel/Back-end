// product.js
const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  room_name: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: [String], required: true },
  description: { type: String, required: true },
  cameras: { type: Number, required: true },
  // size: { type: String, required: true },
  optional_services: [
    {
      service: String,
      form: String,
    },
  ],
  number_of_cats: { type: Number, required: true },
  number_of_rooms: { type: Number, required: true },
});

module.exports = mongoose.model("Room", roomSchema);
