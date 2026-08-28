const express = require("express");

const router = express.Router();

const { driver } = require("../db");

router.get("/", async (req, res) => {
  try {
    const { actor1, actor2 } = req.query;

    if (!actor1 || !actor2) {
      return res.status(400).json({
        error: "Please provide actor1 and actor2",
      });
    }

    const result = await driver.executeQuery(
      `
      MATCH (a1:Actor {name: $actor1})
      MATCH (a2:Actor {name: $actor2})

      MATCH path = shortestPath(
        (a1)-[*]-(a2)
      )

      RETURN [
        node IN nodes(path) |
        CASE
          WHEN node:Actor THEN node.name
          WHEN node:Movie THEN node.title
          WHEN node:Director THEN node.name
          WHEN node:Genre THEN node.name
          ELSE "Unknown"
        END
      ] AS connection
      `,
      {
        actor1,
        actor2,
      },
    );

    if (result.records.length === 0) {
      return res.json({
        found: false,
        connection: [],
      });
    }

    const connection = result.records[0].get("connection");

    res.json({
      found: true,
      connection,
    });
  } catch (error) {
    console.error("Failed to find connection:", error);

    res.status(500).json({
      error: "Failed to find connection",
    });
  }
});

module.exports = router;
