import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "./context/UserContext";
import { supabase } from "./config/supabase";
import SpaceCard from "./components/SpaceCard";
import "./css/Busqueda.css";

export default function Spaces() {
  const { user, loading } = useContext(UserContext);
  const sesionActiva = !loading && !!user;
  const [busqueda, setBusqueda] = useState("");
  const [allSpaces, setAllSpaces] = useState([]); // Almacena todos los espacios de Supabase
  const [espaciosFiltrados, setEspaciosFiltrados] = useState([]);
  const [loadingSpaces, setLoadingSpaces] = useState(true); // Estado de carga para los espacios
  const [error, setError] = useState(null); // Estado para manejar errores
  const navigate = useNavigate();

  // Función para obtener los espacios de Supabase
  const fetchSpaces = async () => {
    setLoadingSpaces(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('spaces')
        .select('*'); // Selecciona todas las columnas de la tabla 'spaces'

      if (error) {
        throw error;
      }
      setAllSpaces(data);
      setEspaciosFiltrados(data); // Inicialmente, muestra todos los espacios
    } catch (err) {
      console.error("Error al obtener espacios:", err.message);
      setError("No se pudieron cargar los espacios. Inténtalo de nuevo más tarde.");
      setAllSpaces([]); // Limpia los espacios si hay un error
      setEspaciosFiltrados([]);
    } finally {
      setLoadingSpaces(false);
    }
  };

  useEffect(() => {
    fetchSpaces(); // Carga los espacios cuando el componente se monta
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  useEffect(() => {
    // Filtrar espacios basado en la búsqueda
    if (busqueda.trim() === "") {
      setEspaciosFiltrados(allSpaces);
    } else {
      const filtrados = allSpaces.filter(espacio =>
        espacio.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        espacio.tipo.toLowerCase().includes(busqueda.toLowerCase()) ||
        (espacio.equipamiento && espacio.equipamiento.toLowerCase().includes(busqueda.toLowerCase())) ||
        (espacio.descripcion && espacio.descripcion.toLowerCase().includes(busqueda.toLowerCase())) ||
        (espacio.ubicacion && espacio.ubicacion.toLowerCase().includes(busqueda.toLowerCase())) ||
        espacio.estado.toLowerCase().includes(busqueda.toLowerCase())
      );
      setEspaciosFiltrados(filtrados);
    }
  }, [busqueda, allSpaces]); // Depende de 'busqueda' y 'allSpaces'

  const handleBuscar = (e) => {
    e.preventDefault();
    // La búsqueda se actualiza automáticamente con el useEffect
  };

  const handleReservar = (espacio) => {
    console.log(`Función de reserva en Spaces.jsx llamada para: ${espacio.nombre}`);
  };

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
          {loadingSpaces ? (
            <div className="loading-message">Cargando espacios...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : espaciosFiltrados.length > 0 ? (
            <div className="espacios-grid">
              {espaciosFiltrados.map((espacio) => (
                <SpaceCard
                  key={espacio.id}
                  espacio={espacio}
                  onReservar={handleReservar}
                />
              ))}
            </div>
          ) : (
            <div className="no-resultados">
              <p>No se encontraron espacios que coincidan con tu búsqueda.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
