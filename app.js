require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const compression = require("compression");

// const AWS = require("aws-sdk");

const User = require("./model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
const Booking = require("./model/booking");
const multer = require("multer");
const bodyParser = require("body-parser");
const Room = require("./model/room");
const Home = require("./model/home");
const Footer = require("./model/footer");
// const { type } = require("express/lib/response");

const { createClient } = require("@supabase/supabase-js");


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);
const app = express();

app.use(compression());

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());

// app.use(express.urlencoded({ extended: true }));
// app.use(compression());


app.get("/footer", async (req, res) => {
  try {
    const footer = await Footer.find();
    res.status(200).json({ body: footer });
  } catch (err) {
    res.json({ message: err });
  }
});


app.post("/update-footer", async (req, res) => {
  try {
    const { _id, headFooter, addressFooter, phoneFooter, lineFooter, tiktokFooter } = req.body;
    const footer = await Footer.findById(_id);

    if (!footer) {
      return res.status(404).send("Footer data not found");
    }

    footer.headFooter = headFooter;
    footer.addressFooter = addressFooter;
    footer.phoneFooter = phoneFooter;
    footer.lineFooter = lineFooter;
    footer.tiktokFooter = tiktokFooter;

    await footer.save();

    res.status(200).send("Footer data updated successfully");
  } catch (err) {
    res.json({ message: err });
  }
});

app.post("/create-footer", async (req, res) => {
  try {
    const { headFooter, addressFooter, phoneFooter, lineFooter, tiktokFooter } = req.body;
    const footer = await Footer.create({
      headFooter,
      addressFooter,
      phoneFooter,
      lineFooter,
      tiktokFooter,
    });

    res.status(200).send("Footer data created successfully");
  } catch (err) {
    res.json({ message: err });
  }
});


app.get("/", async (req, res) => {
  try {
    const room = await Room.find();
    const booking = await Booking.find();
    res.status(200).json({
      body: {
        room: room,
        booking: booking,
      },
    });
  } catch (err) {
    res.json({ message: err });
  }
});

// home 
app.use('/home', async (req, res) => {
  try {
    const room = await Room.find();
    const booking = await Booking.find();
    res.status(200).json({
      body: {
        room: room,
        booking: booking,
      },
    });
  } catch (err) {
    res.json({ message: err });
  }
});

const upLoadSupeebase = (file) => {
  const base64 = file.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");
  return buffer;
};

