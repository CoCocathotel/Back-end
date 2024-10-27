// Import necessary modules
const { Booking, Room } = require('../../middleware/db');
const Image = require('../../middleware/superbase');
const mongoose = require('mongoose');
const { sendMail } = require('../../middleware/mailer');

exports.getBooking = async (req, res) => {
    try {
        const booking = await Booking.find();
        if (!booking || booking.length === 0) {
            return res.status(404).send("Booking data not found");
        }
        res.status(200).json({
            body: booking,
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// Get one booking by ID
exports.getOneBookingById = async (req, res) => {
    const { id } = req.params;
    try {
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).send("Booking data not found");
        }

        const room = await Room.findOne({ type: booking.type });
        const data = {
            ...booking._doc,
            imageRoom: room ? room.image : null
        }

        res.status(200).json({
            body: data,
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// Get one booking by type
exports.getOneBookingByType = async (req, res) => {
    const { type } = req.params;
    try {
        const booking = await Booking.findOne({ type: type });
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

// Update booking details
exports.updateBooking = async (req, res) => {
    try {
        const { user_name_2, phone_2, special_request, pay_way, image } = req.body;
        const { id } = req.params;

        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).send("Booking data not found");
        }

        let LinkImage = booking.image;
        if (image) {
            LinkImage = await Image.uploadImage(image, "slip");
        }

        booking.user_name_2 = user_name_2;
        booking.phone_2 = phone_2;
        booking.special_request = special_request;
        booking.pay_way = pay_way;
        booking.image = LinkImage;

        await booking.save();

        res.status(200).json({
            body: booking,
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// Create a new booking
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
        if (image) {
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
                    pay_way: pay_way ? pay_way : 'walk-in',
                    total_cameras,
                    image: LinkSlip,
                }
            ], { session });
        }
        await session.commitTransaction();
        session.endSession();
        const updatedBooking = await Promise.all([
            sendMail({
                room_name,
                type,
                email,
                user_name,
                // phone,
                // user_name_2,
                // phone_2,
                // special_request,
                // optional_services,
                check_in_date,
                check_out_date,
                total_price,
                // total_cats,
                // total_rooms,
                status,
                pay_way,
                total_cameras,
                // image,
            })
        ]);
        res.status(201).json({ message: updatedBooking });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: "Failed to create booking", error: err.message });
    }
};

// Get all booking events
exports.getAllEvent = async (req, res) => {
    try {
        const bookings = await Booking.find();
        const rooms = await Room.find();

        if (!bookings || bookings.length === 0) {
            return res.status(404).send("Booking data not found");
        }

        const bookingDetails = bookings.map((booking) => {
            const correspondingRoom = rooms.find(room => room.type === booking.type);
            return {
                ...booking._doc,
                imageRoom: correspondingRoom ? correspondingRoom.image : null
            };
        });

        res.status(200).json({
            body: bookingDetails,
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// Change booking status and send email notification
exports.changeStatus = async (req, res) => {
    const { id, status } = req.body;

    try {
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).send("Booking data not found");
        }
        const updatedBooking = await Promise.all([
            booking.save(),
            sendMail(booking)
        ]);
        res.status(200).json({
            body: updatedBooking,
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
};
