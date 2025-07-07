// Importaciones necesarias
import { useState, useEffect, useContext } from "react";
import { UserContext } from "./context/UserContext";
import { supabase } from "./config/supabase";
import { useNavigate } from "react-router";
import "./css/Login.css";

export default function Login() {
  // Estados locales
  const navigate = useNavigate();
  const [message, setMessage] = useState("Bienvenido, inicia sesión");
  const [form, setForm] = useState({ email: "", password: "" });
  const { user, loading } = useContext(UserContext);

  // Comprobación de sesión activa
  useEffect(() => {
    // Si la carga ha terminado y hay un usuario, redirige a la página principal
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  // Manejadores de eventos
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const redirectTo = import.meta.env.DEV
    ? 'http://localhost:5173'
    : `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
      options: { redirectTo }
    });
    if (error) return setMessage(`Error: ${error.message}`);
    setMessage("Login exitoso, redirigiendo...");
  };

  const handleGoogleLogin = async () => {
    const redirectTo = import.meta.env.DEV
    ? 'http://localhost:5173'
    : `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo }
    });
    if (error) setMessage(`Error con Google: ${error.message}`);
  };

  // Renderizado de la interfaz de usuario
  return (
    <div className="background-vista">
      <div className="login-container">
        <h1 className="login-title">{message}</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <button type="submit" className="submit-button">
            Login
          </button>
        </form>

        <hr style={{ margin: "1.5rem 0" }} />

        <button onClick={handleGoogleLogin} className="google-button">
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            className="google-logo"
          />
          Iniciar Sesión con Google
        </button>
      </div>
    </div>
  );
}
