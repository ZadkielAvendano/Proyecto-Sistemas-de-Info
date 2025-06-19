import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Homepage from "./Homepage.jsx";
import {supabase} from "./config/supabase.js";
import Profile from "./Profile.jsx";
import AppLayout from "./AppLayout.jsx";
import Register from "./Register.jsx";
import Login from "./Login.jsx";
import "./css/App.css";
function App() {
  const router = createBrowserRouter([
    
      {
      element: <AppLayout />,
      children: [{
          path: '/',
          element: <Homepage />
        },
        {
          path: '/register',
          element: <Register />
        }, {
          path: '/login',
          element: <Login />
        }, {
          path: '/profile',
          element: <Profile/>
        },]}


  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App
