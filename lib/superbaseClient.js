

// // get
// app.get("/booking", async (req, res) => {
//   try {
//     const bookings = await Booking.find();
//     res.json(bookings);
//   } catch (err) {
//     res.json({ message: err });
//   }
// });

// app.post("/find_room", async (req, res) => {
//   try {
//     const { cin, cout } = req.body;

//     const cinDate = new Date(cin);
//     const coutDate = new Date(cout);

//     const startOfCin = new Date(cinDate.setHours(0, 0, 0, 0));
//     const endOfCin = new Date(cinDate.setHours(23, 59, 59, 999));
//     const startOfCout = new Date(coutDate.setHours(0, 0, 0, 0));
//     const endOfCout = new Date(coutDate.setHours(23, 59, 59, 999));

//     const bookings = await Booking.find({
//       $or: [
//         { cin: { $lt: endOfCout, $gte: startOfCin } },
//         { cout: { $gt: startOfCin, $lte: endOfCout } },
//         { cin: { $lte: startOfCin }, cout: { $gte: endOfCout } },
//       ],
//     });

//     const rooms = await Product.find();
//     const availableRooms = rooms.filter((room) => {
//       const roomBookings = bookings.filter(
//         (booking) => booking.room === room.name
//       );
//       return roomBookings.length === 0;
//     });

//     res.json(availableRooms);
//   } catch (err) {
//     res.json({ message: err });
//   }
// });

// app.post("/find_room/:name", async (req, res) => {
//   try {
//     const { cin, cout } = req.body;

//     // Convert cin and cout to Date objects and strip the time part
//     const cinDate = new Date(cin);
//     const coutDate = new Date(cout);

//     // Set time to 00:00:00.000 for cin and 23:59:59.999 for cout
//     const startOfCin = new Date(cinDate.setHours(0, 0, 0, 0));
//     const endOfCin = new Date(cinDate.setHours(23, 59, 59, 999));
//     const startOfCout = new Date(coutDate.setHours(0, 0, 0, 0));
//     const endOfCout = new Date(coutDate.setHours(23, 59, 59, 999));

//     const room = await Product.findOne({ name: req.params.name });

//     if (!room) {
//       return res.json({ err: "Room not found" });
//     }

//     // const bookings = await Booking.find({
//     //   room: room.name,
//     //   $or: [
//     //     { cin: { $lt: endOfCout, $gte: startOfCin } },
//     //     { cout: { $gt: startOfCin, $lte: endOfCout } },
//     //     { cin: { $lte: startOfCin }, cout: { $gte: endOfCout } },
//     //   ],
//     // });

//     const bookings = await Booking.find({
//       room: room.name,
//       $or: [
//         { cin: { $lt: endOfCin, $gte: startOfCin } },
//         { cout: { $gt: startOfCin, $lte: endOfCout } },
//         { cin: { $lte: startOfCout }, cout: { $gte: endOfCout } },
//       ],
//     });

//     if (bookings.length === 0) {
//       res.json({ err: "" });
//     } else {
//       res.json({ err: "Room is not available" });
//     }
//   } catch (err) {
//     res.json({ message: err });
//   }
// });

// app.post("/booking", async (req, res) => {
//   try {
//     const bookings = await Booking.find();
//     res.json(bookings);
//   } catch (err) {
//     res.json({ message: err });
//   }
// });

// // หา hotel ที่ _id ตรงกับที่ส่งมา
// app.get("/hotel/:_id", async (req, res) => {
//   try {
//     const hotel = await Product.findById(req.params._id);
//     // console.log(hotel);
//     res.json(hotel);
//   } catch (err) {
//     res.json({ message: err });
//   }
// });

// app.get("/hotel", async (req, res) => {
//   try {
//     const hotel = await Product.find();
//     res.json(hotel);
//   } catch (err) {
//     res.json({ message: err });
//   }
// });

// // post

// app.post("/register", async (req, res) => {
//   try {
//     const { first_name, last_name, email, password } = req.body;

//     if (!(email && password && first_name && last_name)) {
//       res.status(400).send("All input is requried");
//     }

//     const oldUser = await User.findOne({ email });

//     if (oldUser) {
//       return res.status(409).send("User already exist. please login");
//     }

