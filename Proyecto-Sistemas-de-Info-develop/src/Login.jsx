


import  { useState } from "react";
import {supabase} from './config/supabase';
import { useNavigate } from "react-router";
export default function Login() {
    const navigate = useNavigate();
    const [message, setMessage] = useState('mensaje de logn');
    const [form, setForm] = useState({email: '', password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password 
    })
    if (error){
        setMessage(`Error al verificar el correo: ${error.message}`);
            return;
    };
    if (data) {
        setMessage("Login exitoso, redirigiendo...");
        setForm({
            email: '',
            password: ''
        });
        navigate('/');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: 24, border: "1px solid #ccc", borderRadius: 8 }}>
        <h1>{message}</h1>
      <h2>Login</h2>
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
        <button type="submit" style={{ width: "100%", padding: 10, background: "#007bff", color: "white", border: "none", borderRadius: 4 }}>
          Login
        </button>
      </form>
    </div>
  );
}


