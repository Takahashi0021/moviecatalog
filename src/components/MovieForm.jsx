import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";

export default function MovieForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const [form, setForm] = useState({
    title: "",
    year: new Date().getFullYear(),
    rating: 5,
    posterUrl: "",
    description: "",
    genreId: ""
  });

  useEffect(() => {
    api.getGenres().then(setGenres);
    if (id) {
      api.getMovie(id).then(data => setForm(data));
    }
  }, [id]);

  const handleSubmit = async () => {
    if (id) {
      await api.updateMovie(id, form);
    } else {
      await api.createMovie(form);
    }
    navigate("/");
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto" }}>
      <h2>{id ? "Edit Movie" : "Add Movie"}</h2>
      <input
        type="text"
        placeholder="Title"
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
        style={{ display: "block", margin: "10px 0", width: "100%" }}
      />
      <input
        type="number"
        placeholder="Year"
        value={form.year}
        onChange={e => setForm({ ...form, year: parseInt(e.target.value) })}
        style={{ display: "block", margin: "10px 0", width: "100%" }}
      />
      <input
        type="number"
        step="0.1"
        placeholder="Rating"
        value={form.rating}
        onChange={e => setForm({ ...form, rating: parseFloat(e.target.value) })}
        style={{ display: "block", margin: "10px 0", width: "100%" }}
      />
      <input
        type="text"
        placeholder="Poster URL"
        value={form.posterUrl}
        onChange={e => setForm({ ...form, posterUrl: e.target.value })}
        style={{ display: "block", margin: "10px 0", width: "100%" }}
      />
      <select
        value={form.genreId}
        onChange={e => setForm({ ...form, genreId: parseInt(e.target.value) })}
        style={{ display: "block", margin: "10px 0", width: "100%" }}
      >
        <option value="">Select Genre</option>
        {genres.map(g => (
          <option key={g.id} value={g.id}>{g.name}</option>
        ))}
      </select>
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
        style={{ display: "block", margin: "10px 0", width: "100%", height: "100px" }}
      />
      <button onClick={handleSubmit}>{id ? "Update" : "Create"}</button>
      <button onClick={() => navigate("/")} style={{ marginLeft: "10px" }}>Cancel</button>
    </div>
  );
}