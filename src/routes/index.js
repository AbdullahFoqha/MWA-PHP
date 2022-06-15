const express = require('express')
const animeRouter = require('./animeRouter')
const arcRouter = require('./arcRouter')

const router = express.Router()

router.use('/animes', animeRouter)
router.use('/arcs', arcRouter)

module.exports = router