//     encryptedPassword = await bcrypt.hash(password, 10);
//     console.log(encryptedPassword);

//     const user = await User.create({
//       first_name,
//       last_name,
//       email: email.toLowerCase(),
//       password: encryptedPassword,
//     });

//     const token = jwt.sign(
//       { user_id: user._id, email },
//       process.env.TOKEN_KEY,
//       {
//         expiresIn: "2h",
//       }
//     );

//     user.token = token;

//     res.status(201).json(user);
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!(email && password)) {
//       return res.status(400).send("All input is required");
//     }

//     const user = await User.findOne({ email });

//     if (user && (await bcrypt.compare(password, user.password))) {
//       const token = jwt.sign(
//         { user_id: user._id, email },
//         process.env.TOKEN_KEY,
//         {
//           expiresIn: "1h",
//         }
//       );

//       user.token = token;
//       await user.save();

//       res.status(200).json(user);
//     } else {
//       res.status(400).send("Invalid Credentials");
//     }
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.post("/welcome", auth, (req, res) => {
//   res.status(200).send("Welcome");
// });

// app.post("/camera", auth, async (req, res) => {
//   try {
//     const { camera, brand, model } = req.body;

//     if (camera === undefined) {
//       return res.status(400).send("Camera count is required");
//     }

//     const newCamera = await Camera.create({ camera, brand, model });

//     res.status(201).json(newCamera);
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.put("/updateCameraCount", auth, async (req, res) => {
//   try {
//     const { cameraCount } = req.body;

//     if (cameraCount === undefined || cameraCount < 0) {
//       return res.status(400).send("Valid camera count is required");
//     }

//     const cameraData = await Camera.findOne();
//     if (!cameraData) {
//       return res.status(404).send("Camera data not found");
//     }

//     cameraData.camera = cameraCount;
//     await cameraData.save();

//     res.status(200).json(cameraData);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// //create
// app.post("/products", auth, async (req, res) => {
//   try {
//     const { name, price, type, description, image } = req.body;

//     if (!(name && price > 0 && type && description)) {
//       return res
//         .status(400)
//         .send("All input is required and stock must be a non-negative number");
//     }

//     const product = await Product.create({
//       name,
//       price,
//       type,
//       description,
//       image,
//     });

//     res.status(201).json(product);
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.get("/v1/cam_test", async (req, res) => {
//   const cin = new Date("2024-08-07T07:54:34.000Z");
//   const cout = new Date("2024-08-07T07:54:34.000Z");
//   console.log({ cin: cin, cout: cout });
//   try {
//     let arr = [];
//     let arr2 = [];
//     let arr3 = [];
//     const cameras = await Book_Camera.find();
//     const cam_product = await Camera.find();

//     for (let i = 0; i < cam_product.length; i++) {
//       arr2.push(cam_product[i].camera);
//     }
//     for (let i = 0; i < cameras.length; i++) {
//       if (cameras[i].cin <= cout && cameras[i].cout >= cin) {
//         arr.push(cameras[i].camera);
//         console.log({
//           "cameras[i].camera": cameras[i].camera,
//           "cameras[i].cin": cameras[i].cin,
//           "cameras[i].cout": cameras[i].cout,
//         });
//       }
//     }

//     for (let i = 0; i < arr2.length; i++) {
//       if (!arr.includes(arr2[i])) {
//         arr3.push(arr2[i]);
//       }
//     }

//     // res.json(arr3[0]);
//   } catch (err) {
//     res.json({ message: err });
//   }
// });

// app.get("/v2/cam_test", async (req, res) => {
//   try {
//     const cameras = await Book_Camera.find();
//     res.json(cameras);
//   } catch (err) {
//     res.json({ message: err });
//   }
// });

// app.post("/check_cam", async (req, res) => {
//   try {
//     const { email, cin, cout, booking } = req.body;

//     if (!(email && cin && cout && booking)) {
//       return res.status(400).send("All input is required");
//     }

//     try {
//       const cin_n = new Date(cin);
//       const cout_n = new Date(cout);
//       let arr = [];
//       let arr2 = [];
//       let arr3 = [];

//       const cameras = await Book_Camera.find();
//       const cam_product = await Camera.find();

//       for (let i = 0; i < cam_product.length; i++) {
//         arr.push(cam_product[i].camera);
//       }

//       for (let i = 0; i < cameras.length; i++) {
//         let Old_start = cameras[i].cin;
//         let Old_End = cameras[i].cout;
//         let Start = cin_n;
//         let End = cout_n;
//         if (
//           (Start >= Old_start &&
//             Start <= Old_End &&
//             End >= Old_start &&
//             End <= Old_End) ||
//           (Start <= Old_start &&
//             Start <= Old_End &&
//             End >= Old_start &&
//             End <= Old_End) ||
//           (Start >= Old_start &&
//             Start <= Old_End &&
//             End >= Old_start &&
//             End >= Old_End)
//         ) {
//           arr2.push(cameras[i].camera);
//         }
//       }
//       for (let i = 0; i < arr.length; i++) {
//         if (!arr2.includes(arr[i])) {
//           arr3.push(arr[i]);
//           //   console.log(arr[i]);
//         }
//       }

//       if (arr3.length == 0) {
//         return res.status(404).send({message: "All camera is booked"});
//       }else{
//         res.status(201).json({ message: ""});
//       }
//     } catch (err) {
//       res.json({ message: err });
//     }
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.post("/create_cam", async (req, res) => {
//   try {
//     const { email, cin, cout, booking } = req.body;

//     if (!(email && cin && cout && booking)) {
//       return res.status(400).send("All input is required");
//     }

//     try {
//       const cin_n = new Date(cin);
//       const cout_n = new Date(cout);
//       let arr = [];
//       let arr2 = [];
//       let arr3 = [];

//       const cameras = await Book_Camera.find();
//       const cam_product = await Camera.find();

//       for (let i = 0; i < cam_product.length; i++) {
//         arr.push(cam_product[i].camera);
//       }

//       for (let i = 0; i < cameras.length; i++) {
//         if (cameras[i].cin <= cout_n && cameras[i].cout >= cin_n) {
//           arr2.push(cameras[i].camera);
//           console.log({
//             "cameras[i].camera": cameras[i].camera,
//             "cameras[i].cin": cameras[i].cin,
//             "cameras[i].cout": cameras[i].cout,
//           });
//         }
//       }

//       for (let i = 0; i < arr.length; i++) {
//         if (!arr2.includes(arr[i])) {
//           arr3.push(arr[i]);
//         }
//       }

//       if (arr3.length == 0) {
//         return res.status(400).send("All camera is booked");
//       }

//       let camera = arr3[0];

//       const newCam = await Book_Camera.create({
//         camera,
//         email,
//         cin,
//         cout,
//         booking,
//       });

//       res.status(201).json({ message: "Camera is booked", camera: camera });
//     } catch (err) {
//       res.json({ message: err });
//     }
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.post("/purchase", auth, async (req, res) => {
//   try {
//     const { product_id, image, email, cin, cout, camerasBooked, pay_way } =
//       req.body;

//     if (!product_id) {
//       return res.status(400).send("Product ID and camerasBooked are required");
//     }

//     if (!email || !cin || !cout) {
//       return res
//         .status(400)
//         .send("Email, check-in date, and check-out date are required");
//     }

//     //   if (new Date(cin) >= new Date(cout)) {
//     //     return res.status(400).send("Check-in date must be before check-out date");
//     //   }

//     const product = await Product.findById(product_id);
//     if (!product) {
//       return res.status(404).send("Product not found");
//     }

//     const cinDate = new Date(cin);
//     const coutDate = new Date(cout);

//     const startOfCin = new Date(cinDate.setHours(0, 0, 0, 0));
//     const endOfCin = new Date(cinDate.setHours(23, 59, 59, 999));
//     const startOfCout = new Date(coutDate.setHours(0, 0, 0, 0));
//     const endOfCout = new Date(coutDate.setHours(23, 59, 59, 999));

//     const bookings = await Booking.find({
//       $or: [
//         { cin: { $lt: endOfCin, $gte: startOfCin } },
//         { cout: { $gt: startOfCin, $lte: endOfCout } },
//         { cin: { $lte: startOfCout }, cout: { $gte: endOfCout } },
//       ],
//     });

//     const room = product.name;

//     const rooms = await Product.find();
//     const availableRooms = rooms.filter((room) => {
//       const roomBookings = bookings.filter(
//         (booking) => booking.room === room.name
//       );
//       return roomBookings.length === 0;
//     });

//     // console.log(availableRooms);
//     //   if (availableRooms.length > 0) {
//     //     return res.status(409).send("This period cannot be reserved.");
//     //   }

//     const booking = await Booking.create({
//       room,
//       email,
//       cin,
//       cout,
//       pay_way,
//       camerasBooked,
//       image,
//     });


//     // let availableCameras = [];

//     //   const cameras = await Book_Camera.find();
//     //   const cam_products = await Camera.find();

//     //   const allCameras = cam_products.map(cam => cam.camera);
//     //   const bookedCameras = cameras.filter(camera => camera.cin <= cout_n && camera.cout >= cin_n)
//     //                                 .map(camera => camera.camera);

//     //   availableCameras = allCameras.filter(cam => !bookedCameras.includes(cam));

//     //   if (availableCameras.length === 0) {
//     //     return res.status(400).send("All cameras are booked");
//     //   }

//     // const cin_n = new Date(cin);
//     //   const cout_n = new Date(cout);
//     if (camerasBooked != "") {
//       let arr = [];
//       let arr2 = [];
//       let arr3 = [];

//       const cin_n = new Date(cin);
//       const cout_n = new Date(cout);


//       const cameras = await Book_Camera.find();
//       const cam_product = await Camera.find();

//       for (let i = 0; i < cam_product.length; i++) {
//         arr.push(cam_product[i].camera);
//       }

//       for (let i = 0; i < cameras.length; i++) {
//         let Old_start = cameras[i].cin;
//         let Old_End = cameras[i].cout;
//         let Start = cin_n;
//         let End = cout_n;

//         if (
//           (Start >= Old_start &&
//             Start <= Old_End &&
//             End >= Old_start &&
//             End <= Old_End) ||
//           (Start <= Old_start &&
//             Start <= Old_End &&
//             End >= Old_start &&
//             End <= Old_End) ||
//           (Start >= Old_start &&
//             Start <= Old_End &&
//             End >= Old_start &&
//             End >= Old_End)
//         ) {
//           arr2.push(cameras[i].camera);
//           console.log("Ok");
//         }
//       }
//       for (let i = 0; i < arr.length; i++) {
//         if (!arr2.includes(arr[i])) {
//           arr3.push(arr[i]);
//           //   console.log(arr[i]);
//         }
//       }

//       if (arr3.length == 0) {
//         return res.status(400).send("All camera is booked");
//       }

//       await booking.save();
//       const booking_id = booking._id;

//       const newCam = await Book_Camera.create({
//         camera: arr3[0],
//         email,
//         cin,
//         cout,
//         booking: booking_id,
//       });

//       booking.camerasBooked = newCam._id;
//       await booking.save();
//     //   console.log({ arr: arr, arr2: arr2, arr3: arr3 });
//       res.status(201).json({ arr: arr, arr2: arr2, arr3: arr3 });
//     } else {
//       await booking.save();
//       res.status(201).json(booking);
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.post("/pay", auth, async (req, res) => {
//   try {
//     const { booking_id, image } = req.body;

//     if (!booking_id) {
//       return res.status(400).send("Booking ID is required");
//     }

//     const booking = await Booking.findById(booking_id);
//     if (!booking) {
//       return res.status(404).send("Booking not found");
//     }

//     if (booking.image === "paid") {
//       return res.status(400).send("Booking already paid");
//     }

//     booking.image = image;
//     await booking.save();

//     res.status(200).json(booking);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Internal Server Error");
//   }
// });




// // admin

// app.post("/paid", async (req, res) => {
//   try {
//     const { booking_id } = req.body;

//     if (!booking_id) {
//       return res.status(400).send("Booking ID is required");
//     }

//     const booking = await Booking.findById(booking_id);
//     if (!booking) {
//       return res.status(404).send("Booking not found");
//     }

//     booking.status = "paid";
//     await booking.save();

//     res.status(200).json(booking);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Internal Server Error");
//   }
// });