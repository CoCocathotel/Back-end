const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    room_name: { type: String, required: true },
    type: { type: String},
    email: { type: String },
    user_name: { type: String },
    phone: { type: String },

    user_name_2: { type: String },
    phone_2: { type: String },
    
    special_request: { type: String },    
    check_in_date: { type: Date, default: Date.now },
    check_out_date: { type: Date },
    total_price: { type: Number, required: true },
    total_cats: { type: Number, required: true },
    total_rooms: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    pay_way: { type: String, required: true },
    total_cameras: { type: Number, default: 0},
    optional_services: [{
            service: String,
            form: String,
    }],
    image: { type: String }
}); 

module.exports = mongoose.model('Booking', bookingSchema);
