const mongoose = require("mongoose");
const { response } = require("express");

const Anime = mongoose.model(process.env.ANIME_MODEL);

const get = (req, res) => {
  Anime.find()
    .then((animes) => {
      _sendResponse(res, {
        code: 200,
        data: animes,
      });
    })
    .catch((err) =>
      _sendResponse(res, {
        code: 500,
        data: err,
      })
    );
};

const add = (req, res) => {
  const { name, year, arcs } = req.body;
  const animeToAdd = {
    name,
    year,
    arcs,
  };

  Anime.create(animeToAdd)
    .then((anime) => _creatAnime(anime, res))
    .catch((err) => {
      console.log(err);
      return res.status(500).send("something went wrong!, try again later");
    });
};

const getById = (req, res) => {
  Anime.findById(req.params.animeId).exec((err, anime) => {
    if (err) {
      console.log(err);
      return res.status(500).send("something went wrong!, try again later");
    }

    if (!anime) {
      return res.status(404).send("Anime Not Found");
    }

    res.status(200).json(anime);
  });
};

const deleteById = (req, res) => {
  Anime.findByIdAndDelete(req.params.animeId).exec((err, anime) => {
    if (err) {
      console.log(err);
      return res.status(500).send("something went wrong!, try again later");
    }

    if (!anime) {
      return res.status(404).send("Anime Not Found");
    }

    res.status(200).json(anime);
  });
};

//#region private

const _creatAnime = (anime, res) => {
  _sendResponse(res, {
    code: 201,
    data: anime,
  });
};

const _sendResponse = (res, response) => {
  res.status(response.code).json(response.data);
};

//#endregion

module.exports = {
  get,
  add,
  getById,
  deleteById,
};
