// UserContext.jsx
import { createContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabase.js';

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('UserContext: INICIO del useEffect. Estableciendo loading a true.'); // A
    setLoading(true); // Siempre true al inicio del efecto

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log(`UserContext: onAuthStateChange EVENTO recibido: ${_event}. Sesión:`, session); // B
      const currentUser = session?.user;
      setUser(currentUser);

      if (currentUser) {
        console.log('UserContext: Usuario detectado, ID:', currentUser.id, '. Buscando perfil...'); // C
        const { data, error } = await supabase
          .from('profiles')
          .select('rol')
          .eq('id', currentUser.id)
          .single();

        if (error) {
          console.error('UserContext: ERROR al obtener el perfil:', error); // D
          setPerfil(null); // Si hay error, el perfil es nulo
        } else {
          setPerfil(data ? { id: currentUser.id, ...data } : null); // E
          console.log('UserContext: Perfil obtenido:', data); // F
        }
      } else {
        console.log('UserContext: No hay usuario en la sesión. Perfil establecido a null.'); // G
        setPerfil(null);
      }

      console.log('UserContext: FIN del onAuthStateChange. Estableciendo loading a false. User:', currentUser ? 'OK' : 'NULO', 'Perfil:', perfil ? 'OK' : 'NULO'); // H
      setLoading(false); // La carga termina DESPUÉS de verificar sesión y perfil
    });

    return () => {
      console.log('UserContext: Limpiando suscripción de auth listener.'); // I
      subscription.unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <UserContext.Provider value={{ user, setUser, perfil, loading }}>
      {children}
    </UserContext.Provider>
  );
}