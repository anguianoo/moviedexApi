require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const movieData = require("./movie-data-small");
const cors = require("cors");

const app = express();

app.use(morgan("dev"));
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get("Authorization");
  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res.status(401).json({ error: "Unauthorized request" });
  }
  next();
});

app.get("/movie", function handleGetMovies(req, res) {
  let response = movieData;
  //Users can search for Movies by genre, country or avg_vote
  if (req.query.genre) {
    response = response.filter((array) =>
      array.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    );
  }
  //country
  if (req.query.country) {
    response = response.filter((array) =>
      array.country.includes(req.query.country)
    );
  }
  //average vote
  if (req.query.avg_vote) {
    response = response.filter(
      (array) => Number(array.avg_vote) >= Number(req.query.avg_vote)
    );
  }
  res.json(response);
});

const PORT = 8001;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
