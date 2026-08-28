require("dotenv").config();

const neo4j = require("neo4j-driver");

const URI = process.env.COGNODB_URI;
const USERNAME = process.env.COGNODB_USERNAME;
const PASSWORD = process.env.COGNODB_PASSWORD;

const driver = neo4j.driver(URI, neo4j.auth.basic(USERNAME, PASSWORD));

const movies = [
  {
    title: "3 Idiots",
    year: 2009,
    director: "Rajkumar Hirani",
    genre: "Comedy",
    actors: [
      "Aamir Khan",
      "R. Madhavan",
      "Sharman Joshi",
      "Kareena Kapoor Khan",
    ],
  },
  {
    title: "Dangal",
    year: 2016,
    director: "Nitesh Tiwari",
    genre: "Drama",
    actors: ["Aamir Khan", "Fatima Sana Shaikh", "Sanya Malhotra"],
  },
  {
    title: "PK",
    year: 2014,
    director: "Rajkumar Hirani",
    genre: "Comedy",
    actors: ["Aamir Khan", "Anushka Sharma", "Sushant Singh Rajput"],
  },
  {
    title: "Chennai Express",
    year: 2013,
    director: "Rohit Shetty",
    genre: "Comedy",
    actors: ["Shah Rukh Khan", "Deepika Padukone"],
  },
  {
    title: "Om Shanti Om",
    year: 2007,
    director: "Farah Khan",
    genre: "Romance",
    actors: ["Shah Rukh Khan", "Deepika Padukone"],
  },
  {
    title: "Pathaan",
    year: 2023,
    director: "Siddharth Anand",
    genre: "Action",
    actors: ["Shah Rukh Khan", "Deepika Padukone", "John Abraham"],
  },
  {
    title: "Yeh Jawaani Hai Deewani",
    year: 2013,
    director: "Ayan Mukerji",
    genre: "Romance",
    actors: [
      "Ranbir Kapoor",
      "Deepika Padukone",
      "Aditya Roy Kapur",
      "Kalki Koechlin",
    ],
  },
  {
    title: "Brahmāstra: Part One – Shiva",
    year: 2022,
    director: "Ayan Mukerji",
    genre: "Fantasy",
    actors: ["Ranbir Kapoor", "Alia Bhatt", "Amitabh Bachchan"],
  },
  {
    title: "Rockstar",
    year: 2011,
    director: "Imtiaz Ali",
    genre: "Drama",
    actors: ["Ranbir Kapoor", "Nargis Fakhri"],
  },
  {
    title: "Tamasha",
    year: 2015,
    director: "Imtiaz Ali",
    genre: "Romance",
    actors: ["Ranbir Kapoor", "Deepika Padukone"],
  },
  {
    title: "Zindagi Na Milegi Dobara",
    year: 2011,
    director: "Zoya Akhtar",
    genre: "Drama",
    actors: ["Hrithik Roshan", "Farhan Akhtar", "Abhay Deol", "Katrina Kaif"],
  },
  {
    title: "War",
    year: 2019,
    director: "Siddharth Anand",
    genre: "Action",
    actors: ["Hrithik Roshan", "Tiger Shroff", "Vaani Kapoor"],
  },
  {
    title: "Kabir Singh",
    year: 2019,
    director: "Sandeep Reddy Vanga",
    genre: "Romance",
    actors: ["Shahid Kapoor", "Kiara Advani"],
  },
  {
    title: "Gully Boy",
    year: 2019,
    director: "Zoya Akhtar",
    genre: "Drama",
    actors: ["Ranveer Singh", "Alia Bhatt", "Siddhant Chaturvedi"],
  },
  {
    title: "Padmaavat",
    year: 2018,
    director: "Sanjay Leela Bhansali",
    genre: "Drama",
    actors: ["Deepika Padukone", "Ranveer Singh", "Shahid Kapoor"],
  },
  {
    title: "Bajirao Mastani",
    year: 2015,
    director: "Sanjay Leela Bhansali",
    genre: "Romance",
    actors: ["Ranveer Singh", "Deepika Padukone", "Priyanka Chopra"],
  },
  {
    title: "Dil Dhadakne Do",
    year: 2015,
    director: "Zoya Akhtar",
    genre: "Drama",
    actors: [
      "Ranveer Singh",
      "Priyanka Chopra",
      "Farhan Akhtar",
      "Anil Kapoor",
    ],
  },
  {
    title: "Drishyam",
    year: 2015,
    director: "Nishikant Kamat",
    genre: "Thriller",
    actors: ["Ajay Devgn", "Shriya Saran", "Tabu"],
  },
  {
    title: "Andhadhun",
    year: 2018,
    director: "Sriram Raghavan",
    genre: "Thriller",
    actors: ["Ayushmann Khurrana", "Tabu", "Radhika Apte"],
  },
  {
    title: "Queen",
    year: 2013,
    director: "Vikas Bahl",
    genre: "Comedy",
    actors: ["Kangana Ranaut", "Rajkummar Rao", "Lisa Haydon"],
  },
];

async function seedDatabase() {
  const session = driver.session();

  try {
    console.log("Starting CineGraph Indian cinema seed...");

    // Remove existing movie graph database ()
    await session.run(`
      MATCH (n)
      DETACH DELETE n
    `);

    console.log("Old graph data removed.");

    for (const movie of movies) {
      await session.run(
        `
        MERGE (m:Movie {title: $title})
        SET m.year = $year

        MERGE (d:Director {name: $director})
        MERGE (d)-[:DIRECTED]->(m)

        MERGE (g:Genre {name: $genre})
        MERGE (m)-[:HAS_GENRE]->(g)

        WITH m
        UNWIND $actors AS actorName

        MERGE (a:Actor {name: actorName})
        MERGE (a)-[:ACTED_IN]->(m)
        `,
        {
          title: movie.title,
          year: neo4j.int(movie.year),
          director: movie.director,
          genre: movie.genre,
          actors: movie.actors,
        },
      );

      console.log(`Added: ${movie.title}`);
    }

    const result = await session.run(`
      MATCH (n)
      RETURN labels(n)[0] AS type, count(n) AS count
      ORDER BY type
    `);

    console.log("\n Database summary:");

    for (const record of result.records) {
      console.log(`${record.get("type")}: ${record.get("count").toString()}`);
    }

    console.log("\nCineGraph seed completed successfully!");
  } catch (error) {
    console.error("Seed failed:");
    console.error(error);
  } finally {
    await session.close();
    await driver.close();
  }
}

seedDatabase();
