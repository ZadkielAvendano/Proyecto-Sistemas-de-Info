import React from "react";
import { useNavigate } from "react-router";

const placeholder_image = "https://placehold.co/960x540?text=Imagen+no+disponible";

export default function SpaceCard({ espacio, onReservar }) {
    const navigate = useNavigate()

    const handleReservar = () => {
        navigate(`/reserva/${espacio.id}`);
    };

    const {
        nombre,
        tipo,
        capacidad,
        equipamiento,
        estado,
        imagen,
        descripcion
    } = espacio;

    return (
        <div className="espacio-card">
            <div className="espacio-header">
                <h3>{nombre}</h3>
                <span className={`estado ${estado.toLowerCase()}`}>{estado}</span>
            </div>
            <div className="espacio-info">
                <img
                    src={!imagen[0] || imagen[0].trim() === "" ? placeholder_image : imagen[0]}
                    alt={`Imagen del espacio ${nombre}`}
                />
                <p><strong>Tipo:</strong> {tipo}</p>
                <p><strong>Capacidad:</strong> {capacidad} personas</p>
                <p><strong>Equipamiento:</strong></p>
                <ul>
                    {equipamiento.split(", ").map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>
            <button
                onClick={handleReservar}
                className="reservar-btn"
                disabled={estado.toLowerCase() === 'disponible' ? false : true}
                style={estado.toLowerCase() === 'disponible' ? { opacity: 1 } : { opacity: 0.6, cursor: 'not-allowed' }}
            >
                {estado.toLowerCase() === 'disponible' ? 'Reservar' : 'No disponible'}
            </button>
        </div>
    );
}
