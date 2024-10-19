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

exports.getOneRoom = async (req, res) => {
    const { type } = req.params;
    try {
        const room = await Room.findOne({ type: type });
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

exports.createRoom = async (req, res) => {
    try {
        const { room_name, type, price, image, description, cameras, number_of_cats, number_of_rooms } = req.body;
        let LinkImage = [];

        // console.log('req.body:', req.body);
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

exports.updateRoom = async (req, res) => {
    try {
        const { room_name, type, price, image, description, cameras, number_of_cats, number_of_rooms } = req.body;
        const { id } = req.params;

        console.log('req.body:', image);

        const room = await Room .findOne({ _id: id });
        if (!room) {
            return res.status(404).send("Room data not found");
        }

        let LinkImage = [];
        const oldImages = room.image[0];
        if (image && image.length > 0) {
            if(oldImages !== image[0]){
                LinkImage = await Promise.all(image.map((img) => Image.uploadImage(img, "rooms", type )));
            }else{
                LinkImage = oldImages;
            }
        }

        const updatedRoom = await Room.findByIdAndUpdate
            (id, {
                room_name,
                type,
                price,
                image: LinkImage,
                description,
                cameras,
                number_of_cats,
                number_of_rooms
            },
            { new: true });
    res.status(200).json({
        body: updatedRoom,
    });

    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.deleteRoom = async (req, res) => {
    const { id } = req.params;
    try {
        const room = await Room.findOne({ _id: id });
        if (!room) {
            return res.status(404).send("Room data not found");
        }

        const slug = room.type;
        const image = room.image[0];
        console.log('image:', image, 'slug:', slug); 
        await Room.findByIdAndDelete(id);  
        await Image.deleteImage(image, 'rooms', slug);
        
        res.status(200).json({
            body: "deleted successfully",
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
};