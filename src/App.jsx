import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import MoviesPage from "./components/MoviesPage";
import MovieForm from "./components/MovieForm";
import MovieDetail from "./components/MovieDetail";
import ProfilePage from "./components/ProfilePage";
import UsersPage from "./components/UsersPage";
import { useTheme } from "./context/ThemeContext";

export default function App() {
  const { user } = useAuth();
  const { theme } = useTheme();

  return (
    <BrowserRouter>
      <div style={{
        background: theme === "light" ? "#f0f0f0" : "#1a1a1a",
        color: theme === "light" ? "#000" : "#fff",
        minHeight: "100vh"
      }}>
        <Navbar />
        <div style={{ padding: "20px" }}>
          <Routes>
            <Route path="/" element={<MoviesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/movies/create" element={user ? <MovieForm /> : <LoginPage />} />
            <Route path="/movies/:id" element={<MovieDetail />} />
            <Route path="/movies/edit/:id" element={user ? <MovieForm /> : <LoginPage />} />
            <Route path="/profile" element={user ? <ProfilePage /> : <LoginPage />} />
            <Route path="/users" element={user?.role === "admin" ? <UsersPage /> : <LoginPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}