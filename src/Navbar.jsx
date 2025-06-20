import { Link } from "react-router";
import unimetLogo from "./assets/unimet_logo.png";

export default function Navbar() {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/"><img src={unimetLogo} alt="Unimet Logo" /></Link>
      </div>
      <nav className="navbar">
        <ul>
          <li><Link>Espacios</Link></li>
          <li><Link>Calendarios</Link></li>
          <li><Link>Reservas</Link></li>
          <li><Link to="/contacto">Contacto</Link></li>
          <li id="login_button"><Link to='/login'><button>Iniciar Sesion</button></Link></li>
          <li id="register_button" className="secondary_button"><Link to='/register'><button>Registrarse</button></Link></li>
          <li id="profile_button"><Link to='/profile'><button>Perfil</button></Link></li>
        </ul>
      </nav>
    </header>
  )
}
