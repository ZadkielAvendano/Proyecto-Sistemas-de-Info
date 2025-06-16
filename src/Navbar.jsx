import { Link } from "react-router";

export default function Navbar() {
  return (
    <nav>
        <ul>
            <li><Link to='/'>Homepage</Link></li>
            <li><Link to='/register'>Register</Link></li>
            <li><Link to='/login'>Login</Link></li>
            <li><Link to='/profile'>Profile</Link></li>
        </ul>
    </nav>
  )
}
