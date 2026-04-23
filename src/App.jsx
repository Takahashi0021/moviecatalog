import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { setMovies } from './redux/store';
import MovieDetail from './components/MovieDetail';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import MovieForm from './components/MovieForm';
import './App.css';

export default function App() {
  const movies = useSelector(state => state.movies);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [filteredMovies, setFilteredMovies] = useState([]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    fetch('http://localhost:3001/movies')
      .then(res => res.json())
      .then(data => {
        dispatch(setMovies(data));
        setFilteredMovies(data);
      });
    fetch('http://localhost:3001/genres').then(res => res.json()).then(setGenres);
  }, []);

  useEffect(() => {
    if (selectedGenre) {
      setFilteredMovies(movies.filter(m => m.genreId === selectedGenre.id));
    } else {
      setFilteredMovies(movies);
    }
  }, [selectedGenre, movies]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <BrowserRouter>
      <div className={`app ${theme}`}>
        <nav className="navbar">
          <Link to="/" className="navbar-brand">🎬 MovieCatalog</Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">Movies</Link>
            {user && <Link to="/movies/create" className="nav-link">➕ Add</Link>}
            {user ? (
              <>
                <span className="user-welcome">👋 {user.name}</span>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link">Register</Link>
              </>
            )}
            <button onClick={toggleTheme} className="theme-btn">{theme === 'light' ? '🌙' : '☀️'}</button>
          </div>
        </nav>
        <div className="container">
          <Routes>
            <Route path="/" element={
              <>
                <h1>Movie Catalog</h1>
                <div className="genre-filter">
                  <button className={`genre-btn ${!selectedGenre ? "active" : ""}`} onClick={() => setSelectedGenre(null)}>All</button>
                  {genres.map(g => (
                    <button key={g.id} className={`genre-btn ${selectedGenre?.id === g.id ? "active" : ""}`} onClick={() => setSelectedGenre(g)}>{g.name}</button>
                  ))}
                </div>
                <div className="movie-grid">
                  {filteredMovies.map(movie => (
                    <div key={movie.id} className="movie-card">
                      <img src={movie.posterUrl || "https://via.placeholder.com/300x450?text=No+Poster"} alt={movie.title} className="movie-poster" />
                      <div className="movie-info">
                        <h3 className="movie-title">{movie.title}</h3>
                        <p className="movie-year">{movie.year}</p>
                        <Link to={`/movies/${movie.id}`} className="btn btn-primary">View</Link>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            } />
            <Route path="/movies/:id" element={<MovieDetail />} />
            <Route path="/movies/create" element={user ? <MovieForm /> : <LoginPage />} />
            <Route path="/movies/edit/:id" element={user ? <MovieForm /> : <LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}