const express = require("express");
const cors = require("cors");

const { verifyDatabaseConnection } = require("./db");

const actorsRouter = require("./routes/actors");
const moviesRouter = require("./routes/movies");
const connectionsModule = require("./routes/connections");

const connectionsRouter = connectionsModule.router || connectionsModule;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/actors", actorsRouter);
app.use("/api/movies", moviesRouter);
app.use("/api/connections", connectionsRouter);

app.get("/", (req, res) => {
  res.json({
    message: "CineGraph API is running",
  });
});

const PORT = 5000;

async function startServer() {
  try {
    await verifyDatabaseConnection();

    app.listen(PORT, () => {
      console.log(` CineGraph API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(" Failed to connect to CognoDB");
    console.error(error);
    process.exit(1);
  }
}

startServer();
