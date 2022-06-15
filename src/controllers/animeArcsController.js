const mongoose = require('mongoose')

const Anime = mongoose.model(process.env.ANIME_MODEL)

const get = (req, res) => {
	Anime.findById(req.params.animeId)
		 .select('arcs')
		 .exec((err, anime) => {
			 if(err) {
				 console.log(err)
				 return res.status(500)
						   .send('something went wrong!, try again later')
			 }

			 if(!anime) {
				 return res.status(404)
						   .send('Anime Not Found')
			 }

			 res.status(200)
				.json(anime.arcs)
		 })
}

const add = (req, res) => {
	Anime.findById(req.params.animeId)
		 .select('arcs')
		 .exec((err, anime) => {
			 if(err) {
				 return res.status(500)
						   .send('something went wrong!, try again later')
			 }

			 if(!anime) {
				 return res.status(404)
						   .send('Anime Not Found')
			 }

			 addArc(req, res, anime)
		 })
}

const getById = (req, res) => {
	const { animeId, arcId } = req.params
	Anime.findById(animeId)
		 .select('arcs')
		 .exec((err, anime) => {
			 if(err) {
				 return res.status(500)
						   .send('something went wrong!, try again later')
			 }

			 if(!anime) {
				 return res.status(404)
						   .send('Anime Not Found')
			 }

			 const arc = anime.arcs.id(arcId)
			 if(!arc) {
				 return res.status(404)
						   .send('Arc Not Found')
			 }

			 res.status(200)
				.json(arc)
		 })
}

const deleteById = (req, res) => {
	const { animeId, arcId } = req.params
	Anime.findById(animeId)
		 .select('arcs')
		 .exec((err, anime) => {
			 if(err) {
				 return res.status(500)
						   .send('something went wrong!, try again later')
			 }

			 if(!anime) {
				 return res.status(404)
						   .send('Anime Not Found')
			 }

			 const arc = anime.arcs.id(arcId)
			 if(!arc) {
				 return res.status(404)
						   .send('Arc Not Found')
			 }

			 deleteArc(req, res, anime, arc)
		 })
}

//#region private
const addArc = (req, res, anime) => {
	const { name, numberOfEpisodes } = req.body
	const arcToAdd = {
		name, numberOfEpisodes
	}

	anime.arcs.push(arcToAdd)

	anime.save((err, newAnime) => {
		if(err) {
			console.log(err)
			return res.status(500)
					  .send('something went wrong!, try again later')
		}
		res.status(200)
		   .json(newAnime.arcs)
	})
}

const deleteArc = (req, res, anime, arc) => {
	anime.arcs = anime.arcs.filter(a => a._id !== arc._id)
	anime.save((err, newAnime) => {
		if(err) {
			console.log(err)
			return res.status(500)
					  .send('something went wrong!, try again later')
		}
		res.status(200)
		   .json(newAnime.arcs)
	})
}
//#endregion

module.exports = {
	get, getById, deleteById, add
}
