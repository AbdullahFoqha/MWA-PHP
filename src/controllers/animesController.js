const mongoose = require('mongoose')

const {
	ANIME_MODEL,
	ERROR_INTERNAL_SERVER,
	ERROR_PAGINATION,
	ERROR_PAGINATION_MAX,
	ERROR_NOT_FOUND,
	ERROR_CLIENT,
	STATUS_CODE_INTERNAL_SERVER_ERROR: CODE_500,
	STATUS_CODE_NOT_FOUND: CODE_404,
	STATUS_CODE_SUCCESS: CODE_200,
	STATUS_CODE_CLIENT_ERROR: CODE_400,
	PAGINATION_COUNT: COUNT,
	PAGINATION_OFFSET: OFFSET,
	PAGINATION_MAX: MAX
} = process.env
const Anime = mongoose.model(ANIME_MODEL)

const get = (req, res) => {
	const response = { code: CODE_500, data: ERROR_INTERNAL_SERVER }
	const { count, offset, error: { hasError: hasPaginationError, message: errorMessage } } = _getPaginationData(req)

	if(hasPaginationError) {
		_fillResponse(response, CODE_400, errorMessage)
		_sendResponse(res, response)
	} else {
		Anime.find()
			 .skip(offset)
			 .limit(count)
			 .exec()
			 .then(animes => _fillResponse(response, CODE_200, animes))
			 .catch(err => _logAndFillResponse(response, err))
			 .finally(() => _sendResponse(res, response))
	}
}

const add = (req, res) => {
	const response = { code: CODE_500, data: ERROR_INTERNAL_SERVER }
	const { name, year } = req.body

	if(!name || !year) {
		_fillResponse(response, CODE_400, ERROR_CLIENT)
		_sendResponse(res, response)
	} else {
		const animeToAdd = { ...req.body }

		Anime.create(animeToAdd)
			 .then(anime => _fillResponse(response, CODE_200, anime))
			 .catch(err => _logAndFillResponse(response, err))
			 .finally(() => _sendResponse(res, response))
	}
}

const getById = (req, res) => {
	const response = { code: CODE_500, data: ERROR_INTERNAL_SERVER }
	const { animeId } = _getIdFromReq(req)

	Anime.findById(animeId)
		 .exec()
		 .then(anime => anime ? _fillResponse(response, CODE_200, anime) : _fillResponse(response, CODE_404, ERROR_NOT_FOUND))
		 .catch(err => _logAndFillResponse(res, err))
		 .finally(() => _sendResponse(res, response))
}

const deleteById = (req, res) => {
	const response = { code: CODE_500, data: ERROR_INTERNAL_SERVER }
	const { animeId } = _getIdFromReq(req)

	Anime.findByIdAndDelete(animeId)
		 .exec()
		 .then(anime => anime ? _fillResponse(response, CODE_200, anime) : _fillResponse(response, CODE_404, ERROR_NOT_FOUND))
		 .catch(err => _logAndFillResponse(res, err))
		 .finally(() => _sendResponse(res, response))
}

const update = (req, res) => {
	const response = { code: CODE_500, data: ERROR_INTERNAL_SERVER }
	const { animeId } = _getIdFromReq(req)
	const { name, year } = req.body

	if(!name || !year) {
		_fillResponse(response, CODE_400, ERROR_CLIENT)
		_sendResponse(res, response)
	} else {
		Anime.findByIdAndUpdate(animeId, { $set: { ...req.body } }, { new: true })
			 .exec()
			 .then(updatedAnime => updatedAnime ? _fillResponse(response, CODE_200, updatedAnime) : _fillResponse(response, CODE_404, ERROR_NOT_FOUND))
			 .catch(err => _logAndFillResponse(res, err))
			 .finally(() => _sendResponse(res, response))
	}
}

const updatePart = (req, res) => {
	const { animeId } = _getIdFromReq(req)

	Anime.findById(animeId)
		 .then(anime => {
			 const obj = { ...anime._doc, ...req.body }
			 Anime.findByIdAndUpdate(animeId, {
				 $set: { ...obj }
			 }, { new: true })
				  .then(anime => {
					  const response = { code: 200, data: grade }

					  if(!anime) {
						  response.code = 404
						  response.data = 'Grade Not Found..!'
					  }

					  _sedResponse(res, response)
				  })
				  .catch(err => {
					  console.log(err)
					  _sedResponse(res, { code: 500, data: ERROR_MESSAGE })
				  })
		 })
		 .catch(err => {
			 console.log(err)
			 _sedResponse(res, { code: 500, data: ERROR_MESSAGE })
		 })
}

//#region private

const _fillResponse = (response, code, data) => {
	response.code = code
	response.data = data
}

const _sendResponse = (res, response) => {
	const { code, data } = response
	res.status(+code)
	   .json(data)
}

const _logError = error => console.log(error)

const _getPaginationData = req => {
	let count = +COUNT
	let offset = +OFFSET
	let max = +MAX
	let error = { hasError: false, message: '' }

	if(req.query && req.query.offset) {
		offset = +req.query.offset
	}

	if(req.query && req.query.count) {
		count = +req.query.count
	}

	if(isNaN(count) || isNaN(offset)) {
		error = { hasError: true, message: ERROR_PAGINATION }
	}

	if(count > max) {
		error = { hasError: true, message: `${ERROR_PAGINATION_MAX} ${max}` }
	}

	return { offset, count, error }
}

const _getIdFromReq = req => {
	let animeId = undefined

	if(req.params && req.params.animeId) {
		animeId = req.params.animeId
	}

	return { animeId }
}

const _logAndFillResponse = (response, err) => {
	_logError(err)
	_fillResponse(response, CODE_500, ERROR_INTERNAL_SERVER)
}

//#endregion

module.exports = { get, add, getById, deleteById, update, updatePart }
