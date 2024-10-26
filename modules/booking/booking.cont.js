// Import necessary modules
const { Booking, Room } = require('../../middleware/db');
const Image = require('../../middleware/superbase');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

// Configure the nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use a well-known service or specify custom SMTP
    port:465,
    secure: true,
    logger: true,
    debug: true,
    secureConnection:false,
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASSWORD // Your email password or app password
    },
    tls:{
        rejectUnauthorized:true
    }
});

// Get all bookings
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
                    pay_way,
                    total_cameras,
                    image: LinkSlip,
                }
            ], { session });
        }

        await session.commitTransaction();
        session.endSession();
        res.status(201).json({ message: "Booking created successfully" });
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

        booking.status = status;
        await booking.save();

        // Prepare the email content based on the status
        let emailSubject, emailText;

        if (status === 'pass') {
            emailSubject = 'Your Booking Confirmation';
            emailText = `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8f9fa; max-width: 600px; margin: auto; border-radius: 8px; border: 1px solid #ddd;">
                <div style="background-color: #E9F8FF; color: black; padding: 10px; border-radius: 8px 8px 0 0; text-align: center;">
                    <h2>Dear ${booking.user_name},</h2>
                </div>
                <div style="padding: 20px; background-color: white; border-radius: 0 0 8px 8px;">
                    <p>We are pleased to confirm your booking for <strong>${booking.room_name}</strong>. Your stay is scheduled from <strong>${booking.check_in_date}</strong> to <strong>${booking.check_out_date}</strong>.</p>
                    <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Room Name:</strong> ${booking.room_name}</p>
                        <p><strong>Check-in Date:</strong> ${booking.check_in_date}</p>
                        <p><strong>Check-out Date:</strong> ${booking.check_out_date}</p>
                        <p><strong>Total Price:</strong> ${booking.total_price}</p>
                    </div>
                    <p>Thank you for choosing our service! We are excited to welcome you soon.</p>
                    <p>If you have any questions, feel free to contact us via:</p>
                    <p><strong>Phone:</strong> +1 (234) 567-890</p>
                </div>
                <div style="font-size: 12px; color: #666; margin-top: 20px;">
                    <p>Best regards,<br>Your Service Team</p>
                </div>
            </div>`;
        } else if (status === 'failed') {
            emailSubject = 'Booking Unsuccessful';
            emailText = `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8f9fa; max-width: 600px; margin: auto; border-radius: 8px; border: 1px solid #ddd;">
                <div style="background-color: #E9F8FF; color: black; padding: 10px; border-radius: 8px 8px 0 0; text-align: center;">
                    <h2>Dear ${booking.user_name},</h2>
                </div>
                <div style="padding: 20px; background-color: white; border-radius: 0 0 8px 8px;">
                    <p>We regret to inform you that your booking for <strong>${booking.room_name}</strong> could not be processed. Please try again or contact our support team for assistance.</p>
                    <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Room Name:</strong> ${booking.room_name}</p>
                        <p><strong>Check-in Date:</strong> ${booking.check_in_date}</p>
                        <p><strong>Check-out Date:</strong> ${booking.check_out_date}</p>
                        <p><strong>Total Price:</strong> ${booking.total_price}</p>
                    </div>
                    <p>We apologize for the inconvenience and hope to assist you in the future.</p>
                    <p>You can reach us through the following channels:</p>
                    <p><strong>Phone:</strong> +1 (234) 567-890</p>
                </div>
                <div style="font-size: 12px; color: #666; margin-top: 20px;">
                    <p>Best regards,<br>Your Service Team</p>
                </div>
            </div>`;
        }

        // Send the email if it's a pass or failed status
        if (status === 'pass' || status === 'failed') {
            const mailOptions = {
                from: process.env.EMAIL_USER, // Sender address
                to: 'karwit2544@gmail.com',             // booking.email , if want to test use'mail@email.com'
                subject: emailSubject,        // Subject line
                html: emailText               // Plain text body
            };

            // Send email notification
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error sending email:', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });
        }

        res.status(200).json({
            body: booking,
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
};
