import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";


export default function AppLayout() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

