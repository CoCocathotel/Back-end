const Home  = require("./home.model");
const Image = require("../../middleware/superbase");

exports.getHome = async (req, res) => {
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
};

exports.createHome = async (req, res) => {
  try {
    const { heroImage, reviewImage, mapImage, mapDetail, title } = req.body;

    // let LinkMap =  await Image.uploadImage(mapImage, "home");

    // let oldImg = "https://hiykwrlgoinmxgqczucv.supabase.co/storage/v1/object/public/home/1728755321176.png";
    let newImg = await Image.updateImage(reviewImage[0], oldImg, 'home');
    
    // await home.save();
    res.status(201).json({
      body: {
        old: oldImg,
        new: newImg,
        // getLink: Link,
        // Review: LinkReview,
        // Map: LinkMap
      },
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.updateHome = async (req, res) => {
  try {
    const { heroImage, reviewImage, mapImage, mapDetail, title } = req.body;
    const { id } = req.params;
    const home = await Home.findOne({_id: id});
    if (!home) {
      return res.status(404).send("Home data not found");
    }
    home.heroImage = heroImage;
    home.reviewImage = reviewImage;
    home.mapImage = mapImage;
    home.mapDetail = mapDetail;
    await home.save();
    res.status(200).json({
      body: home,
    });
  }
  catch (error) {
    res.status(400).send(error.message);
  }
}
