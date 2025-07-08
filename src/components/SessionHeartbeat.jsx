import { useEffect } from 'react';
import { supabase } from '../config/supabase';

export default function SessionHeartbeat() {
  useEffect(() => {
    const interval = setInterval(async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('❌ Error al obtener la sesión:', error.message);
      } else if (session?.user) {
        console.log('✅ Sesión activa:', session.user.email);
      } else {
        console.warn('⚠️ No hay sesión activa');
      }
    }, 1000); // Cada segundo

    return () => clearInterval(interval); // Limpieza al desmontar
  }, []);

  return null; // No renderiza nada
}
