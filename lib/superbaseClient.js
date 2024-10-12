

// app.get("/footer", async (req, res) => {
//     try {
//       const footer = await Footer.find();
//       res.status(200).json({ body: footer });
//     } catch (err) {
//       res.json({ message: err });
//     }
//   });
  
//   app.post("/update-footer", async (req, res) => {
//     try {
//       const { _id, headFooter, addressFooter, phoneFooter, lineFooter, tiktokFooter } = req.body;
//       const footer = await Footer.findById(_id);
  
//       if (!footer) {
//         return res.status(404).send("Footer data not found");
//       }
  
//       footer.headFooter = headFooter;
//       footer.addressFooter = addressFooter;
//       footer.phoneFooter = phoneFooter;
//       footer.lineFooter = lineFooter;
//       footer.tiktokFooter = tiktokFooter;
  
//       await footer.save();
  
//       res.status(200).send("Footer data updated successfully");
//     } catch (err) {
//       res.json({ message: err });
//     }
//   });
  
//   app.post("/create-footer", async (req, res) => {
//     try {
//       const { headFooter, addressFooter, phoneFooter, lineFooter, tiktokFooter } = req.body;
//       const footer = await Footer.create({
//         headFooter,
//         addressFooter,
//         phoneFooter,
//         lineFooter,
//         tiktokFooter,
//       });
  
//       res.status(200).send("Footer data created successfully");
//     } catch (err) {
//       res.json({ message: err });
//     }
//   });
  
  
//   app.get("/", async (req, res) => {
//     try {
//       const room = await Room.find();
//       const booking = await Booking.find();
//       res.status(200).json({
//         body: {
//           room: room,
//           booking: booking,
//         },
//       });
//     } catch (err) {
//       res.json({ message: err });
//     }
//   });
  
//   // home 
//   app.use('/home', async (req, res) => {
//     try {
//       const room = await Room.find();
//       const booking = await Booking.find();
//       res.status(200).json({
//         body: {
//           room: room,
//           booking: booking,
//         },
//       });
//     } catch (err) {
//       res.json({ message: err });
//     }
//   });
  
//   const upLoadSupeebase = (file) => {
//     const base64 = file.replace(/^data:image\/\w+;base64,/, "");
//     const buffer = Buffer.from(base64, "base64");
//     return buffer;
//   };
  
//   app.post('/addHome', async (req, res) => {
//     const { heroImage, title, reviewImage, mapImage, mapDetail } = req.body;
  
//     const uploadImages = async (images, folderName) => {
//       if (!images || images.length === 0) return [];
  
//       try {
//         const imageNames = images.map((file) => file.name);
//         const imageBase64 = images.map((file) => upLoadSupeebase(file));
  
  
//         const uploadResults = await Promise.all(
//           imageNames.map((name, index) =>
//             supabase.storage
//               .from("homePage")
//               .upload(`${folderName}/${index}-${Date.now().toString()}`, imageBase64[index], {
//                 upsert: false,
//                 contentType: "image/png",
//               })
//           ),
//         );
  
//         const errors = uploadResults.filter(({ error }) => error);
//         if (errors.length > 0) {
//           console.error(errors);
//           throw new Error(`Error uploading ${folderName} images`);
//         }
  
//         const uploadedFileNames = uploadResults.map(({ data }) => data.path);
//         console.log(uploadedFileNames);
//         return uploadedFileNames
//         // return uploadedFileNames.map((name) => {
//         //   const { publicURL } = supabase.storage
//         //     .from("homePage")
//         //     .getPublicUrl(`${name}`);
//         //     console.log(name);
//         //   return name;
//         // });
//       } catch (err) {
//         console.error(`Error while uploading ${folderName} images:`, err);
//         throw new Error(`Failed to upload images for ${folderName}`);
//       }
//     };
  
//     try {
  
//       let heroImageUrls = [];
//       let reviewImageUrls = [];
//       let mapImageUrls = [];
  
//       heroImageUrls = await uploadImages(heroImage, 'heroImage');
//       reviewImageUrls = await uploadImages(reviewImage, 'reviewImage');
//       mapImageUrls = await uploadImages([mapImage], 'mapImage')
  
