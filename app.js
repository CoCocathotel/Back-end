require('dotenv').config();
require('./config/database').connect();
const express = require('express');
const cors = require('cors');
const User = require('./model/user');
const bcrypt = require('bcryptjs');
const jwt = require ('jsonwebtoken');
const auth = require('./middleware/auth');
const Product = require('./model/product');
const Booking = require('./model/booking');
const Camera = require('./model/camera');
const multer = require('multer'); 
const bodyParser = require('body-parser'); 

const app = express();

app.use(cors())

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use(express.json());


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// get


  
app.get("/booking", async (req,res)=>{
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (err) {
        res.json({ message: err });
    }
});

app.post("/booking", async (req,res)=>{
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (err) {
        res.json({ message: err });
    }
});

app.get("/hotel", async (req,res)=>{
    try {
        const hotel = await Product.find();
        res.json(hotel);
    } catch (err) {
        res.json({ message: err });
    }
  });

app.get("/", async (req,res)=>{
    try {
        const user = await User.find();
        res.json(user);
    } catch (err) {
        res.json({ message: err });
    }
  });

// post

app.post("/register", async (req,res)=>{

    try{

        const{first_name, last_name, email, password}=req.body;

        if(!(email && password && first_name && last_name)){
            res.status(400).send("All input is requried");
        }

        const oldUser = await User.findOne({email});

        if(oldUser){
            return res.status(409).send("User already exist. please login")
        }

        encryptedPassword = await bcrypt.hash(password,10);
        console.log(encryptedPassword)

        const user = await User.create({
            first_name,
            last_name,
            email:email.toLowerCase(),
            password: encryptedPassword
        })

        const token = jwt.sign(
            {user_id: user._id,email},
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h"
            }
        )
    
        user.token = token 
    
        res.status(201).json(user);

    }catch (err){
        console.log(err);
    }

})

app.post("/login", async (req, res) => {
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
                    expiresIn: "1h"
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

app.post('/welcome', auth, (req, res) => {
    res.status(200).send('Welcome');
});

app.post('/camera', auth, async (req, res) => {
    try {
        const { camera } = req.body;

        if (camera === undefined) {
            return res.status(400).send("Camera count is required");
        }

        const newCamera = await Camera.create({ camera });

        res.status(201).json(newCamera);

    } catch (err) {
        console.log(err);
    }
});

app.put('/updateCameraCount', auth, async (req, res) => {
    try {
        const { cameraCount } = req.body;

        if (cameraCount === undefined || cameraCount < 0) {
            return res.status(400).send("Valid camera count is required");
        }

        const cameraData = await Camera.findOne();
        if (!cameraData) {
            return res.status(404).send("Camera data not found");
        }

        cameraData.camera = cameraCount;
        await cameraData.save();

        res.status(200).json(cameraData);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});


app.post('/products', auth, async (req, res) => {
    try {
        const { name, price, type, description, image } = req.body;

        if (!(name && price > 0 && type && description)) {
            return res.status(400).send("All input is required and stock must be a non-negative number");
        }

        const product = await Product.create({ name, price, type, description, image});

        res.status(201).json(product);

    } catch (err) {
        console.log(err);
    }
});

app.post('/purchase', auth, async (req, res) => {
    try {
        const { product_id, image, email, cin, cout, camerasBooked, pay_way } = req.body;
        // const { file } = req;

        if (!(product_id)) {
            return res.status(400).send("Product ID and camerasBooked are required");
        }

        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).send("Product not found");
        }

        if (cin > cout) {
            return res.status(404).send("cin cannot be more than cout");
        }

        const room = product.name;
        const overlappingBookings = await Booking.find({
            room,
            $or: [
                { cin: { $lt: cout, $gte: cin } },
                { cout: { $gt: cin, $lte: cout } },
                { cin: { $lte: cin }, cout: { $gte: cout } }
            ]
        });

        if (overlappingBookings.length > 0) {
            return res.status(409).send("This period cannot be reserved.");
        }

        const cameraData = await Camera.findOne();
        if (!cameraData || cameraData.camera < camerasBooked) {
            return res.status(400).send("No cameras available");
        }

        // const base64Image = image ? image.buffer.toString('base64') : null;
     
        const booking = await Booking.create({ room, email, cin, cout, pay_way, camerasBooked, image });
        cameraData.camera -= camerasBooked;
        await cameraData.save();
        await booking.save();

        res.status(200).json(booking);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/pay', auth, async (req, res) => {
    try {
        const { booking_id, image } = req.body;

        if (!booking_id) {
            return res.status(400).send("Booking ID is required");
        }

        const booking = await Booking.findById(booking_id);
        if (!booking) {
            return res.status(404).send("Booking not found");
        }

        if (booking.image === 'paid') {
            return res.status(400).send("Booking already paid");
        }

        booking.image = image;
        await booking.save();

        res.status(200).json(booking);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});



// admin

app.post('/paid', async (req, res) => {
    try {
        const { booking_id } = req.body;

        if (!booking_id) {
            return res.status(400).send("Booking ID is required");
        }

        const booking = await Booking.findById(booking_id);
        if (!booking) {
            return res.status(404).send("Booking not found");
        }

        booking.status = 'paid';
        await booking.save();

        res.status(200).json(booking);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = app;
