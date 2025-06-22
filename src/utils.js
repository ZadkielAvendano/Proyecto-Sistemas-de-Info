import { supabase } from "./config/supabase";

// Verifica si el usuario tiene una sesion activa
export async function verificar_sesion(){
    const { data, error} = await supabase.auth.getSession();

    if (data.session) {
        console.log("Sesion activa", data.session.user);
        return true;
    } else {
        console.log("No hay sesion activa");
        return false;
    }
}