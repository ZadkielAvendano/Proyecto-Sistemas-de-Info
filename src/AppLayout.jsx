import { Outlet } from "react-router";
import Navbar from "./Navbar";


export default function AppLayout() {
  return (
    <>
    <Navbar/>
    <h1>AppLayout</h1>
    <Outlet/>

    
    
    </>
  )
}
