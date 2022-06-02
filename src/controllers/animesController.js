const mongoose = require("mongoose");

const Anime = mongoose.model(process.env.ANIME_MODEL);

const get = (req, res) => {
  Anime.find()
    .then((animes) => {
      _sendResponse(res, _creatResponse(200, animes));
    })
    .catch((err) => _setInternalErr(res, err));
};

const add = (req, res) => {
  const { name, year, arcs } = req.body;
  const animeToAdd = {
    name,
    year,
    arcs,
  };

  Anime.create(animeToAdd)
    .then((anime) => _sendResponse(res, _creatResponse(200, anime)))
    .catch((err) => _setInternalErr(res, err));
};

const getById = (req, res) => {
  Anime.findById(req.params.animeId)
    .exec()
    .then((anime) => {
      if (!anime) {
        _sendResponse(res, _creatResponse(404, "Anime Not Found"));
      } else {
        _sendResponse(res, _creatResponse(200, anime));
      }
    })
    .catch((err) => _setInternalErr(res, err));
};

const deleteById = (req, res) => {
  Anime.findByIdAndDelete(req.params.animeId)
    .exec()
    .then((anime) => {
      if (!anime) {
        _sendResponse(res, _creatResponse(404, "Anime Not Found"));
      } else {
        _sendResponse(res, _creatResponse(200, anime));
      }
    })
    .catch((err) => _setInternalErr(res, err));
};

//#region private

const _creatResponse = (code, response) => ({
  code: code,
  data: response,
});

const _sendResponse = (res, response) => {
  res.status(response.code).json(response.data);
};

const _setInternalErr = (res, err) => {
  console.log(err);
  _sendResponse(
    res,
    _creatResponse(500, "something went wrong!, try again later")
  );
};

//#endregion

module.exports = {
  get,
  add,
  getById,
  deleteById,
};
