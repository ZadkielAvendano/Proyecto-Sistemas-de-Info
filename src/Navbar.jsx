import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { supabase } from './config/supabase';
import { verificar_sesion } from "./utils";
import unimetLogo from "./assets/unimet_logo.png";
import "./css/Header.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [sesionActiva, setSesionActiva] = useState(false);

  useEffect(() => {
    async function inicializarSesion() {
      const activa = await verificar_sesion();
      setSesionActiva(activa);
    }

    inicializarSesion();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSesionActiva(!!session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setShowHeader(currentY < lastScrollY || currentY < 50);
      if (menuOpen) {
        setMenuOpen(currentY < lastScrollY || currentY < 50)
      }
      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  function handleAction(link) {
    navigate(link);
    setMenuOpen(false);
  }

  return (
    <header className={`header ${showHeader ? "visible" : "hidden"}`}>
      <div className="logo">
        <Link to="/"><img src={unimetLogo} alt="Unimet Logo" /></Link>
      </div>

      <div className="nav-wrapper">
        <nav className={`navbar ${menuOpen? "active" : ""}`}>
          <ul>
            <li><Link onClick={() => handleAction("/")}>Espacios</Link></li>
            <li><Link onClick={() => handleAction("/")}>Calendarios</Link></li>
            <li><Link onClick={() => handleAction("/")}>Reservas</Link></li>
            <li><Link onClick={() => handleAction("/")}>Contacto</Link></li>
            
            {!sesionActiva && (
              <>
                <li><button onClick={() => handleAction("/login")}>Iniciar Sesión</button></li>
                <li className="secondary_button"><button onClick={() => handleAction("/register")}>Registrarse</button></li>
              </>
            )}

            {sesionActiva && (
              <li><button onClick={() => handleAction("/profile")}>Perfil</button></li>
            )}

          </ul>
        </nav>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>
    </header>
  )
}
