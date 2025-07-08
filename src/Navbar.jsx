// Navbar.jsx
import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { UserContext } from './context/UserContext';
import unimetLogo from './assets/unimet_logo.png';
import './css/Header.css';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, perfil, loading } = useContext(UserContext);
  const sesionActiva = !loading && !!user;
  const isAdmin = sesionActiva && perfil?.rol === 'admin';

  const [menuOpen, setMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setShowHeader(y < lastY || y < 50);
      if (menuOpen) setMenuOpen(y < lastY || y < 50);
      setLastY(y);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastY, menuOpen]);

  const go = (path = '') => {
    if (path) navigate(path);
    setMenuOpen(false);
  };

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
            <Link to={sesionActiva ? '/spaces' : '/login'} onClick={() => go(sesionActiva ? '/spaces' : '/login')}>
              Espacios
            </Link>
          </li>

          {isAdmin && (
            <li>
              <Link to="/admin/spaces" onClick={() => go('/admin/spaces')}>
                Admin
              </Link>
            </li>
          )}

          <li>
            <Link to="/contact" onClick={() => go('/contact')}>
              Contacto
            </Link>
          </li>

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
