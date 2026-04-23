import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [averageRating, setAverageRating] = useState(0);
  const [genre, setGenre] = useState(null);
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    loadMovie();
    loadReviews();
  }, [id]);

  const loadMovie = async () => {
    const res = await fetch(`http://localhost:3001/movies/${id}`);
    const data = await res.json();
    setMovie(data);
    if (data.genreId) {
      const genreRes = await fetch(`http://localhost:3001/genres/${data.genreId}`);
      setGenre(await genreRes.json());
    }
  };

  const loadReviews = async () => {
    const res = await fetch(`http://localhost:3001/reviews?movieId=${id}`);
    const data = await res.json();
    setReviews(data);
    if (data.length > 0) {
      const sum = data.reduce((acc, r) => acc + r.rating, 0);
      setAverageRating((sum / data.length).toFixed(1));
    } else {
      setAverageRating(0);
    }
  };

  const handleAddReview = async () => {
    if (!comment.trim()) return alert("Write a comment");
    if (!user) return alert("Login first");

    const token = getToken();
    const newReview = {
      movieId: parseInt(id),
      userId: user.id,
      userName: user.name,
      comment, rating,
      createdAt: new Date().toISOString()
    };

    const res = await fetch('http://localhost:3001/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(newReview)
    });

    if (res.ok) {
      const saved = await res.json();
      const updated = [...reviews, saved];
      setReviews(updated);
      setComment("");
      setRating(5);
      const sum = updated.reduce((acc, r) => acc + r.rating, 0);
      setAverageRating((sum / updated.length).toFixed(1));
    } else {
      alert("Error adding review");
    }
  };

  const handleDeleteReview = async (reviewId, reviewUserId) => {
    if (!user) return;
    if (user.role !== "admin" && user.id !== reviewUserId) {
      alert("You can only delete your own reviews");
      return;
    }
    if (!window.confirm("Delete this review?")) return;

    const token = getToken();
    await fetch(`http://localhost:3001/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const updated = reviews.filter(r => r.id !== reviewId);
    setReviews(updated);
    if (updated.length > 0) {
      const sum = updated.reduce((acc, r) => acc + r.rating, 0);
      setAverageRating((sum / updated.length).toFixed(1));
    } else {
      setAverageRating(0);
    }
  };

  const canDeleteMovie = () => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return movie?.createdBy === user.id;
  };

  const handleDeleteMovie = async () => {
    if (!window.confirm("Delete this movie? All reviews will be deleted too.")) return;
    const token = getToken();
    for (const review of reviews) {
      await fetch(`http://localhost:3001/reviews/${review.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    }
    await fetch(`http://localhost:3001/movies/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    navigate('/');
  };

  if (!movie) return <div className="loading">Loading...</div>;

  return (
    <div className="movie-detail">
      <button onClick={() => navigate(-1)} className="btn btn-secondary">← Back</button>
      <div className="movie-detail-container">
        <img src={movie.posterUrl || "https://via.placeholder.com/400x600?text=No+Poster"} alt={movie.title} className="movie-detail-poster" />
        <div className="movie-detail-info">
          <h1>{movie.title}</h1>
          <p>📅 Year: {movie.year}</p>
          <p>🎭 Genre: {genre?.name || "Unknown"}</p>
          <div className="average-rating">
            ⭐ Average Rating: <strong>{averageRating}</strong>/10 ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
          </div>
          <p>{movie.description || "No description"}</p>
          {canDeleteMovie() && (
            <div className="movie-actions">
              <button onClick={() => navigate(`/movies/edit/${movie.id}`)} className="btn btn-warning">Edit</button>
              <button onClick={handleDeleteMovie} className="btn btn-danger">Delete</button>
            </div>
          )}
        </div>
      </div>

      <div className="reviews-section">
        <h3>💬 Reviews ({reviews.length})</h3>
        {user ? (
          <div className="review-form">
            <input type="number" min="1" max="10" value={rating} onChange={e => setRating(parseInt(e.target.value))} className="form-control" style={{ width: "100px", marginBottom: "10px" }} />
            <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Your review..." className="form-control" rows="2" />
            <button onClick={handleAddReview} className="btn btn-primary" style={{ marginTop: "10px" }}>Submit</button>
          </div>
        ) : (
          <div className="login-prompt">Please <Link to="/login">login</Link> to review</div>
        )}
        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet</p>
        ) : (
          reviews.map(r => (
            <div key={r.id} className="review-card">
              <div className="review-header">
                <strong>{r.userName}</strong> <span className="review-rating">⭐ {r.rating}/10</span>
                <small>{new Date(r.createdAt).toLocaleDateString()}</small>
              </div>
              <p>{r.comment}</p>
              {(user?.role === "admin" || user?.id === r.userId) && (
                <button onClick={() => handleDeleteReview(r.id, r.userId)} className="btn btn-danger btn-sm">Delete</button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}