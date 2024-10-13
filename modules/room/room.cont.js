const { Room } = require("../../middleware/db");
const Image = require("../../middleware/superbase");

exports.getRoom = async (req, res) => {
  try {
    const room = await Room.find();
    if (!room) {
      return res.status(404).send("Room data not found");
    }
    res.status(200).json({
      body: room,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// room_name: { type: String, required: true },
// type: { type: String, required: true },
// price: { type: Number, required: true },
// image: { type: [String], required: true },
// description: { type: String, required: true },
// cameras: { type: Number, required: true },
// // size: { type: String, required: true },
// optional_services: [
//   {
//     service: String,
//     form: String,
//   },
// ],
// number_of_cats: { type: Number, required: true },
// number_of_rooms: { type: Number, required: true },

exports.createRoom = async (req, res) => {
    try {
        const { room_name, type, price, image, description, cameras, number_of_cats, number_of_rooms } = req.body;
        let LinkImage = [];

        console.log('req.body:', req.body);
        if (image && image.length > 0) {
            LinkImage = await Promise.all(image.map((img) => Image.uploadImage(img, "rooms", type )));
        }

        const createRoom = await Room.create({
            room_name,
            type,
            price,
            image: LinkImage,
            description,
            cameras,
            number_of_cats,
            number_of_rooms
        });

        const room = await Room.find();

        res.status(201).json({
            body: room,
        });

    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.updateRoom = async (req, res) => {};

exports.deleteRoom = async (req, res) => {};