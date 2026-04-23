import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMovies, fetchGenres, deleteMovie } from "../redux/moviesSlice";

export default function MoviesPage() {
  const dispatch = useDispatch();
  const { list: movies, genres, loading } = useSelector(state => state.movies);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchMovies());
    dispatch(fetchGenres());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Delete this movie?")) {
      dispatch(deleteMovie(id));
    }
  };

  if (loading) return <div className="loading">Loading movies...</div>;

  return (
    <div>
      <h2>🎬 Movies</h2>
      
      <div className="genre-filter">
        <button className="genre-btn active">All</button>
        {genres.map(g => (
          <button key={g.id} className="genre-btn">{g.name}</button>
        ))}
      </div>

      <div className="movie-grid">
        {movies.map(m => (
          <div key={m.id} className="movie-card">
            <img 
              src={m.posterUrl || "https://via.placeholder.com/300x450?text=No+Poster"} 
              alt={m.title} 
              className="movie-poster"
            />
            <div className="movie-info">
              <div className="movie-title">{m.title}</div>
              <div className="movie-year">{m.year}</div>
              <div className="movie-actions" style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                <Link to={`/movies/${m.id}`} className="btn btn-primary">View</Link>
                {user && (
                  <>
                    <Link to={`/movies/edit/${m.id}`} className="btn btn-warning">Edit</Link>
                    <button onClick={() => handleDelete(m.id)} className="btn btn-danger">Delete</button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}