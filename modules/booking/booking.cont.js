const { Booking } = require('../../middleware/db');
const Image = require('../../middleware/superbase');
const mongoose = require('mongoose');

exports.getBooking = async (req, res) => {
    try {
        const booking = await Booking.find();
        if (!booking) {
            return res.status(404).send("Booking data not found");
        }
        res.status(200).json({
            body: booking,
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.getOneBooking = async (req, res) => {
    const { id } = req.params;
    try {
        const booking = await Booking.findOne({ _id: id });
        if (!booking) {
            return res.status(404).send("Booking data not found");
        }
        res.status(200).json({
            body: booking,
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.createBooking = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {
            room_name,
            type,
            email,
            user_name,
            phone,
            user_name_2,
            phone_2,
            special_request,
            optional_services,
            check_in_date,
            check_out_date,
            total_price,
            total_cats,
            total_rooms,
            status,
            pay_way,
            total_cameras,
            image,
        } = req.body;

        if (typeof total_cats === 'undefined' || total_cats === null) {
            throw new Error("total_cats is required");
        }

        let LinkSlip = '';  
        if(image){
            LinkSlip = await Image.uploadImage(image, "slip");
        }

        let total_cats_All = total_cats;
        let collect = [];

        for (let i = 0; i < total_rooms; i++) {
            if (total_cats_All > 0) {
                const cats_in_room = Math.min(1, total_cats_All);
                collect.push(cats_in_room);
                total_cats_All -= cats_in_room;
            } else {
                collect.push(0);
            }
        }

        for (let i = 0; i < total_rooms; i++) {
            await Booking.create([
                {
                    room_name,
                    type,
                    email,
                    user_name,
                    phone,
                    user_name_2,
                    phone_2,
                    special_request,
                    optional_services,
                    check_in_date,
                    check_out_date,
                    total_price,
                    total_cats: collect[i],
                    total_rooms: 1,
                    status,
                    pay_way,
                    total_cameras,
                    image : LinkSlip !== null ? LinkSlip : '',
                }
            ], { session });
        }
        

        await session.commitTransaction();
        session.endSession();
        console.log("Booking created successfully");
        res.status(201).json({ message: "Booking created successfully" });

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error(err);
        res.status(500).json({ message: "Failed to create booking", error: err.message });
    }
};

exports.getAllEvent = async (req, res) => {
    const { role } = req.body
    try {
        const booking = await Booking.find();
        if (!booking) {
            return res.status(404).send("Booking data not found");
        }
        res.status(200).json({
            body: booking,
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.changeStatus = async (req, res) => {
    const { id, status } = req.body;
    try {
        const booking = await Booking.findOne({ _id: id });
        if (!booking) {
            return res.status(404).send("Booking data not found");
        }
        booking.status = status;
        await booking.save();
        res.status(200).json({
            body: booking,
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
};
