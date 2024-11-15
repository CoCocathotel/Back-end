const { User } = require('../../middleware/db');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const crypto = require('crypto');


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        { expiresIn: "1h" }
      );

      user.token = token;
      await user.save();

      res.status(200).json(user);
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    res.status(500).send("Server error");
  }
};

exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!(email && password && first_name && last_name)) {
      return res.status(400).send("All input is required");
    }

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User already exists. Please login");
    }

    // Encrypt password
    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      { expiresIn: "2h" }
    );

    user.token = token;

    res.status(201).json(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { first_name, last_name } = req.body;
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send("User data not found");
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { first_name, last_name },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send("User data not found");
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Change Password Function
exports.changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { old_password, new_password } = req.body;

    // Find user by ID
    const user = await User.findById(id); 
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Verify old password
    const isMatch = await bcrypt.compare(old_password, user.password);
    if (!isMatch) {
      return res.status(400).send("Old password is incorrect");
    }

    // Encrypt the new password
    const encryptedPassword = await bcrypt.hash(new_password, 10);

    // Update the user's password with the encrypted new password
    user.password = encryptedPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).send("Server error");
  }
};
exports.checkEmailExists = async (req, res) => {
  try {
    const { email } = req.params;
    const existingUser = await User.findOne({ email });
    res.status(200).json({ exists: !!existingUser });
  } catch (error) {
    res.status(500).send("Server error");
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour
    await user.save();

    // Send reset email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested to reset your password.\n\n
             Please click on the following link, or paste this into your browser to complete the process within one hour:\n\n
             ${process.env.FRONTEND_URL}/reset-password/${resetToken}\n\n
             If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send("Error sending email");
      }
      res.status(200).send("Reset password email sent");
    });
  } catch (error) {
    res.status(500).send("Server error");
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { new_password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send("Password reset token is invalid or has expired");
    }

    // Encrypt the new password
    const encryptedPassword = await bcrypt.hash(new_password, 10);
    user.password = encryptedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).send("Password has been updated");
  } catch (error) {
    res.status(500).send("Server error");
  }
};