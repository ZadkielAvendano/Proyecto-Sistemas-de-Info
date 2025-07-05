import { useParams, useNavigate } from "react-router";
import ImageCarousel from './components/ImageCarousel';
import "./css/Reserva.css";

import imagen_1 from "./assets/imagen_1.png";
import imagen_2 from "./assets/imagen_2.png";
import imagen_3 from "./assets/imagen_3.png";

export default function Reserva() {
    const { espacioId } = useParams();
    const navigate = useNavigate();


    const imagenes = [
        imagen_1,
        imagen_2,
        imagen_3
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí iría la lógica para enviar la reserva
        alert("Reserva enviada (placeholder)");
        navigate("/spaces");
    };

    return (
        <div className="background-vista">
            <div className="reserva-container">
                <h1>Reservar Espacio</h1>
                <p>Estás reservando el espacio con ID: <strong>{espacioId}</strong></p>
                <ImageCarousel images={imagenes} />

                <form onSubmit={handleSubmit} className="reserva-form">
                    <label>
                        Fecha:
                        <input type="date" required />
                    </label>

                    <label>
                        Hora de inicio:
                        <input type="time" required />
                    </label>

                    <label>
                        Hora de fin:
                        <input type="time" required />
                    </label>

                    <label>
                        Motivo de la reserva:
                        <textarea placeholder="Describa brevemente el propósito..." required />
                    </label>

                    <button type="submit" className="reserva-btn">Confirmar Reserva</button>
                </form>
            </div>
        </div>
    );
}
