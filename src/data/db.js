const mongoose = require("mongoose");
require("./models/animeModel");

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));
