import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [genre, setGenre] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.getMovie(id).then(async (data) => {
      setMovie(data);
      if (data.genreId) {
        const g = await api.getGenre(data.genreId);
        setGenre(g);
      }
    });
    api.getReviews(id).then(setReviews);
  }, [id]);

  const handleAddReview = async () => {
    if (!comment) return;
    const newReview = await api.createReview({
      movieId: parseInt(id),
      userId: user.id,
      comment,
      rating,
      createdAt: new Date().toISOString()
    });
    setReviews([...reviews, newReview]);
    setComment("");
    setRating(5);
  };

  const handleDeleteReview = async (reviewId) => {
    await api.deleteReview(reviewId);
    setReviews(reviews.filter(r => r.id !== reviewId));
  };

  const handleDeleteMovie = async () => {
    if (confirm("Delete this movie?")) {
      await api.deleteMovie(id);
      navigate("/");
    }
  };

  if (!movie) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: "flex", gap: "20px" }}>
        <img src={movie.posterUrl} alt={movie.title} style={{ width: "300px", borderRadius: "10px" }} />
        <div>
          <h1>{movie.title}</h1>
          <p>Year: {movie.year}</p>
          <p>Genre: {genre?.name}</p>
          <p>Rating: ⭐ {movie.rating}/10</p>
          <p>{movie.description}</p>
          {user && (
            <>
              <button onClick={() => navigate(`/movies/edit/${movie.id}`)}>Edit</button>
              <button onClick={handleDeleteMovie} style={{ marginLeft: "10px" }}>Delete Movie</button>
            </>
          )}
        </div>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h3>Reviews</h3>
        {user && (
          <div style={{ margin: "20px 0" }}>
            <input
              type="number"
              min="1"
              max="10"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              style={{ marginRight: "10px" }}
            />
            <input
              type="text"
              placeholder="Your review"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ width: "300px", marginRight: "10px" }}
            />
            <button onClick={handleAddReview}>Add Review</button>
          </div>
        )}
        {reviews.map(r => (
          <div key={r.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0", borderRadius: "5px" }}>
            <p>⭐ {r.rating}/10</p>
            <p>{r.comment}</p>
            <small>User {r.userId} - {new Date(r.createdAt).toLocaleDateString()}</small>
            {user?.role === "admin" && (
              <button onClick={() => handleDeleteReview(r.id)} style={{ marginLeft: "10px" }}>Delete</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}