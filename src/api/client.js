const BASE_URL = "http://localhost:3001";

const getToken = () => localStorage.getItem("token");

const headers = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${getToken()}`
});

const api = {
  getMovies: () => fetch(`${BASE_URL}/movies`).then(res => res.json()),
  getMovie: (id) => fetch(`${BASE_URL}/movies/${id}`).then(res => res.json()),
  getMoviesByGenre: (genreId) => fetch(`${BASE_URL}/movies?genreId=${genreId}`).then(res => res.json()),
  createMovie: (data) => fetch(`${BASE_URL}/movies`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data)
  }).then(res => res.json()),
  updateMovie: (id, data) => fetch(`${BASE_URL}/movies/${id}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(data)
  }).then(res => res.json()),
  deleteMovie: (id) => fetch(`${BASE_URL}/movies/${id}`, {
    method: "DELETE",
    headers: headers()
  }),
  getGenres: () => fetch(`${BASE_URL}/genres`).then(res => res.json()),
  getGenre: (id) => fetch(`${BASE_URL}/genres/${id}`).then(res => res.json()),
  getReviews: (movieId) => fetch(`${BASE_URL}/reviews?movieId=${movieId}`).then(res => res.json()),
  createReview: (data) => fetch(`${BASE_URL}/reviews`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data)
  }).then(res => res.json()),
  deleteReview: (id) => fetch(`${BASE_URL}/reviews/${id}`, {
    method: "DELETE",
    headers: headers()
  }),
  getUsers: () => fetch(`${BASE_URL}/users`, { headers: headers() }).then(res => res.json()),
  updateUser: (id, data) => fetch(`${BASE_URL}/users/${id}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify(data)
  }).then(res => res.json()),
  deleteUser: (id) => fetch(`${BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: headers()
  })
};

export default api;