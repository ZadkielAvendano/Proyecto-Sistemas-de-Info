import React from "react";
import { useNavigate } from "react-router";

const placeholder_image = "https://placehold.co/960x540?text=Imagen+no+disponible";

export default function SpaceCard({ espacio, onReservar }) {
    const navigate = useNavigate();

    const handleReservar = () => {
        navigate(`/reserva/${espacio.id}`);
    };

    const {
        nombre,
        tipo,
        capacidad,
        ubicacion,
        descripcion,
        fotos,
        estado,
    } = espacio;

    // Usar la primera imagen del array 'fotos' o el placeholder
    const displayImage = (fotos && fotos.length > 0 && fotos[0] && fotos[0].trim() !== "")
        ? fotos[0]
        : placeholder_image;

    return (
        <div className="espacio-card">
            <div className="espacio-header">
                <h3>{nombre}</h3>
                <span className={`estado ${estado ? estado.toLowerCase() : ''}`}>{estado}</span>
            </div>
            <div className="espacio-info">
                <img
                    src={displayImage}
                    alt={`Imagen del espacio ${nombre}`}
                    onError={(e) => { e.target.onerror = null; e.target.src = placeholder_image; }} // Fallback en caso de error de carga
                />
                <p><strong>Tipo:</strong> {tipo}</p>
                <p><strong>Ubicación:</strong> {ubicacion}</p>
                <p><strong>Capacidad:</strong> {capacidad} personas</p>
                {descripcion && <p><strong>Descripción:</strong> {descripcion}</p>}
                {/* Si 'equipamiento' es un campo de texto en Supabase, entonces lo parsearías aquí.
                  De lo contrario, esta sección debería ser eliminada o modificada.
                  Por ahora, lo he comentado para que no cause errores si no existe.
                */}
                {/* {equipamiento && ( 
                    <>
                        <p><strong>Equipamiento:</strong></p>
                        <ul>
                            {equipamiento.split(", ").map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </>
                )} */}
            </div>
            <button
                onClick={handleReservar}
                className="reservar-btn"
                // El estado 'disponible' es case-insensitive para la lógica
                disabled={estado && estado.toLowerCase() === 'disponible' ? false : true}
                style={estado && estado.toLowerCase() === 'disponible' ? { opacity: 1 } : { opacity: 0.6, cursor: 'not-allowed' }}
            >
                {estado && estado.toLowerCase() === 'disponible' ? 'Reservar' : 'No disponible'}
            </button>
        </div>
    );
}

