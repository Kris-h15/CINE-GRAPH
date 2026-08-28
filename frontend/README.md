# CineGraph

CineGraph is a graph-based movie exploration application built around **Indian cinema**.  
It uses **Neo4j** to model connections between movies, actors, directors, genres, and languages, making it possible to explore movie relationships using graph queries.

The project demonstrates how a graph database can be used for movie discovery and recommendation instead of representing movies only as independent records.

---

# Features

- Explore Indian movies
- Connect movies with actors and directors
- Organize movies by genres
- Represent movie languages
- Explore relationships between movies and people
- Perform graph-based movie queries using Cypher
- Find related movies through shared actors, directors, genres, or other relationships
- Load realistic seed data using an included script
- React-based frontend for interacting with the application
- Neo4j graph database for storing and querying movie relationships

---

# Why a Graph Database(CongoDB)?

Movie data naturally contains many relationships.

For example:

> A movie has multiple actors, an actor appears in multiple movies, a director directs multiple movies, and movies can share genres and languages.

Representing these connections as a graph makes relationship-based queries much more natural.

For example:

```text
Actor
  │
  │ ACTED_IN
  ▼
Movie
  │
  │ HAS_GENRE
  ▼
Genre
```

# Point

> This website not only finds the relation with the help of common movies, but also based on genres/Language/co-actors, that makes it different from the ordinary
> apart from this main feature their are other simple DB query features

# What Now

> for future thinking of adding a feature where after searching for the connection between two actor it will show us a graphical representaion of the path followed to find the connection using nodes
> will increase the dataset size
