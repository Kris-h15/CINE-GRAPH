import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api";

function App() {
  const [actors, setActors] = useState([]);
  const [movies, setMovies] = useState([]);

  const [actor1, setActor1] = useState("");
  const [actor2, setActor2] = useState("");

  const [selectedMovie, setSelectedMovie] = useState("");
  const [movieDetails, setMovieDetails] = useState(null);
  aq;

  const [connection, setConnection] = useState(null);

  const [loadingConnection, setLoadingConnection] = useState(false);
  const [loadingMovie, setLoadingMovie] = useState(false);

  const [error, setError] = useState("");

  // Load actors and movies
  useEffect(() => {
    const loadData = async () => {
      try {
        const [actorsResponse, moviesResponse] = await Promise.all([
          fetch(`${API_URL}/actors`),
          fetch(`${API_URL}/movies`),
        ]);

        const actorsData = await actorsResponse.json();
        const moviesData = await moviesResponse.json();

        setActors(actorsData);
        setMovies(moviesData);
      } catch (error) {
        console.error(error);
        setError("Failed to load CineGraph data.");
      }
    };

    loadData();
  }, []);

  // Find connection
  const findConnection = async () => {
    if (!actor1 || !actor2) {
      setError("Please select both actors.");
      return;
    }

    if (actor1 === actor2) {
      setError("Please select two different actors.");
      return;
    }

    setLoadingConnection(true);
    setError("");
    setConnection(null);

    try {
      const response = await fetch(
        `${API_URL}/connections?actor1=${encodeURIComponent(
          actor1,
        )}&actor2=${encodeURIComponent(actor2)}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setConnection(data);
    } catch (error) {
      console.error(error);
      setError("Failed to find connection.");
    } finally {
      setLoadingConnection(false);
    }
  };

  // Get movie details
  const loadMovie = async (title) => {
    setSelectedMovie(title);
    setMovieDetails(null);
    setError("");

    if (!title) {
      return;
    }

    setLoadingMovie(true);

    try {
      const response = await fetch(
        `${API_URL}/movies/${encodeURIComponent(title)}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setMovieDetails(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load movie details.");
    } finally {
      setLoadingMovie(false);
    }
  };

  return (
    <div className="app">
      {/* HEADER */}

      <header className="header">
        <h1>🎬 CineGraph</h1>
        <p>Explore movies and discover connections between actors</p>
      </header>

      <main className="container">
        {/* CONNECTION FINDER */}

        <section className="card">
          <h2>🔗 Find Actor Connection</h2>

          <div className="selectors">
            <div className="field">
              <label>Actor 1</label>

              <select
                value={actor1}
                onChange={(e) => setActor1(e.target.value)}
              >
                <option value="">Select an actor</option>

                {actors.map((actor) => (
                  <option key={actor.name} value={actor.name}>
                    {actor.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="arrow">→</div>

            <div className="field">
              <label>Actor 2</label>

              <select
                value={actor2}
                onChange={(e) => setActor2(e.target.value)}
              >
                <option value="">Select an actor</option>

                {actors.map((actor) => (
                  <option key={actor.name} value={actor.name}>
                    {actor.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            className="button"
            onClick={findConnection}
            disabled={loadingConnection}
          >
            {loadingConnection ? "Finding..." : "Find Connection"}
          </button>

          {connection && (
            <div className="connection-result">
              {connection.found ? (
                <>
                  <h3>Connection Found 🎉</h3>

                  <div className="connection">
                    {connection.connection.map((item, index) => (
                      <div key={`${item}-${index}`} className="connection-step">
                        <div className="node">{item}</div>

                        {index < connection.connection.length - 1 && (
                          <div className="connection-arrow">↓</div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <h3>No connection found.</h3>
              )}
            </div>
          )}
        </section>

        {/* MOVIE EXPLORER */}

        <section className="card movie-card">
          <h2>🎬 Movie Explorer</h2>

          <div className="movie-selector">
            <label>Select a movie</label>

            <select
              value={selectedMovie}
              onChange={(e) => loadMovie(e.target.value)}
            >
              <option value="">Select a movie</option>

              {movies.map((movie) => (
                <option key={movie.title} value={movie.title}>
                  {movie.title}
                </option>
              ))}
            </select>
          </div>

          {loadingMovie && <p className="loading">Loading movie...</p>}

          {movieDetails && (
            <div className="movie-details">
              <h3>{movieDetails.title}</h3>

              <p>
                <strong>Year:</strong> {movieDetails.year}
              </p>

              <p>
                <strong>Director:</strong> {movieDetails.director}
              </p>

              <div>
                <strong>Genres:</strong>

                <div className="tags">
                  {movieDetails.genres.map((genre) => (
                    <span className="tag" key={genre}>
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              <div className="cast">
                <strong>Cast:</strong>

                <ul>
                  {movieDetails.actors.map((actor) => (
                    <li key={actor}>{actor}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>

        {error && <p className="error">{error}</p>}
      </main>
    </div>
  );
}

export default App;
