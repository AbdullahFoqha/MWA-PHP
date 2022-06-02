const express = require('express')
const {get, getById, deleteById, add} = require("../controllers/animeArcsController");

const router = express.Router()

router.route('/:animeId/arcs')
    .get(get)
    .post(add)

router.route('/:animeId/arcs/:arcId')
    .get(getById)

router.route('/:animeId/arcs/:arcId')
    .delete(deleteById)

module.exports = router
