const nodemailer = require('nodemailer');

// Configure the transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use a well-known service or specify custom SMTP
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASSWORD // Your email password or app password
    }
});

// Function to send email
const sendEmail = async (to, subject, htmlContent) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender address
            to: to, // List of recipients
            subject: subject, // Subject line
            html: htmlContent // HTML content of the email
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;
