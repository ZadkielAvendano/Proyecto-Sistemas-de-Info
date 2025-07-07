import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router';

import AppLayout   from './AppLayout.jsx';
import Homepage    from './Homepage.jsx';
import Register    from './Register.jsx';
import Login       from './Login.jsx';
import Profile     from './Profile.jsx';
import Spaces      from './Spaces.jsx';
import Reserva     from './Reserva.jsx';
import ContactPage from './ContactPage.jsx';
import ProtectedAdminRoute from './ProtectedAdminRoute.jsx';
import AdminSpaces         from './adminSpaces.jsx';

import './css/App.css';

/* Rutas de la aplicación */
export default function App() {
  const router = createBrowserRouter([
    {
      element: <AppLayout />,
      children: [
        { path: '/',           element: <Homepage /> },
        { path: '/register',   element: <Register /> },
        { path: '/login',      element: <Login /> },
        { path: '/profile',    element: <Profile /> },
        { path: '/spaces',     element: <Spaces /> },
        { path: '/reserva/:spacioId', element: <Reserva /> },
        { path: '/contact',    element: <ContactPage /> },

        /* Ruta protegida de administrador */
        {
          path: '/admin/spaces',
          element: (
            <ProtectedAdminRoute>
              <AdminSpaces />
            </ProtectedAdminRoute>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
