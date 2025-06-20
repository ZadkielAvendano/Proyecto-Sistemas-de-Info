import { useState, useEffect } from "react";
import { supabase } from "./config/supabase";
import { useNavigate } from "react-router";

export default function Register() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("mensaje de registro");
  const [form, setForm] = useState({ email: "", password: "" });

  // Detectar sesión activa (por ejemplo, si regresa de Google)
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });
    if (error) {
      setMessage(`Error al registrar: ${error.message}`);
      return;
    }
    setForm({ email: "", password: "" });
    navigate("/login");
  };

  const handleGoogleRegister = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      console.error("Error con Google:", error.message);
      setMessage(`Error con Google: ${error.message}`);
    }
  };

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
      <h1>{message}</h1>
      <h2>Registro</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
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
          Registrarse
        </button>
      </form>

      <hr style={{ margin: "1.5rem 0" }} />

      <button
        onClick={handleGoogleRegister}
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
        Registrarse con Google
      </button>
    </div>
  );
}
