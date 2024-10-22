const nodemailer = require("nodemailer");

// Configure the transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // Use a well-known service or specify custom SMTP
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASSWORD, // Your email password or app password
  },
});

// Function to send email
const sendEmail = async (to, subject, booking) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: to, // List of recipients
      subject: subject, // Subject line
      html: htmlContent(booking), // HTML content of the email
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Updated function to include booking details
const htmlContent = (booking) => {
  return `
    <header>
        <h1>Hi ${booking.email}!</h1> <!-- Personalizing the greeting -->
        <p>Your booking status has been updated to: <strong>${booking.status}</strong>.</p>
        <p>Thank you for using our service.</p>
    </header>
    <body>
        <p>Booking ID: ${booking._id}</p>
        <p>Room Name: ${booking.room_name}</p>
        <p>Check-in Date: ${booking.check_in_date}</p>
        <p>Check-out Date: ${booking.check_out_date}</p>
        <p>Total Price: ${booking.total_price}</p>
    </body>
    <footer>
        <p>Best regards,</p>
        <p>Your Booking App</p>
    </footer>
  `;
};

module.exports = sendEmail;
