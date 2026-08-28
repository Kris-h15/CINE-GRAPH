const express = require("express");

const router = express.Router();

const { driver } = require("../db");

// GET /api/movies
// Get all movies
router.get("/", async (req, res) => {
  try {
    const result = await driver.executeQuery(`
      MATCH (m:Movie)
      RETURN
        m.title AS title,
        m.year AS year
      ORDER BY m.year DESC
    `);

    const movies = result.records.map((record) => ({
      title: record.get("title"),
      year: Number(record.get("year")),
    }));

    res.json(movies);
  } catch (error) {
    console.error("Failed to fetch movies:", error);

    res.status(500).json({
      error: "Failed to fetch movies",
    });
  }
});

// GET /api/movies/:title/cast
// Get actors in a movie
router.get("/:title/cast", async (req, res) => {
  try {
    const movieTitle = req.params.title;

    const result = await driver.executeQuery(
      `
      MATCH (a:Actor)-[:ACTED_IN]->(m:Movie {title: $movieTitle})

      RETURN a.name AS name
      ORDER BY a.name
      `,
      {
        movieTitle,
      },
    );

    const actors = result.records.map((record) => ({
      name: record.get("name"),
    }));

    res.json({
      movie: movieTitle,
      cast: actors,
    });
  } catch (error) {
    console.error("Failed to fetch cast:", error);

    res.status(500).json({
      error: "Failed to fetch cast",
    });
  }
});

// GET /api/movies/:title
// Get complete information about one movie
router.get("/:title", async (req, res) => {
  try {
    const movieTitle = req.params.title;

    const result = await driver.executeQuery(
      `
      MATCH (m:Movie {title: $movieTitle})

      OPTIONAL MATCH (m)-[:DIRECTED_BY]->(d:Director)

      OPTIONAL MATCH (m)-[:HAS_GENRE]->(g:Genre)

      OPTIONAL MATCH (a:Actor)-[:ACTED_IN]->(m)

      RETURN
        m.title AS title,
        m.year AS year,
        d.name AS director,
        collect(DISTINCT g.name) AS genres,
        collect(DISTINCT a.name) AS actors
      `,
      {
        movieTitle,
      },
    );

    if (result.records.length === 0) {
      return res.status(404).json({
        error: "Movie not found",
      });
    }

    const record = result.records[0];

    res.json({
      title: record.get("title"),
      year: Number(record.get("year")),
      director: record.get("director"),
      genres: record.get("genres"),
      actors: record.get("actors"),
    });
  } catch (error) {
    console.error("Failed to fetch movie:", error);

    res.status(500).json({
      error: "Failed to fetch movie",
    });
  }
});

module.exports = router;
