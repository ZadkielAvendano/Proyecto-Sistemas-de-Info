import { useState, useEffect } from "react";
import { supabase } from "./config/supabase";
import { useNavigate } from "react-router";

export default function Login() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Bienvenido, inicia sesión");
  const [form, setForm] = useState({ email: "", password: "" });

  /* ─────────────────────────────────────────────
     1) Redirige si ya hay sesión o si vuelve de Google
  ───────────────────────────────────────────── */
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

  /* ─────────────────────────────────────────────
     2) Login con email / contraseña
  ───────────────────────────────────────────── */
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

  /* ─────────────────────────────────────────────
     3) Login con Google
  ───────────────────────────────────────────── */
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) setMessage(`Error con Google: ${error.message}`);
    // No navegamos aquí: el redirect lo hace Google ➔ /auth/v1/callback
  };

  /* ─────────────────────────────────────────────
     4) UI
  ───────────────────────────────────────────── */
  return (
    <div
      style={{
        maxWidth: 400,
        margin: "2rem auto",
        padding: 24,
        border: "1px solid #ccc",
        borderRadius: 8,
      }}
    >
      <h1 style={{ fontSize: 18, marginBottom: 12 }}>{message}</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>Correo electrónico</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 10,
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 4,
          }}
        >
          Login
        </button>
      </form>

      <hr style={{ margin: "1.5rem 0" }} />

      <button
        onClick={handleGoogleLogin}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          width: "100%",
          padding: "10px 16px",
          backgroundColor: "white",
          color: "#3c4043",
          border: "1px solid #dadce0",
          borderRadius: "6px",
          fontSize: "14px",
          fontWeight: 500,
          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          cursor: "pointer",
        }}
      >
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google"
          style={{ width: 20, height: 20 }}
        />
        Iniciar Sesión con Google
      </button>
    </div>
  );
}
