import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';

export default function MovieForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  const [genres, setGenres] = useState([]);
  const [form, setForm] = useState({ title: "", year: new Date().getFullYear(), posterUrl: "", description: "", genreId: "" });
  const [error, setError] = useState("");

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    fetch('http://localhost:3001/genres').then(res => res.json()).then(setGenres);
    if (id) fetch(`http://localhost:3001/movies/${id}`).then(res => res.json()).then(setForm);
  }, [id]);

  const handleSubmit = async () => {
    if (!form.title || !form.year || !form.genreId) return setError("Fill all fields");
    
    const token = getToken();
    if (!token) {
      setError("Please login first");
      return;
    }

    const url = id ? `http://localhost:3001/movies/${id}` : 'http://localhost:3001/movies';
    const method = id ? 'PUT' : 'POST';
    
    const dataToSend = id ? form : { ...form, createdBy: user.id };
    
    const res = await fetch(url, { 
      method, 
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }, 
      body: JSON.stringify(dataToSend) 
    });
    
    if (res.ok) navigate('/');
    else {
      const data = await res.json();
      setError(data.error || "Error saving movie");
    }
  };

  return (
    <div className="form-container">
      <h2>{id ? "Edit" : "Add"} Movie</h2>
      {error && <div className="error-message">{error}</div>}
      <input type="text" placeholder="Title" className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
      <input type="number" placeholder="Year" className="form-control" value={form.year} onChange={e => setForm({ ...form, year: parseInt(e.target.value) })} />
      <input type="text" placeholder="Poster URL" className="form-control" value={form.posterUrl} onChange={e => setForm({ ...form, posterUrl: e.target.value })} />
      <select className="form-control" value={form.genreId} onChange={e => setForm({ ...form, genreId: parseInt(e.target.value) })}>
        <option value="">Select Genre</option>
        {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
      </select>
      <textarea placeholder="Description" className="form-control" rows="3" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
      <button onClick={handleSubmit} className="btn btn-primary">{id ? "Update" : "Create"}</button>
      <button onClick={() => navigate('/')} className="btn btn-secondary">Cancel</button>
    </div>
  );
}