//       console.log(heroImageUrls, reviewImageUrls, mapImageUrls);
  
//       const home = await Home.create({
//         heroImage: heroImageUrls,
//         title,
//         reviewImage: reviewImageUrls,
//         mapImage: mapImageUrls,
//         mapDetail,
//       });
  
//       res.status(200).send("Images uploaded and saved successfully");
//     } catch (error) {
//       res.status(400).send(error.message);
//     }
//   });
  
  
//    app.patch('/updateHome', async (req, res) => {
//     const { _id, heroImage, title, reviewImage, mapImage, mapDetail } = req.body;
//     const home = await Home.findById(_id);
  
//     if (!home) {
//       return res.status(404).send("Home data not found");
//     }
  
//     const uploadImages = async (images, folderName) => {
//       try {
//         const imageBase64 = images.map((file) => upLoadSupeebase(file));
  
//         // อัปโหลดรูปภาพไปที่ Supabase โดยไม่ต้องรอผลลัพธ์
//         const uploadResults = await Promise.all(
//           images.map((file, index) =>
//             supabase.storage
//               .from("homePage")
//               .upload(`${folderName}/${index}-${Date.now().toString()}`, imageBase64[index], {
//                 upsert: false,
//                 contentType: "image/png",
//               })
//           )
//         );
  
//         const uploadedFileNames = uploadResults.map(({ data }) => data?.path || null); // ไม่สนใจว่าอัปโหลดได้หรือไม่
//         return uploadedFileNames.filter((path) => path); // return เฉพาะ path ที่อัปโหลดสำเร็จ
//       } catch (error) {
//         console.error('Image upload failed:', error); // ยัง log error ไว้ แต่ไม่ส่ง error กลับ
//         return [];
//       }
//     };
  
//     try {
//       // Upload heroImage
//       if (heroImage) {
//         const heroImageUrl = await uploadImages(heroImage, 'heroImage');
//         home.heroImage = heroImageUrl;
//       }
  
//       // Upload reviewImage
//       if (reviewImage) {
//         const reviewImageUrl = await uploadImages(reviewImage, 'reviewImage');
//         home.reviewImage = reviewImageUrl;
//       }
  
//       // Upload mapImage
//       if (mapImage) {
//         const mapImageUrl = await uploadImages([mapImage], 'mapImage');
//         home.mapImage = mapImageUrl;
//       }
  
//       // Update other fields
//       home.title = title;
//       home.mapDetail = mapDetail;
  
//       // Save the updated home data
//       const updatedHome = await Home.findByIdAndUpdate(
//         _id,
//         {
//           heroImage: home.heroImage,
//           title: home.title,
//           reviewImage: home.reviewImage,
//           mapImage: home.mapImage,
//           mapDetail: home.mapDetail,
//         },
//         { new: true }
//       );
  
//       console.log(updatedHome);
  
//       res.status(200).send("Home data updated successfully");
//     } catch (error) {
//       res.status(400).send(error.message);
//     }
//   });
  
  
//   app.get('/getHome', async (req, res) => {
  
//     try {
//       const home = await Home.find();
//       if (!home) {
//         return res.status(404).send("Home data not found");
//       }
//       res.status(200).json({
//         body: home,
//       });
//     } catch (error) {
//       res.status(400).send(error.message);
//     }
//   });
  
//   app.post("/v1/register", async (req, res) => {
//     try {
//       const { first_name, last_name, email, password } = req.body;
  
//       if (!(email && password && first_name && last_name)) {
//         res.status(400).send("All input is requried");
//       }
  
//       const oldUser = await User.findOne({ email });
  
//       if (oldUser) {
//         return res.status(409).send("User already exist. please login");
//       }
  
//       encryptedPassword = await bcrypt.hash(password, 10);
//       // console.log(encryptedPassword);
  
//       const user = await User.create({
//         first_name,
//         last_name,
//         email: email.toLowerCase(),
//         password: encryptedPassword,
//       });
  
//       const token = jwt.sign(
//         { user_id: user._id, email },
//         process.env.TOKEN_KEY,
//         {
//           expiresIn: "2h",
//         }
//       );
  
