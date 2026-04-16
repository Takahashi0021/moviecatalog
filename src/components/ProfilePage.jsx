import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");

  const handleUpdate = async () => {
    await api.updateUser(user.id, { name, email });
    setMessage("Profile updated");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDelete = async () => {
    if (confirm("Delete your account?")) {
      await api.deleteUser(user.id);
      logout();
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Profile</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ display: "block", margin: "10px 0", width: "100%" }}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ display: "block", margin: "10px 0", width: "100%" }}
      />
      <button onClick={handleUpdate}>Update Profile</button>
      <button onClick={handleDelete} style={{ marginLeft: "10px" }}>Delete Account</button>
    </div>
  );
}