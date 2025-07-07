import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";

import SessionHeartbeat from './components/SessionHeartbeat';

export default function AppLayout() {
  return (
    <div className="app-container">
      <SessionHeartbeat />
      <Navbar />
      <div className="main-content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

