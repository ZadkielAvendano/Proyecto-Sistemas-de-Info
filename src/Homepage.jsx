import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { verificar_sesion } from "./utils";
import imagen_1 from "./assets/imagen_1.png";
import imagen_2 from "./assets/imagen_2.png";
import imagen_3 from "./assets/imagen_3.png";
import "./css/Homepage.css"
   
export default function Homepage() {
  const [sesionActiva, setSesionActiva] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function cargarSesion() {
      const activa = await verificar_sesion();
      setSesionActiva(activa);
    }

    cargarSesion();
  }, []);

  function handleAction(link) {
    if (sesionActiva) {
      navigate(link);
    } else {
      navigate("/login");
    }
  }

  return (
    <>
      {/*Articulo N-1*/}
      <article className="articulo_1">
        <div>
          <h1>Reserva de espacios UNIMET</h1>
          <p>Encuentra, reserva y gestiona los espacios académicos de tu universidad en minutos.
            Plataforma oficial para reservar espacios en la Universidad Metropolitana.
            Disfruta de un proceso rápido, seguro y diseñado para estudiantes.</p>
          <button onClick={() => handleAction("/")}>
            {sesionActiva ? "Reservar ahora" : "Registrarse"}
          </button>
        </div>
        <img src={imagen_1} alt="" />
      </article>

      {/*Articulo N-2*/}
      <article className="articulo_1">
        <img src={imagen_2} alt="" />
        <div>
          <h1>Herramientas diseñadas para ti</h1>
          <ul>
            <li><strong>Búsqueda inteligente:</strong> Filtrar por espacios, capacidad, horario, equipamiento.</li>
            <li><strong>Reserva en tiempo real:</strong> Confirma tu reserva al instante.</li>
            <li><strong>Calendario:</strong> Visualiza tus reservas y evita conflictos de horario.</li>
            <li><strong>Soporte 24/7:</strong> Asistencia técnica para resolver problemas rápidamente.</li>
          </ul>
          <button onClick={() => handleAction("/")}>
            {sesionActiva ? "Ver espacios" : "Registrarse"}
          </button>
        </div>
      </article>

      {/*Articulo N-3*/}
      <article className="articulo_1">
        <div>
          <h1>Eventos Académicos</h1>
          <p>Espacios diseñados para el crecimiento académico y cultural. Realiza con comodidad tus actividades en espacios de alta calidad:</p>
          <ul>
            <li>Conferencias magistrales en auditorios equipados</li>
            <li>Talleres especializados por facultad.</li>
            <li>Exposiciones de proyectos.</li>
            <li>Eventos culturales en áreas comunes adaptables.</li>
          </ul>
        </div>
        <img src={imagen_3} alt="" />
      </article>

      {/*Articulo N-4*/}
      <article className="articulo_2">
        <h1>Acceso Multiplataforma</h1>
        <p>El sistema de reservas UNIMET es responsive, lo que significa que se adapta automáticamente a cualquier dispositivo: celulares,
          tablets o computadoras. Puedes reservar espacios desde tu teléfono con la misma facilidad que desde una laptop, sin perder funcionalidad.</p>
        <button onClick={() => handleAction("/")}>
          {sesionActiva ? "Reservar ahora" : "Registrarse"}
        </button>
      </article>
    </>
        
  )
}