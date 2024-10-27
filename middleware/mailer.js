const nodemailer = require("nodemailer");
const { formatEmail } = require('../utils/tools');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    logger: true,
    debug: true,
    secureConnection: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: true
    }
});

exports.sendMail = async (booking) => {
    console.log('sendMail:', booking);
    if(booking.status === 'pass') {
        emailSubject = 'Booking Successful';
        emailText = (await formatEmail(booking)).toString();
    }else if(booking.status === 'failed') {
        emailSubject = 'Booking Rejected';
        emailText = (await formatEmail(booking)).toString();
    }else{
        emailSubject = 'Booking Pending';
        emailText = (await formatEmail(booking)).toString();
    }
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'adisak.2457@gmail.com',
        // to: booking.email,
        subject: emailSubject,
        html: emailText
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
            return res.status(400).send(error.message);
        } else {
            console.log('Email sent:', info.response);
            return res.status(200).send('Email sent');
        }
    });
};