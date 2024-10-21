const { Booking, Room } = require('../../middleware/db');
const Image = require('../../middleware/superbase');
const mongoose = require('mongoose');
const sendMail = require('../../middleware/sendmail');

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

exports.getOneBookingById = async (req, res) => {
    const { id } = req.params;
    try {
        const booking = await Booking.findOne({ _id: id });
        if (!booking) {
            return res.status(404).send("Booking data not found");
        }

        const room  = await Room.findOne({ type: booking.type });

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

exports.getOneBookingByType = async (req, res) => {
    const { type } = req.params;
    try {
        const booking = await Booking.findOne({ type: type });
        if (!booking) {
            return res.status(404).send("Booking data not found");
        }

       

        // const correspondingRoom = rooms.find(room => room.type === booking.type);
        //     return {
        //         _id: booking._id,
        //         room_name: booking.room_name,
        //         type: booking.type,
        //         email: booking.email,
        //         user_name: booking.user_name,
        //         phone: booking.phone,
        //         user_name_2: booking.user_name_2,
        //         phone_2: booking.phone_2,
        //         special_request: booking.special_request,
        //         check_in_date: booking.check_in_date,
        //         check_out_date: booking.check_out_date,
        //         total_price: booking.total_price,
        //         total_cats: booking.total_cats,
        //         total_rooms: booking.total_rooms,
        //         status: booking.status,
        //         pay_way: booking.pay_way,
        //         total_cameras: booking.total_cameras,
        //         optional_services: booking.optional_services,
        //         image: booking.image,
        //         imageRoom: correspondingRoom ? correspondingRoom.image : null
        //     };

        res.status(200).json({
            body: booking,
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.updateBooking = async (req, res) => {
    try {
        const { user_name_2, phone_2, special_request, pay_way, image } = req.body;
        const { id } = req.params;

        const booking = await Booking.findOne({ _id: id });
        if (!booking) {
            return res.status(404).send("Booking data not found");
        }

        // update image 

        let LinkImage = '';

        if(image){
            LinkImage = await Image.uploadImage(image, "slip");
        }

        const updatedBooking = await Booking.findByIdAndUpdate
            (id, {
                user_name_2,
                phone_2,
                special_request,
                pay_way,
                image : LinkImage !== null ? LinkImage : booking.image,
            },
            { new: true });
    
        res.status(200).json({
            body: updatedBooking,
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
    const { role } = req.body;
    try {
        const bookings = await Booking.find();
        const rooms = await Room.find();

        if (!bookings || bookings.length === 0) {
            return res.status(404).send("Booking data not dsadasd");
        }

        const bookingDetails = bookings.map((booking) => {
            const correspondingRoom = rooms.find(room => room.type === booking.type);
            return {
                _id: booking._id,
                room_name: booking.room_name,
                type: booking.type,
                email: booking.email,
                user_name: booking.user_name,
                phone: booking.phone,
                user_name_2: booking.user_name_2,
                phone_2: booking.phone_2,
                special_request: booking.special_request,
                check_in_date: booking.check_in_date,
                check_out_date: booking.check_out_date,
                total_price: booking.total_price,
                total_cats: booking.total_cats,
                total_rooms: booking.total_rooms,
                status: booking.status,
                pay_way: booking.pay_way,
                total_cameras: booking.total_cameras,
                optional_services: booking.optional_services,
                image: booking.image,
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

exports.changeStatus = async (req, res) => {
    const { id, status } = req.body;
    try {
        const booking = await Booking.findOne({ _id: id });
        if (!booking) {
            return res.status(404).send("Booking data not found");
        }
        booking.status = status;
        await booking.save();

        const to = 'veeteteh29@gmail.com'
        const subject = 'Booking Status'
        const htmlContent = `<h1>Your fucking jian have fuck booking status has been changed to ${status}</h1>`
        sendMail(to, subject, htmlContent)

        res.status(200).json({
            body: booking,
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
};
