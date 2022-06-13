const express = require("express");
const {
  get,
  add,
  getById,
  deleteById,
} = require("../controllers/animesController");

const router = express.Router();

const prefix = "/animes";

router.route(prefix).get(get).post(add);

router.route(`${prefix}/:animeId`).get(getById);

router.route(`${prefix}/:animeId`).delete(deleteById);

module.exports = router;
