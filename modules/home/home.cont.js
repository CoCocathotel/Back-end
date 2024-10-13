const { Home } = require("../../middleware/db");
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
    let LinkHero = [];
    let LinkReview = [];
    let LinkMap = [];

    if (heroImage && heroImage.length > 0) {
      LinkHero = await Promise.all(heroImage.map((img) => Image.uploadImage(img, "home")));
    }

    if (reviewImage && reviewImage.length > 0) {
      LinkReview = await Promise.all(reviewImage.map((img) => Image.uploadImage(img, "review")));
    }

    if (mapImage) {
      LinkMap = await Image.uploadImage(mapImage, "map");
    }

    console.log(LinkHero, LinkReview, LinkMap);

    const home = await Home.create({
      heroImage: LinkHero,
      reviewImage: LinkReview,
      mapImage: LinkMap,
      mapDetail,
      title,
    });

    res.status(201).json({
      body: home,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.updateHome = async (req, res) => {
  try {
    const { heroImage, reviewImage, mapImage, mapDetail, title } = req.body;
    const { id } = req.params;

    const home = await Home.findOne({ _id: id });
    if (!home) {
      return res.status(404).send("Home data not found");
    }

    let LinkHero = [];
    let LinkReview = [];
    let LinkMap = "";

    let oldLinkReview = home.reviewImage.filter((img) => !reviewImage.includes(img));
    let reviewImageNew = reviewImage.filter((img) => !home.reviewImage.includes(img));

    if (oldLinkReview.length > 0 && reviewImageNew.length <= 0) {
      console.log("0", oldLinkReview);
      LinkReview = await Promise.all(oldLinkReview.map((img, index) => Image.deleteImage(img, "review")));
      LinkReview = home.reviewImage.filter((img) => !oldLinkReview.includes(img));
    } else if (oldLinkReview.length > 0 && reviewImageNew.length > 0){
      LinkReview = await Promise.all(oldLinkReview.map((img, index) => Image.deleteImage(img, "review")));
      LinkReview = await Promise.all(reviewImageNew.map((img, index) => Image.uploadImage(img, "review")));
      notIncludeOld = home.reviewImage.filter((img) => !oldLinkReview.includes(img));
      LinkReview = [...notIncludeOld, ...LinkReview];
    } else if (oldLinkReview.length > 0) {
      console.log("1", LinkReview, reviewImage, oldLinkReview);
      LinkReview = await Promise.all(reviewImageNew.map((img, index) => Image.updateImage(img, oldLinkReview[index], "review")));
    } else if (reviewImageNew.length > 0) {
      console.log("2", LinkReview, reviewImage, oldLinkReview);

      LinkReview = await Promise.all(reviewImageNew.map((img) => Image.uploadImage(img, "review")));
      LinkReview = [...home.reviewImage, ...LinkReview];
    } else {
      console.log("3", LinkReview, reviewImage, oldLinkReview);

      LinkReview = home.reviewImage
    }

    let oldLinkHero = home.heroImage.filter((img) => !heroImage.includes(img));
    let heroImageNew = heroImage.filter((img) => !home.heroImage.includes(img));

    if (oldLinkHero.length > 0 && heroImageNew.length <= 0) {
      console.log("0", oldLinkHero);
      LinkHero = await Promise.all(oldLinkHero.map((img, index) => Image.deleteImage(img, "home")));
      LinkHero = home.heroImage.filter((img) => !oldLinkHero.includes(img));
    }else if (oldLinkHero.length > 0 && heroImageNew.length > 0){
      LinkHero = await Promise.all(oldLinkHero.map((img, index) => Image.deleteImage(img, "home")));
      LinkHero = await Promise.all(heroImageNew.map((img, index) => Image.uploadImage(img, "home")));
      notIncludeOld = home.heroImage.filter((img) => !oldLinkHero.includes(img));
      LinkHero = [...notIncludeOld, ...LinkHero];
    }else if (oldLinkHero.length > 0) {
      console.log("1", LinkHero, heroImageNew, oldLinkHero);
      LinkHero = await Promise.all(heroImageNew.map((img, index) => Image.updateImage(img, oldLinkHero[index], "home")));
    } else if (heroImageNew.length > 0) {
      console.log("2", LinkHero, heroImageNew, oldLinkHero);
      LinkHero = await Promise.all(heroImageNew.map((img) => Image.uploadImage(img, "home")));
      LinkHero = [...home.heroImage, ...LinkHero];
    } else {
      console.log("3", LinkHero, heroImageNew, oldLinkHero);
      LinkHero = home.heroImage
    }

    if (mapImage) {
      const oldLinkMap = home.mapImage;
      if (oldLinkMap !== null) {
        if (oldLinkMap != mapImage) {
          LinkMap = await Image.updateImage(oldLinkMap, "map");
        } else {
          LinkMap = mapImage;
        }
      } else {
        LinkMap = await Image.uploadImage(mapImage, "map");
      }

    } else {
      LinkMap = home.mapImage
    }

    const updateHome = await Home.findOneAndUpdate(
      { _id: id },
      {
        heroImage: LinkHero,
        reviewImage: LinkReview,
        mapImage: LinkMap,
        mapDetail,
        title,
      },
      { new: true }
    );

    res.status(200).json({
      body: updateHome
    });
  }
  catch (error) {
    res.status(400).send(error.message);
  }
}