app.post('/addHome', async (req, res) => {
  const { heroImage, title, reviewImage, mapImage, mapDetail } = req.body;

  const uploadImages = async (images, folderName) => {
    if (!images || images.length === 0) return [];

    try {
      const imageNames = images.map((file) => file.name);
      const imageBase64 = images.map((file) => upLoadSupeebase(file));


      const uploadResults = await Promise.all(
        imageNames.map((name, index) =>
          supabase.storage
            .from("homePage")
            .upload(`${folderName}/${index}-${Date.now().toString()}`, imageBase64[index], {
              upsert: false,
              contentType: "image/png",
            })
        ),
      );

      const errors = uploadResults.filter(({ error }) => error);
      if (errors.length > 0) {
        console.error(errors);
        throw new Error(`Error uploading ${folderName} images`);
      }

      const uploadedFileNames = uploadResults.map(({ data }) => data.path);
      console.log(uploadedFileNames);
      return uploadedFileNames
      // return uploadedFileNames.map((name) => {
      //   const { publicURL } = supabase.storage
      //     .from("homePage")
      //     .getPublicUrl(`${name}`);
      //     console.log(name);
      //   return name;
      // });
    } catch (err) {
      console.error(`Error while uploading ${folderName} images:`, err);
      throw new Error(`Failed to upload images for ${folderName}`);
    }
  };

  try {

    let heroImageUrls = [];
    let reviewImageUrls = [];
    let mapImageUrls = [];

    heroImageUrls = await uploadImages(heroImage, 'heroImage');
    reviewImageUrls = await uploadImages(reviewImage, 'reviewImage');
    mapImageUrls = await uploadImages([mapImage], 'mapImage')

    console.log(heroImageUrls, reviewImageUrls, mapImageUrls);

    const home = await Home.create({
      heroImage: heroImageUrls,
      title,
      reviewImage: reviewImageUrls,
      mapImage: mapImageUrls,
      mapDetail,
    });

    res.status(200).send("Images uploaded and saved successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
});


 app.patch('/updateHome', async (req, res) => {
  const { _id, heroImage, title, reviewImage, mapImage, mapDetail } = req.body;
  const home = await Home.findById(_id);

  if (!home) {
    return res.status(404).send("Home data not found");
  }

  const uploadImages = async (images, folderName) => {
    try {
      const imageBase64 = images.map((file) => upLoadSupeebase(file));

      // อัปโหลดรูปภาพไปที่ Supabase โดยไม่ต้องรอผลลัพธ์
      const uploadResults = await Promise.all(
        images.map((file, index) =>
          supabase.storage
            .from("homePage")
            .upload(`${folderName}/${index}-${Date.now().toString()}`, imageBase64[index], {
              upsert: false,
              contentType: "image/png",
            })
        )
      );

      const uploadedFileNames = uploadResults.map(({ data }) => data?.path || null); // ไม่สนใจว่าอัปโหลดได้หรือไม่
      return uploadedFileNames.filter((path) => path); // return เฉพาะ path ที่อัปโหลดสำเร็จ
    } catch (error) {
      console.error('Image upload failed:', error); // ยัง log error ไว้ แต่ไม่ส่ง error กลับ
      return [];
    }
  };

  try {
    // Upload heroImage
    if (heroImage) {
      const heroImageUrl = await uploadImages(heroImage, 'heroImage');
      home.heroImage = heroImageUrl;
    }

    // Upload reviewImage
    if (reviewImage) {
      const reviewImageUrl = await uploadImages(reviewImage, 'reviewImage');
      home.reviewImage = reviewImageUrl;
    }

    // Upload mapImage
    if (mapImage) {
      const mapImageUrl = await uploadImages([mapImage], 'mapImage');
      home.mapImage = mapImageUrl;
    }

    // Update other fields
    home.title = title;
    home.mapDetail = mapDetail;

    // Save the updated home data
    const updatedHome = await Home.findByIdAndUpdate(
      _id,
      {
        heroImage: home.heroImage,
        title: home.title,
        reviewImage: home.reviewImage,
        mapImage: home.mapImage,
        mapDetail: home.mapDetail,
      },
      { new: true }
    );

    console.log(updatedHome);

    res.status(200).send("Home data updated successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
});


app.get('/getHome', async (req, res) => {

  try {
    const home = await Home.find();
    if (!home) {
      return res.status(404).send("Home data not found");
    }
    res.status(200).json({
      body: home,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post("/v1/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All input is requried");
    }

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User already exist. please login");
    }

    encryptedPassword = await bcrypt.hash(password, 10);
    // console.log(encryptedPassword);

    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    user.token = token;

    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});

app.post("/v1/cart", async (req, res) => {
  // find all booking of  user with email
  try {
    const { email, pos } = req.body;

    if (!email && !pos) {
      return res.status(400).send("All input is required");
    }
    // console.log(pos);
    // const booking = await Booking.find({ email: email });
    // console.log("user");
    // res.status(201).json({ body: booking });
    if (pos === "admin") {
      const booking = await Booking.find();
      // console.log("admin");
      res.status(201).json({ body: booking });
    } else {
      const booking = await Booking.find({ email: email });
      // console.log("user");
      res.status(201).json({ body: booking });
    }
  } catch (err) {
    res.json({ message: err });
  }
});

app.get("/v1/booking/:id", async (req, res) => {
  try {
    const booking = await Booking.find({ _id: req.params.id });
    // console.log(booking);
    res.status(201).json({ body: booking });
  } catch (err) {
    res.json({ message: err });
  }
});

app.post("/v1/update-status", async (req, res) => {
  try {
    const { id, status } = req.body;

    // console.log(id, " ", status);

    if (!id && !status) {
      return res.status(400).send("All input is required");
    }

    const booking = await Booking.findOne({ _id: id });
    booking.status = status;
    await booking.save();
    res.status(201).json({ body: booking });
  } catch (err) {
    res.json({ message: err });
  }
});

app.post("/v1/login", async (req, res) => {
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
        {
          expiresIn: "1h",
        }
      );

      user.token = token;
      await user.save();

      res.status(200).json(user);
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/v1/room/:type", async (req, res) => {
  try {
    const room = await Room.find({ type: req.params.type });
    res.status(201).json({ body: room });
  } catch (err) {
    res.json({ message: err });
  }
});

app.post("/v1/edit_book_room", async (req, res) => {
  const { _id, user_name_2, phone_2, special_request, pay_way, image } =
    req.body;

  // Find the booking by its ID
  const booking = await Booking.findOne({ _id: _id });

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  // Prepare an object with only non-null and non-empty values
  const updatedFields = {};

  if (user_name_2 !== null && user_name_2 !== "")
    updatedFields.user_name_2 = user_name_2;
  if (phone_2 !== null && phone_2 !== "") updatedFields.phone_2 = phone_2;
  if (special_request !== null && special_request !== "")
    updatedFields.special_request = special_request;
  if (pay_way !== null && pay_way !== "") updatedFields.pay_way = pay_way;
  if (image !== null && image !== "") updatedFields.image = image;

  try {
    // Update the booking document in the database
    await Booking.updateOne({ _id: _id }, { $set: updatedFields });

    return res.status(200).json({ message: "Booking updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error updating booking", error });
  }
});

app.post("/v1/book_room", async (req, res) => {
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

    let total_cats_All = total_cats;
    let collect = [];

    // Distribute total cats among rooms
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
          image,
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
});

app.post("/v1/delete_book_room", async (req, res) => {
  const { _id } = req.body;

  try {
    // Check if the booking exists
    const booking = await Booking.findOne({ _id: _id });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Delete the booking
    await Booking.deleteOne({ _id: _id });

    return res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting booking", error });
  }
});

app.post("/v1/create_room", async (req, res) => {
  try {
    const {
      room_name,
      type,
      price,
      image,
      description,
      cameras,
      optional_services,
      number_of_cats,
      number_of_rooms,
    } = req.body;

    if (
      !(
        room_name &&
        type &&
        price &&
        image &&
        description &&
        cameras &&
        number_of_cats &&
        number_of_rooms
      )
    ) {
      return res.status(400).send("All input is required");
    }

    const { data: folders, error: listError } = await supabase.storage
      .from("rooms")
      .list("", { recursive: true });

    if (listError) {
      return res.status(400).send("Error searching for folders");
    }

    const folderExists = folders.some((folder) => folder.name === type);

    if (folderExists) {
      return res
        .status(400)
        .send("A folder with this room name already exists");
    }

    let imageBase64 = [];

    for (let i = 0; i < 1; i++) {
      const base64Data = image[i].replace(/^data:image\/\w+;base64,/, "");
      const buf = Buffer.from(base64Data, "base64");
      console.log("img = ", base64Data);
      const imageName = `${i}.png`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("rooms")
        .upload(`${type}/${imageName}`, buf, {
          // cacheControl: "3600",
          upsert: false,
          contentType: "image/png",
          // contentEncoding: "base64",
        });

      if (uploadError) {
        return res.status(400).send("Error uploading image");
      } else {
        imageBase64.push(imageName);
      }
    }

    // if (imageBase64.length !== image.length) {
    //   return res.status(400).send("Error uploading image");
    // }

    let room = await Room.create({
      room_name,
      type,
      price,
      image: imageBase64,
      description,
      cameras,
      optional_services,
      number_of_cats,
      number_of_rooms,
    });

    console.log(room);

    res.status(201).json("Room created successfully");
  } catch (err) {
    res.json({ message: err });
  }
});

app.post("/v1/edit_room", async (req, res) => {
  try {
    const {
      room_id,
      room_name,
      type,
      price,
      image,
      description,
      cameras,
      optional_services,
      number_of_cats,
      number_of_rooms,
    } = req.body;

    // ตรวจสอบว่า room_id ถูกส่งมาหรือไม่
    if (!room_id) {
      return res.status(400).json({ message: "Room ID is required." });
    }

    // หา room ในฐานข้อมูล
    const existingRoom = await Room.findById(room_id);

    if (!existingRoom) {
      return res.status(404).json({ message: "Room not found." });
    }

    // อัปเดตรูปภาพใน Superbase ถ้ามีการเปลี่ยนแปลง
    let imageBase64 = existingRoom.image; // รูปภาพเดิม
    if (image && image.length > 0) {
      // ลบรูปภาพเก่าจาก Superbase
      const { error: deleteError } = await supabase.storage
        .from("rooms")
        .remove(existingRoom.image.map((img) => `${existingRoom.type}/${img}`));

      if (deleteError) {
        return res
          .status(500)
          .json({
            message: "Error deleting old images from storage",
            error: deleteError.message,
          });
      }

      // อัปโหลดรูปภาพใหม่ไปยัง Superbase
      imageBase64 = [];
      for (let i = 0; i < 1; i++) {
        const base64Data = image[i].replace(/^data:image\/\w+;base64,/, "");
        const buf = Buffer.from(base64Data, "base64");
        const imageName = `${i}.png`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("rooms")
          .upload(`${type}/${imageName}`, buf, {
            upsert: false,
            contentType: "image/png",
          });

        if (uploadError) {
          return res
            .status(500)
            .json({
              message: "Error uploading new images",
              error: uploadError.message,
            });
        }

        imageBase64.push(imageName);
      }
    }

    // อัปเดตข้อมูลห้องใน MongoDB
    const updatedRoom = await Room.findByIdAndUpdate(
      room_id,
      {
        room_name,
        type,
        price,
        image: imageBase64,
        description,
        cameras,
        optional_services,
        number_of_cats,
        number_of_rooms,
      },
      { new: true }
    );

    res.json({ message: "Room updated successfully", room: updatedRoom });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/v1/delete_room", async (req, res) => {
  try {
    const { room_id } = req.body; // Get room_id from client request

    // Check if room_id is provided
    if (!room_id) {
      return res.status(400).json({ message: "Room ID is required." });
    }

    // Find the room in the database
    const room = await Room.findById(room_id);
    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }

    // Log the folder path to be deleted
    const folderPath = `${room.type}`;
    console.log(`Deleting folder: ${folderPath}`);

    // Delete the folder related to the room type from Supabase storage
    const { error: deleteFolderError } = await supabase.storage
      .from("rooms")
      .remove([folderPath]);

    if (deleteFolderError) {
      console.error(`Error deleting folder: ${deleteFolderError.message}`);
      return res
        .status(500)
        .json({
          message: "Error deleting folder from storage",
          error: deleteFolderError.message,
        });
    }

    // Delete the room from MongoDB
    await Room.findByIdAndDelete(room_id);

    // Send success response when both folder and room are deleted
    res.json({
      message: "Room and associated folder deleted successfully",
      room,
    });
  } catch (err) {
    console.error(`Error in deleting room: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});






























module.exports = app;
