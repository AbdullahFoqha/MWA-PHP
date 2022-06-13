const mongoose = require("mongoose");

const arcSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  imageURL: String,
  numberOfEpisodes: {
    type: Number,
    required: true,
  },
});

const animeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  imageURL: String,
  year: {
    type: Number,
    required: true,
  },
  arcs: [arcSchema],
});

mongoose.model(
  process.env.ANIME_MODEL,
  animeSchema,
  process.env.ANIME_COLLECTION_NAME
);