//       user.token = token;
  
//       res.status(201).json(user);
//     } catch (err) {
//       console.log(err);
//     }
//   });
  
//   app.post("/v1/cart", async (req, res) => {
//     // find all booking of  user with email
//     try {
//       const { email, pos } = req.body;
  
//       if (!email && !pos) {
//         return res.status(400).send("All input is required");
//       }
//       // console.log(pos);
//       // const booking = await Booking.find({ email: email });
//       // console.log("user");
//       // res.status(201).json({ body: booking });
//       if (pos === "admin") {
//         const booking = await Booking.find();
//         // console.log("admin");
//         res.status(201).json({ body: booking });
//       } else {
//         const booking = await Booking.find({ email: email });
//         // console.log("user");
//         res.status(201).json({ body: booking });
//       }
//     } catch (err) {
//       res.json({ message: err });
//     }
//   });
  
//   app.get("/v1/booking/:id", async (req, res) => {
//     try {
//       const booking = await Booking.find({ _id: req.params.id });
//       // console.log(booking);
//       res.status(201).json({ body: booking });
//     } catch (err) {
//       res.json({ message: err });
//     }
//   });
  
//   app.post("/v1/update-status", async (req, res) => {
//     try {
//       const { id, status } = req.body;
  
//       // console.log(id, " ", status);
  
//       if (!id && !status) {
//         return res.status(400).send("All input is required");
//       }
  
//       const booking = await Booking.findOne({ _id: id });
//       booking.status = status;
//       await booking.save();
//       res.status(201).json({ body: booking });
//     } catch (err) {
//       res.json({ message: err });
//     }
//   });
  
//   app.post("/v1/login", async (req, res) => {
//     try {
//       const { email, password } = req.body;
  
//       if (!(email && password)) {
//         return res.status(400).send("All input is required");
//       }
  
//       const user = await User.findOne({ email });
  
//       if (user && (await bcrypt.compare(password, user.password))) {
//         const token = jwt.sign(
//           { user_id: user._id, email },
//           process.env.TOKEN_KEY,
//           {
//             expiresIn: "1h",
//           }
//         );
  
//         user.token = token;
//         await user.save();
  
//         res.status(200).json(user);
//       } else {
//         res.status(400).send("Invalid Credentials");
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   });
  
//   app.get("/v1/room/:type", async (req, res) => {
//     try {
//       const room = await Room.find({ type: req.params.type });
//       res.status(201).json({ body: room });
//     } catch (err) {
//       res.json({ message: err });
//     }
//   });
  
//   app.post("/v1/edit_book_room", async (req, res) => {
//     const { _id, user_name_2, phone_2, special_request, pay_way, image } =
//       req.body;
  
//     // Find the booking by its ID
//     const booking = await Booking.findOne({ _id: _id });
  
//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }
  
//     // Prepare an object with only non-null and non-empty values
//     const updatedFields = {};
  
//     if (user_name_2 !== null && user_name_2 !== "")
//       updatedFields.user_name_2 = user_name_2;
//     if (phone_2 !== null && phone_2 !== "") updatedFields.phone_2 = phone_2;
//     if (special_request !== null && special_request !== "")
//       updatedFields.special_request = special_request;
//     if (pay_way !== null && pay_way !== "") updatedFields.pay_way = pay_way;
//     if (image !== null && image !== "") updatedFields.image = image;
  
//     try {
//       // Update the booking document in the database
//       await Booking.updateOne({ _id: _id }, { $set: updatedFields });
  
//       return res.status(200).json({ message: "Booking updated successfully" });
//     } catch (error) {
//       return res.status(500).json({ message: "Error updating booking", error });
//     }
//   });
  
//   app.post("/v1/book_room", async (req, res) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();
  
//     try {
//       const {
//         room_name,
//         type,
//         email,
//         user_name,
//         phone,
//         user_name_2,
//         phone_2,
//         special_request,
//         optional_services,
//         check_in_date,
//         check_out_date,
//         total_price,
//         total_cats,
//         total_rooms,
//         status,
//         pay_way,
//         total_cameras,
//         image,
//       } = req.body;
  
