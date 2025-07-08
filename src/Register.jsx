//  Importaciones necesarias
import { useState, useEffect, useContext } from "react";
import { UserContext } from "./context/UserContext";
import { supabase } from "./config/supabase";
import { useNavigate } from "react-router";
import "./css/Register.css";

export default function Register() {
  //  Estados locales
  const navigate = useNavigate();
  const { user, loading } = useContext(UserContext);
  const [message, setMessage] = useState("Registro");
  const [form, setForm] = useState({ email: "", password: "", nombre: "", apellido: "" });

  //  Comprobación de sesión activa
  useEffect(() => {
    // Si la carga ha terminado y hay un usuario, redirige a la página principal
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  //  Manejadores de eventos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Validar que el correo sea institucional (Unimet)
    const correoValido = /^[a-zA-Z0-9._%+-]+@correo\.unimet\.edu\.ve$/.test(form.email);
    if (!correoValido) {
      setMessage("Solo se permite correo institucional (@correo.unimet.edu.ve)");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          nombre: form.nombre,
          apellido: form.apellido,
          display_name: `${form.nombre} ${form.apellido}`,
        }
      }
    });
    if (error) {
      setMessage(`Error al registrar: ${error.message}`);
      return;
    }
    setForm({ email: "", password: "", nombre: "", apellido: "" });
    navigate("/login");
  };

  const handleGoogleRegister = async () => {
    const redirectTo = import.meta.env.DEV
    ? 'http://localhost:5173'
    : `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo }
    });
    if (error) setMessage(`Error con Google: ${error.message}`);
  };

  //  Renderizado de la interfaz de usuario
  return (
    <div className="background-vista">
      <div className="register-container">
        <h1 className="register-title">{message}</h1>
        <h2 className="register-subtitle">Regístrate para reservar el espacio adaptado a ti.</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div className="input-group">
            <label htmlFor="apellido">Apellido</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="ejemplo@correo.unimet.edu.ve"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <button type="submit" className="submit-button">
            Registrarse
          </button>
        </form>

        <hr style={{ margin: "1.5rem 0" }} />

        <button onClick={handleGoogleRegister} className="google-button">
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            className="google-logo"
          />
          Registrarse con Google
        </button>
      </div>
    </div>
  );
}
