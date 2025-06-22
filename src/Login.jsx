// Importaciones necesarias
import { useState, useEffect } from "react";
import { supabase } from "./config/supabase";
import { useNavigate } from "react-router";
import "./css/Login.css";

export default function Login() {
  // Estados locales
  const navigate = useNavigate();
  const [message, setMessage] = useState("Bienvenido, inicia sesión");
  const [form, setForm] = useState({ email: "", password: "" });

  // Comprobación de sesión activa
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/");
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) navigate("/");
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  // Manejadores de eventos
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    if (error) return setMessage(`Error: ${error.message}`);
    setMessage("Login exitoso, redirigiendo...");
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) setMessage(`Error con Google: ${error.message}`);
  };

  // Renderizado de la interfaz de usuario
  return (
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
  );
}
