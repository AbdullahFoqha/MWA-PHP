const express = require('express')

require('dotenv')
.config()
require('./data/db')
const routes = require('./routes')
const arcRouter = require('./routes/arcRouter')
const helmet = require('helmet')
const compression = require('compression')

const app = express()

//#region built-in middlewares

app.use(express.json())
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	next()
})
app.use(helmet())
app.use(compression())

//#endregion

//#region custom middlewares

app.use(({ url, method }, res, next) => {
	console.log({ method, url })
	next()
})

//#endregion

app.use('/api', routes)

const server = app.listen(process.env.PORT, () => console.log('Started', server.address().port))
