import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    api.getGenres().then(setGenres);
  }, []);

  useEffect(() => {
    if (selectedGenre) {
      api.getMoviesByGenre(selectedGenre.id).then(data => setMovies(data || []));
    } else {
      api.getMovies().then(data => setMovies(data || []));
    }
  }, [selectedGenre]);

  const handleDelete = async (id) => {
    if (confirm("Delete this movie?")) {
      await api.deleteMovie(id);
      if (selectedGenre) {
        api.getMoviesByGenre(selectedGenre.id).then(data => setMovies(data || []));
      } else {
        api.getMovies().then(data => setMovies(data || []));
      }
    }
  };

  return (
    <div>
      <h2>Movies</h2>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", margin: "20px 0" }}>
        <button onClick={() => setSelectedGenre(null)} style={{
          background: !selectedGenre ? "#333" : "#ccc",
          color: !selectedGenre ? "#fff" : "#000"
        }}>All</button>
        {genres.map(g => (
          <button key={g.id} onClick={() => setSelectedGenre(g)} style={{
            background: selectedGenre?.id === g.id ? "#333" : "#ccc",
            color: selectedGenre?.id === g.id ? "#fff" : "#000"
          }}>{g.name}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
        {Array.isArray(movies) && movies.map(m => (
          <div key={m.id} style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "5px" }}>
            <img src={m.posterUrl} alt={m.title} style={{ width: "100%", height: "300px", objectFit: "cover" }} />
            <h3>{m.title}</h3>
            <p>{m.year} | ⭐ {m.rating}</p>
            <Link to={`/movies/${m.id}`}>View Details</Link>
            {user && (
              <>
                <Link to={`/movies/edit/${m.id}`} style={{ marginLeft: "10px" }}>Edit</Link>
                <button onClick={() => handleDelete(m.id)} style={{ marginLeft: "10px" }}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}