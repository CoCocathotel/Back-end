require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const cors = require("cors");
const AWS = require("aws-sdk");

const User = require("./model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
const Booking = require("./model/booking");
const Camera = require("./model/camera");
const Book_Camera = require("./model/booking_cam");
const multer = require("multer");
const bodyParser = require("body-parser");
const Room = require("./model/room");
// const { type } = require("express/lib/response");

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY


const supabase = createClient(supabaseUrl, supabaseKey)

// const s3 = new AWS.S3({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: process.env.AWS_REGION,
//     endpoint_url : process.env.AWS_ENDPOINT_URL
// });



const app = express();

app.use(cors());

app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));

app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.get("/v1/room", async (req, res) => {
    try {
        const room = await Room.find();
        const booking = await Booking.find();

        let data = {
            "room": room,
            "booking": booking
        }

        res.status(201).json({body: data});
    } catch (err) {
        res.json({ message: err });
    }
});

app.get("/v1/booking", async (req, res) => {
    try {
        const booking = await Booking.find();
        res.status(201).json({body: booking});
    } catch (err) {
        res.json({ message: err });
    }
});

app.get("/v1/room/:type", async (req, res) => {
    try {
        const room = await Room.find({type: req.params.type});
        res.status(201).json({body: room});
    } catch (err) {
        res.json({ message: err });
    }
});

app.post("/v1/book_room", async (req, res) => {
    try {
        const { room_name, 
            email,
             check_in_date,
              check_out_date,
               total_price,
                total_cats,
                status,
                 pay_way,
                 total_cameras,
                  image } = req.body;

      
        // if(!(room_name && email && check_in_date && check_out_date && total_price && total_cats && status && pay_way && total_cameras && image)){
        //     return res.status(400).send("All input is required");
        // }
        


        const booking = await Booking.create({
            room_name,
            email,
            check_in_date,
            check_out_date,
            total_price,
            total_cats,
            status,
            pay_way,
            total_cameras,
            image
        });

        res.status(201).json({body : booking} );

    } catch (err) {
        res.json({ message: err });
    }
});




app.get("/v2/superbase", async (req, res) => {
    try {
        const { data, error } = await supabase
            .storage
            .from('rooms')
            .list('', {
                limit: 100,
                offset: 0,
                sortBy: { column: 'name', order: 'asc' },
            })

        if (error) {
            return res.status(400).send("Error searching for folders");
        }
        const room = data.map(room => room.name);
        
        // get img in room superbase

        let img_data = [];
        for(let i = 0; i < room.length; i++){
            const { data, error } = await supabase
            .storage
            .from('rooms')
            .list(room[i], {
                limit: 100,
                offset: 0,
                sortBy: { column: 'name', order: 'asc' },
            })

            if (error) {
                return res.status(400).send("Error searching for folders");
            }
            const img = data.map(img => img.name);
            let imgjsn = {type: room[i], img: img};

            img_data.push(imgjsn);
        }
        res.status(200).json(img_data);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post("/v1/superbase", async (req, res) => {
    try {
        const { type } = req.body;
        const { data, error } = await supabase
            .storage
            .from('rooms')
            .list(type, {
                limit: 100,
                offset: 0,
                sortBy: { column: 'name', order: 'asc' },
            })

        if (error) {
            return res.status(400).send("Error searching for folders");
        }
        const room = data.map(room => "/" + type + "/" + room.name);
        res.status(200).json(room);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post("/v1/create_room", async (req, res) => {
    try {
        const { room_name, type, price, image, description, cameras, size, number_of_cats, number_of_rooms } = req.body;

        if (!(room_name && type && price && image && description && cameras && size && number_of_cats && number_of_rooms)) {
            return res.status(400).send("All input is required");
        }

        const { data: folders, error: listError } = await supabase
            .storage
            .from('rooms')
            .list('', { recursive: true });

        if (listError) {
            return res.status(400).send("Error searching for folders");
        }

        const folderExists = folders.some(folder => folder.name === type);

        if (folderExists) {
            return res.status(400).send("A folder with this room name already exists");
        }

        let imageBase64 = [];

        for (let i = 0; i < image.length; i++) {
            const base64Data = image[i].replace(/^data:image\/\w+;base64,/, "");
            const buf = Buffer.from(base64Data, "base64");
            const imageName = `${i}.png`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from("rooms")
                .upload(`${type}/${imageName}`, buf, {
                    cacheControl: '3600',
                    upsert: false,
                    contentType: 'image/png',
                    contentEncoding: 'base64',
                });

            if (uploadError) {
                return res.status(400).send("Error uploading image");
            } else {
                imageBase64.push(imageName);
            }
            console.log(uploadData);
        }

        if (imageBase64.length !== image.length) {
            return res.status(400).send("Error uploading image");
        }

        const room = await Room.create({
            room_name,
            type,
            price,
            image: imageBase64,
            description,
            cameras,
            size,
            number_of_cats,
            number_of_rooms,
        });

        res.status(201).json("Room created successfully");

    } catch (err) {
        res.json({ message: err });
    }
});


module.exports = app;
