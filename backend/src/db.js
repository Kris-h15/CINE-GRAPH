// docs to connect to Congo database

require("dotenv").config();

const neo4j = require("neo4j-driver");

const URI = process.env.COGNODB_URI;
const USERNAME = process.env.COGNODB_USERNAME;
const PASSWORD = process.env.COGNODB_PASSWORD;

const driver = neo4j.driver(URI, neo4j.auth.basic(USERNAME, PASSWORD));

async function verifyDatabaseConnection() {
  await driver.verifyConnectivity();
  console.log("Connected to CognoDB!");
}

module.exports = {
  driver,
  verifyDatabaseConnection,
};
