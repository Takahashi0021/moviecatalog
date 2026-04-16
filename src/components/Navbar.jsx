import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{
      display: "flex",
      gap: "20px",
      padding: "10px 20px",
      background: theme === "light" ? "#fff" : "#333",
      borderBottom: "1px solid #ccc"
    }}>
      <button onClick={toggleTheme}>Toggle theme</button>
      <Link to="/">Movies</Link>
      {user ? (
        <>
          <Link to="/movies/create">Add Movie</Link>
          <Link to="/profile">Profile</Link>
          {user.role === "admin" && <Link to="/users">Users</Link>}
          <span>Welcome, {user.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </div>
  );
}