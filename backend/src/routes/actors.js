const express = require("express");

const router = express.Router();

const { driver } = require("../db");

// GET /api/actors
// Get all actors
router.get("/", async (req, res) => {
  try {
    const result = await driver.executeQuery(`
      MATCH (a:Actor)
      RETURN a.name AS name
      ORDER BY a.name
    `);

    const actors = result.records.map((record) => ({
      name: record.get("name"),
    }));

    res.json(actors);
  } catch (error) {
    console.error("Failed to fetch actors:", error);

    res.status(500).json({
      error: "Failed to fetch actors",
    });
  }
});

// GET /api/actors/:name/movies
// Get all movies for a specific actor
router.get("/:name/movies", async (req, res) => {
  try {
    const actorName = decodeURIComponent(req.params.name);

    console.log("Searching for actor:", actorName);

    const result = await driver.executeQuery(
      `
      MATCH (a:Actor {name: $actorName})-[:ACTED_IN]->(m:Movie)
      RETURN m.title AS title, m.year AS year
      ORDER BY m.year DESC
      `,
      {
        actorName,
      },
    );

    const movies = result.records.map((record) => ({
      title: record.get("title"),
      year: Number(record.get("year")),
    }));

    res.json({
      actor: actorName,
      movies,
    });
  } catch (error) {
    console.error("Failed to fetch actor movies:", error);

    res.status(500).json({
      error: "Failed to fetch actor movies",
    });
  }
});

module.exports = router;
