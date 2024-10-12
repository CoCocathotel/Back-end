const Home  = require("./home.model");

console.log(Home);

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
