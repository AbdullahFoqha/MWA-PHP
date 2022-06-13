const express = require("express");

require("dotenv").config();
require("./data/db");
const animeRouter = require("./routes/animeRouter");
const arcRouter = require("./routes/arcRouter");
const helmet = require("helmet");
const compression = require("compression");

const app = express();

//#region built-in middlewares

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.CORS);
  next();
});
app.use(helmet());
app.use(compression());

//#endregion

//#region custom middlewares

app.use((req, res, next) => {
  console.log(`this is a url to check ${req.url}`);
  next();
});

//#endregion

//#region routes

app.use("/api/animes", arcRouter);
app.use("/api", animeRouter);

//#endregion

const server = app.listen(process.env.PORT, () =>
  console.log("Started", server.address().port)
);
