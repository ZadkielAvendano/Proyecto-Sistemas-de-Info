import { useContext } from 'react';
import { Navigate } from 'react-router';
import { UserContext } from './context/UserContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(UserContext);
  const sesionActiva = !loading && !!user;

  if (!sesionActiva) {
    return <Navigate to="/login" replace />;
  }

  return children;
}