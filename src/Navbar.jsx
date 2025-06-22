import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { supabase } from './config/supabase';
import unimetLogo from "./assets/unimet_logo.png";
import "./css/Header.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  return (
    <header className={`header ${showHeader ? "visible" : "hidden"}`}>
      <div className="logo">
        <Link to="/"><img src={unimetLogo} alt="Unimet Logo" /></Link>
      </div>

      <div className="nav-wrapper">
        <nav className={`navbar ${menuOpen? "active" : ""}`}>
          <ul>
            <li><Link>Espacios</Link></li>
            <li><Link>Calendarios</Link></li>
            <li><Link>Reservas</Link></li>
            <li><Link>Contacto</Link></li>
            <li id="login_button"><Link to='/login'><button>Iniciar Sesion</button></Link></li>
            <li id="register_button" className="secondary_button"><Link to='/register'><button>Registrarse</button></Link></li>
            <li id="profile_button"><Link to='/profile'><button>Perfil</button></Link></li>
          </ul>
        </nav>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>
    </header>
  )
}
