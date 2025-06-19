import { Link } from "react-router";
import unimetLogo from "./assets/unimet_logo.png";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="logo">
        <Link to="/"><img src={unimetLogo} alt="Unimet Logo" /></Link>
      </div>
    </footer>
  )
}
