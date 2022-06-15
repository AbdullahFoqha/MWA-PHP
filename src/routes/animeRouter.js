const express = require('express')
const { get, add, getById, deleteById } = require('../controllers/animesController')

const router = express.Router()

router.route('')
	  .get(get)
	  .post(add)

router.route(`/:animeId`)
	  .get(getById)
	  .delete(deleteById)

module.exports = router
