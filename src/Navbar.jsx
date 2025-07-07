import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { supabase } from './config/supabase.js';
import { verificar_sesion } from './utils';
import unimetLogo from './assets/unimet_logo.png';
import './css/Header.css';            // ← asegúrate de que la ruta es correcta

/* Barra de navegación con ocultamiento en scroll */
export default function Navbar() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen]   = useState(false);
  const [sesionActiva, setSesionActiva] = useState(false);
  const [showHeader, setShowHeader]     = useState(true);
  const [lastY, setLastY]         = useState(0);

  /* Actualiza estado de sesión */
  useEffect(() => {
    (async () => setSesionActiva(await verificar_sesion()))();
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_evt, session) => setSesionActiva(!!session)
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  /* Oculta al bajar, muestra al subir */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setShowHeader(y < lastY || y < 50);
      if (menuOpen) setMenuOpen(y < lastY || y < 50);  // cierra menú al bajar
      setLastY(y);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastY, menuOpen]);

  const go = (path = '') => { if (path) navigate(path); setMenuOpen(false); };

  return (
    <header className={`header ${showHeader ? 'visible' : 'hidden'}`}>
      <div className="logo">
        <Link to="/" onClick={() => go()}>
          <img src={unimetLogo} alt="Unimet Logo" />
        </Link>
      </div>

      <nav className={`navbar ${menuOpen ? 'active' : ''}`}>
        <ul>
          <li>
            <Link to={sesionActiva ? '/spaces' : '/'} onClick={() => go()}>
              Espacios
            </Link>
          </li>
          <li><Link to="/"        onClick={() => go()}>Calendarios</Link></li>
          <li><Link to="/contact" onClick={() => go()}>Contacto</Link></li>

          {!sesionActiva ? (
            <>
              <li><button onClick={() => go('/login')}>Iniciar Sesión</button></li>
              <li className="secondary_button">
                <button onClick={() => go('/register')}>Registrarse</button>
              </li>
            </>
          ) : (
            <li><button onClick={() => go('/profile')}>Perfil</button></li>
          )}
        </ul>
      </nav>

      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? '✖' : '☰'}
      </button>
    </header>
  );
}
