import { createContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabase.js';

/* Expone user (sesión) + perfil (rol) + loading */
export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user,   setUser]   = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  /* Obtiene el rol desde la tabla profiles */
  async function fetchPerfil(uid) {
    const { data, error } = await supabase
      .from('profiles')
      .select('rol')
      .eq('id', uid)
      .single();
    if (error) console.error(error);
    setPerfil(data ? { id: uid, ...data } : null);
  }

  /* Sesión inicial + listener */
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const cur = data?.user ?? null;
      setUser(cur);
      if (cur) await fetchPerfil(cur.id);
      setLoading(false);
    })();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_evt, session) => {
        const cur = session?.user ?? null;
        setUser(cur);
        cur ? await fetchPerfil(cur.id) : setPerfil(null);
      }
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, perfil, loading }}>
      {children}
    </UserContext.Provider>
  );
}
