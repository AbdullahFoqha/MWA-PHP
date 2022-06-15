const express = require('express')
const { get, getById, deleteById, add } = require('../controllers/animeArcsController')

const router = express.Router()

router.route('')
	  .get(get)
	  .post(add)

router.route('/:arcId')
	  .get(getById)
	  .delete(deleteById)

module.exports = router
