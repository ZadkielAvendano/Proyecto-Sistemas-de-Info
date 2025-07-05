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
import Spaces from "./Spaces.jsx";
import Reserva from "./Reserva.jsx";
import "./css/App.css";
import ContactPage from "./ContactPage.jsx";
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
          element: <Profile />
        },
        {
          path: '/spaces',
          element: <Spaces />
        },
        {
          path: '/reserva/:spacioId',
          element: <Reserva />
        },
      {
          path: '/contact', 
          element: <ContactPage />
        },
      ]}


  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App
