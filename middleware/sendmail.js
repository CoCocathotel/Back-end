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
const sendEmail = async (to, subject, status) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: to, // List of recipients
      subject: subject, // Subject line
      html: htmlContent(status), // HTML content of the email
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const htmlContent = (status) => {
  return `
            <header>
                <h1>Hi there!</h1>
                <p>This is a test email from your Node.js app.</p>
                <p>Have a great day!</p>
            </header>
            <body>
                <div>
                    <p>Here's a cat fact for you:</p>
                    <p>${status}</p>
                    <img src="https://instagram.fbkk28-1.fna.fbcdn.net/v/t39.30808-6/462208416_17925767696952258_4906195666931308970_n.jpg?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE0NDAuc2RyLmYzMDgwOC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=instagram.fbkk28-1.fna.fbcdn.net&_nc_cat=106&_nc_ohc=ZsIXRJA_Z0sQ7kNvgEcfriy&_nc_gid=e6fec9e5eeb44eda935ad10290b957f8&edm=ALQROFkAAAAA&ccb=7-5&ig_cache_key=MzQ3MjY5MDYxMDc2MTEwMzk2OQ%3D%3D.3-ccb7-5&oh=00_AYAu1DFqzaWPxAZdoNfamxo88_YC8kDMs4waRbpeeKknlw&oe=671C39E0&_nc_sid=fc8dfb" alt="Cat" />
                </div>
            </body>
            <footer>
                    <p>Best regards,</p>
                    <p>Your Node.js app</p>
            </footer>
        `;
};

module.exports = sendEmail;
