import { useContext } from 'react';
import { Navigate } from 'react-router';
import { UserContext } from './context/UserContext';

/* Bloquea la ruta si el rol no es 'admin' */
export default function ProtectedAdminRoute({ children }) {
  const { perfil, loading } = useContext(UserContext);
  if (loading) return <p style={{ textAlign: 'center' }}>Cargando…</p>;
  if (perfil?.rol !== 'admin') return <Navigate to="/" replace />;
  return children;
}