//       if (typeof total_cats === 'undefined' || total_cats === null) {
//         throw new Error("total_cats is required");
//       }
  
//       let total_cats_All = total_cats;
//       let collect = [];
  
//       // Distribute total cats among rooms
//       for (let i = 0; i < total_rooms; i++) {
//         if (total_cats_All > 0) {
//           const cats_in_room = Math.min(1, total_cats_All);
//           collect.push(cats_in_room);
//           total_cats_All -= cats_in_room;
//         } else {
//           collect.push(0);
//         }
//       }
  
//       for (let i = 0; i < total_rooms; i++) {
//         await Booking.create([
//           {
//             room_name,
//             type,
//             email,
//             user_name,
//             phone,
//             user_name_2,
//             phone_2,
//             special_request,
//             optional_services,
//             check_in_date,
//             check_out_date,
//             total_price,
//             total_cats: collect[i],
//             total_rooms: 1,
//             status,
//             pay_way,
//             total_cameras,
//             image,
//           }
//         ], { session });
//       }
  
//       await session.commitTransaction();
//       session.endSession();
//       console.log("Booking created successfully");
//       res.status(201).json({ message: "Booking created successfully" });
  
//     } catch (err) {
//       await session.abortTransaction();
//       session.endSession();
//       console.error(err);
//       res.status(500).json({ message: "Failed to create booking", error: err.message });
//     }
//   });
  
//   app.post("/v1/delete_book_room", async (req, res) => {
//     const { _id } = req.body;
  
//     try {
//       // Check if the booking exists
//       const booking = await Booking.findOne({ _id: _id });
  
//       if (!booking) {
//         return res.status(404).json({ message: "Booking not found" });
//       }
  
//       // Delete the booking
//       await Booking.deleteOne({ _id: _id });
  
//       return res.status(200).json({ message: "Booking deleted successfully" });
//     } catch (error) {
//       return res.status(500).json({ message: "Error deleting booking", error });
//     }
//   });
  
//   app.post("/v1/create_room", async (req, res) => {
//     try {
//       const {
//         room_name,
//         type,
//         price,
//         image,
//         description,
//         cameras,
//         optional_services,
//         number_of_cats,
//         number_of_rooms,
//       } = req.body;
  
//       if (
//         !(
//           room_name &&
//           type &&
//           price &&
//           image &&
//           description &&
//           cameras &&
//           number_of_cats &&
//           number_of_rooms
//         )
//       ) {
//         return res.status(400).send("All input is required");
//       }
  
//       const { data: folders, error: listError } = await supabase.storage
//         .from("rooms")
//         .list("", { recursive: true });
  
//       if (listError) {
//         return res.status(400).send("Error searching for folders");
//       }
  
//       const folderExists = folders.some((folder) => folder.name === type);
  
//       if (folderExists) {
//         return res
//           .status(400)
//           .send("A folder with this room name already exists");
//       }
  
//       let imageBase64 = [];
  
//       for (let i = 0; i < 1; i++) {
//         const base64Data = image[i].replace(/^data:image\/\w+;base64,/, "");
//         const buf = Buffer.from(base64Data, "base64");
//         console.log("img = ", base64Data);
//         const imageName = `${i}.png`;
  
//         const { data: uploadData, error: uploadError } = await supabase.storage
//           .from("rooms")
//           .upload(`${type}/${imageName}`, buf, {
//             // cacheControl: "3600",
//             upsert: false,
//             contentType: "image/png",
//             // contentEncoding: "base64",
//           });
  
//         if (uploadError) {
//           return res.status(400).send("Error uploading image");
//         } else {
//           imageBase64.push(imageName);
//         }
//       }
  
//       // if (imageBase64.length !== image.length) {
//       //   return res.status(400).send("Error uploading image");
//       // }
  
//       let room = await Room.create({
//         room_name,
//         type,
//         price,
//         image: imageBase64,
//         description,
//         cameras,
//         optional_services,
//         number_of_cats,
//         number_of_rooms,
//       });
  
//       console.log(room);
  
