import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { verificar_sesion } from "./utils";
import SpaceCard from "./components/SpaceCard";
import "./css/Busqueda.css";

export default function Spaces() {
  const [sesionActiva, setSesionActiva] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [espaciosFiltrados, setEspaciosFiltrados] = useState([]);
  const navigate = useNavigate();

  const placeholder_image = "https://placehold.co/300x200?text=Imagen+no+disponible";

  // Espacios por defecto
  const espaciosDefault = [
    {
      id: 1,
      nombre: "A01-101",
      tipo: "Aula",
      capacidad: 30,
      equipamiento: "Proyector, Pizarra, Aire acondicionado",
      estado: "Disponible",
      imagen: [],
      descripcion: ""
    },
    {
      id: 2,
      nombre: "A01-302",
      tipo: "Aula",
      capacidad: 25,
      equipamiento: "Proyector, Pizarra, Aire acondicionado",
      estado: "Disponible",
      imagen: [],
      descripcion: ""
    },
    {
      id: 3,
      nombre: "Sala de Juicio",
      tipo: "Sala Especializada",
      capacidad: 50,
      equipamiento: "Sistema de audio, Proyector, Aire acondicionado",
      estado: "Mantenimiento",
      imagen: [],
      descripcion: ""
    },
    {
      id: 4,
      nombre: "Sala Gamer",
      tipo: "Sala de Computación",
      capacidad: 20,
      equipamiento: "Computadoras gaming, Proyector, Aire acondicionado",
      estado: "Ocupado",
      imagen: [],
      descripcion: ""
    }
  ];

  useEffect(() => {
    async function cargarSesion() {
      const activa = await verificar_sesion();
      setSesionActiva(activa);
      
      if (!activa) {
        navigate("/login");
        return;
      }
    }

    cargarSesion();
  }, [navigate]);

  useEffect(() => {
    // Filtrar espacios basado en la búsqueda
    if (busqueda.trim() === "") {
      setEspaciosFiltrados(espaciosDefault);
    } else {
      const filtrados = espaciosDefault.filter(espacio =>
        espacio.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        espacio.tipo.toLowerCase().includes(busqueda.toLowerCase()) ||
        espacio.equipamiento.toLowerCase().includes(busqueda.toLowerCase())
      );
      setEspaciosFiltrados(filtrados);
    }
  }, [busqueda]);

  const handleBuscar = (e) => {
    e.preventDefault();
    // La búsqueda se actualiza automáticamente con el useEffect
  };

  const handleReservar = (espacio) => {
    // Función deshabilitada por ahora
    // alert(`Reserva solicitada para ${espacio.nombre}`);
  };

  if (!sesionActiva) {
    return null; // No mostrar nada mientras redirige
  }

  return (
    <div className="background-vista">
      <div className="busqueda-container">
        <header className="busqueda-header">
          <h1>Búsqueda de Espacios</h1>
          <p>Encuentra y reserva los espacios académicos disponibles</p>
        </header>

        <section className="buscador-section">
          <form onSubmit={handleBuscar} className="buscador-form">
            <input
              type="text"
              placeholder="Buscar espacios por nombre, tipo o equipamiento..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="buscador-input"
            />
            <button type="submit" className="buscador-btn">
              Buscar
            </button>
          </form>
        </section>

        <section className="espacios-section">
          <h2>Espacios Disponibles</h2>
          <div className="espacios-grid">
            {espaciosFiltrados.length > 0 ? (
              espaciosFiltrados.map((espacio) => (
                <SpaceCard
                  key={espacio.id}
                  espacio={espacio}
                  onReservar={handleReservar}
                />
              ))
            ) : (
              <div className="no-resultados">
                <p>No se encontraron espacios que coincidan con tu búsqueda.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
} 