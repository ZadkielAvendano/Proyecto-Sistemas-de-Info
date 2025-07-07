import { useEffect, useState, useContext } from "react";
import { UserContext } from "./context/UserContext";
import { useParams, useNavigate } from "react-router";
import ImageCarousel from './components/ImageCarousel';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import "./css/Reserva.css";

import imagen_1 from "./assets/imagen_1.png";
import imagen_2 from "./assets/imagen_2.png";
import imagen_3 from "./assets/imagen_3.png";

export default function Reserva() {
    const { user, loading } = useContext(UserContext);
    const sesionActiva = !loading && !!user;
    const { espacioId } = useParams();
    const navigate = useNavigate();

    const [showPayPal, setShowPayPal] = useState(false);
    const [reservaData, setReservaData] = useState(null);
    const [pagoExitoso, setPagoExitoso] = useState(false);
    const [formData, setFormData] = useState({ fecha: '', horaInicio: '', horaFin: '', motivo: '' });

    const imagenes = [
        imagen_1,
        imagen_2,
        imagen_3
    ];

    const PAYPAL_CLIENT_ID = "sb";
    const PAYPAL_EMAIL = "javieraguilarm658@gmail.com";

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setReservaData(formData);
        setShowPayPal(true);
    };

    const handleAprobado = (details) => {
        setPagoExitoso(true);
        setShowPayPal(false);
        setTimeout(() => {
            navigate("/spaces");
        }, 2000);
    };

    if (pagoExitoso) {
        return (
            <div className="background-vista">
                <div className="reserva-container">
                    <h1>¡Pago realizado y reserva confirmada!</h1>
                    <p>Gracias por tu reserva. Serás redirigido a los espacios en breve.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="background-vista">
            <div className="reserva-container">
                <h1>Reservar Espacio</h1>
                <p>Estás reservando el espacio con ID: <strong>{espacioId}</strong></p>
                <ImageCarousel images={imagenes} />

                {!showPayPal ? (
                    <form onSubmit={handleSubmit} className="reserva-form">
                        <label>
                            Fecha:
                            <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} required />
                        </label>

                        <label>
                            Hora de inicio:
                            <input type="time" name="horaInicio" value={formData.horaInicio} onChange={handleChange} required />
                        </label>

                        <label>
                            Hora de fin:
                            <input type="time" name="horaFin" value={formData.horaFin} onChange={handleChange} required />
                        </label>

                        <label>
                            Motivo de la reserva:
                            <textarea name="motivo" value={formData.motivo} onChange={handleChange} placeholder="Describa brevemente el propósito..." required />
                        </label>

                        <button type="submit" className="reserva-btn">Confirmar Reserva</button>
                    </form>
                ) : (
                    <div style={{ marginTop: 32 }}>
                        <h2>Pago con PayPal</h2>
                        <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID, currency: "USD" }}>
                            <PayPalButtons
                                style={{ layout: "vertical" }}
                                createOrder={(data, actions) => {
                                    return actions.order.create({
                                        purchase_units: [
                                            {
                                                amount: {
                                                    value: "1.37"
                                                },
                                                payee: {
                                                    email_address: PAYPAL_EMAIL
                                                },
                                                description: `Reserva espacio ID ${espacioId}`
                                            }
                                        ]
                                    });
                                }}
                                onApprove={async (data, actions) => {
                                    await actions.order.capture();
                                    handleAprobado(data);
                                }}
                                onError={(err) => {
                                    alert("Error en el pago: " + err);
                                    setShowPayPal(false);
                                }}
                            />
                        </PayPalScriptProvider>
                    </div>
                )}
            </div>
        </div>
    );
}