//       res.status(201).json("Room created successfully");
//     } catch (err) {
//       res.json({ message: err });
//     }
//   });
  
//   app.post("/v1/edit_room", async (req, res) => {
//     try {
//       const {
//         room_id,
//         room_name,
//         type,
//         price,
//         image,
//         description,
//         cameras,
//         optional_services,
//         number_of_cats,
//         number_of_rooms,
//       } = req.body;
  
//       // ตรวจสอบว่า room_id ถูกส่งมาหรือไม่
//       if (!room_id) {
//         return res.status(400).json({ message: "Room ID is required." });
//       }
  
//       // หา room ในฐานข้อมูล
//       const existingRoom = await Room.findById(room_id);
  
//       if (!existingRoom) {
//         return res.status(404).json({ message: "Room not found." });
//       }
  
//       // อัปเดตรูปภาพใน Superbase ถ้ามีการเปลี่ยนแปลง
//       let imageBase64 = existingRoom.image; // รูปภาพเดิม
//       if (image && image.length > 0) {
//         // ลบรูปภาพเก่าจาก Superbase
//         const { error: deleteError } = await supabase.storage
//           .from("rooms")
//           .remove(existingRoom.image.map((img) => `${existingRoom.type}/${img}`));
  
//         if (deleteError) {
//           return res
//             .status(500)
//             .json({
//               message: "Error deleting old images from storage",
//               error: deleteError.message,
//             });
//         }
  
//         // อัปโหลดรูปภาพใหม่ไปยัง Superbase
//         imageBase64 = [];
//         for (let i = 0; i < 1; i++) {
//           const base64Data = image[i].replace(/^data:image\/\w+;base64,/, "");
//           const buf = Buffer.from(base64Data, "base64");
//           const imageName = `${i}.png`;
  
//           const { data: uploadData, error: uploadError } = await supabase.storage
//             .from("rooms")
//             .upload(`${type}/${imageName}`, buf, {
//               upsert: false,
//               contentType: "image/png",
//             });
  
//           if (uploadError) {
//             return res
//               .status(500)
//               .json({
//                 message: "Error uploading new images",
//                 error: uploadError.message,
//               });
//           }
  
//           imageBase64.push(imageName);
//         }
//       }
  
//       // อัปเดตข้อมูลห้องใน MongoDB
//       const updatedRoom = await Room.findByIdAndUpdate(
//         room_id,
//         {
//           room_name,
//           type,
//           price,
//           image: imageBase64,
//           description,
//           cameras,
//           optional_services,
//           number_of_cats,
//           number_of_rooms,
//         },
//         { new: true }
//       );
  
//       res.json({ message: "Room updated successfully", room: updatedRoom });
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   });
  
//   app.delete("/v1/delete_room", async (req, res) => {
//     try {
//       const { room_id } = req.body; // Get room_id from client request
  
//       // Check if room_id is provided
//       if (!room_id) {
//         return res.status(400).json({ message: "Room ID is required." });
//       }
  
//       // Find the room in the database
//       const room = await Room.findById(room_id);
//       if (!room) {
//         return res.status(404).json({ message: "Room not found." });
//       }
  
//       // Log the folder path to be deleted
//       const folderPath = `${room.type}`;
//       console.log(`Deleting folder: ${folderPath}`);
  
//       // Delete the folder related to the room type from Supabase storage
//       const { error: deleteFolderError } = await supabase.storage
//         .from("rooms")
//         .remove([folderPath]);
  
//       if (deleteFolderError) {
//         console.error(`Error deleting folder: ${deleteFolderError.message}`);
//         return res
//           .status(500)
//           .json({
//             message: "Error deleting folder from storage",
//             error: deleteFolderError.message,
//           });
//       }
  
//       // Delete the room from MongoDB
//       await Room.findByIdAndDelete(room_id);
  
//       // Send success response when both folder and room are deleted
//       res.json({
//         message: "Room and associated folder deleted successfully",
//         room,
//       });
//     } catch (err) {
//       console.error(`Error in deleting room: ${err.message}`);
//       res.status(500).json({ message: err.message });
//     }
//   });
  
  
  
  
  








// ---------------------------- 
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