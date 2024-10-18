const { Footer } = require("../../middleware/db");
const Image = require("../../middleware/superbase");


exports.getFooter = async (req, res) => {
    try {
        const footer = await Footer.find();
        if (!footer) {
            return res.status(404).send("Footer data not found");
        }
        res.status(200).json({
            body: footer,
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
};


exports.createFooter = async (req, res) => {
    try {
        const { headFooter, addressFooter, phoneFooter, lineFooter, tiktokFooter } = req.body;

        const footer = await Footer.create({
            headFooter,
            addressFooter,
            phoneFooter,
            lineFooter,
            tiktokFooter
        });
        
        res.status(201).json({
            body: footer,
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.updateFooter = async (req, res) => {
    try {
        const { headFooter, addressFooter, phoneFooter, lineFooter, tiktokFooter } = req.body;

        const { id } = req.params;

        const footer = await Footer.findOne({ _id: id });
        if (!footer) {
            return res.status(404).send("Footer data not found");
        }

        const updatedFooter = await Footer.findByIdAndUpdate
            (id, {
                headFooter,
                addressFooter,
                phoneFooter,
                lineFooter,
                tiktokFooter
            },
            { new: true });

        res.status(200).json({
            body: updatedFooter,
        });

    } catch (error) {
        res.status(400).send(error.message);
    }  
};