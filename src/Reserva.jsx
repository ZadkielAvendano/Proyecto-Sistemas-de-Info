import { useEffect, useState, useContext } from "react";
import { UserContext } from "./context/UserContext";
import { useParams, useNavigate } from "react-router";
import ImageCarousel from './components/ImageCarousel';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { supabase } from "./config/supabase";
import "./css/Reserva.css";

export default function Reserva() {
    const { user, loading } = useContext(UserContext);
    const sesionActiva = !loading && !!user;
    const { espacioId } = useParams();
    const navigate = useNavigate();

    const [spaceDetails, setSpaceDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [errorDetails, setErrorDetails] = useState(null);

    const [showPayPal, setShowPayPal] = useState(false);
    const [reservaData, setReservaData] = useState(null);
    const [pagoExitoso, setPagoExitoso] = useState(false);
    const [reservaGuardada, setReservaGuardada] = useState(false);
    const [formData, setFormData] = useState({ fecha: '', horaInicio: '', horaFin: '', motivo: '' });

    const placeholder_image = "https://placehold.co/960x540?text=Imagen+no+disponible";

    const PAYPAL_CLIENT_ID = "sb"; // SANDBOX_TEST_ID
    const PAYPAL_EMAIL = "tu_email_de_paypal@example.com"; // Email de cuenta PayPal del vendedor

    useEffect(() => {
        const fetchSpaceDetails = async () => {
            console.log("Intentando obtener detalles para espacioId:", espacioId);
            setLoadingDetails(true);
            setErrorDetails(null);
            try {
                if (!espacioId) {
                    console.error("Error: espacioId es indefinido o nulo en useParams.");
                    setErrorDetails("ID del espacio no proporcionado en la URL.");
                    setLoadingDetails(false);
                    return;
                }

                const { data, error } = await supabase
                    .from('spaces')
                    .select('*')
                    .eq('id', espacioId)
                    .single();

                if (error) {
                    console.error("Error de Supabase al obtener espacio:", error);
                    throw error;
                }
                if (!data) {
                    console.warn("No se encontró ningún espacio con el ID:", espacioId);
                    setErrorDetails("Espacio no encontrado.");
                }

                setSpaceDetails(data);
                console.log("Detalles del espacio obtenidos:", data);
            } catch (err) {
                console.error("Error general en fetchSpaceDetails:", err.message);
                setErrorDetails("No se pudieron cargar los detalles del espacio. " + err.message);
                setSpaceDetails(null);
            } finally {
                setLoadingDetails(false);
                console.log("Estado de carga finalizado.");
            }
        };

        fetchSpaceDetails();
    }, [espacioId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fechaActual = new Date();
        const fechaReserva = new Date(formData.fecha);
        const [hI, mI] = formData.horaInicio.split(':').map(Number);
        const [hF, mF] = formData.horaFin.split(':').map(Number);

        const inicioReserva = new Date(formData.fecha);
        inicioReserva.setHours(hI, mI, 0, 0);

        const finReserva = new Date(formData.fecha);
        finReserva.setHours(hF, mF, 0, 0);

        if (fechaReserva < fechaActual.setHours(0,0,0,0)) {
            alert("La fecha de reserva no puede ser en el pasado.");
            return;
        }

        if (finReserva <= inicioReserva) {
            alert("La hora de fin debe ser posterior a la hora de inicio.");
            return;
        }

        // verificar si el espacio está "Disponible" antes de proceder al pago
        if (spaceDetails && spaceDetails.estado !== 'Disponible') {
            alert(`El espacio "${spaceDetails.nombre}" no está disponible para reservar. Estado actual: ${spaceDetails.estado}.`);
            return;
        }

        setReservaData(formData);
        setShowPayPal(true);
    };

    const handleAprobado = async (details) => {
        setPagoExitoso(true);
        setShowPayPal(false);

        // Actualizar el estado del espacio a 'Ocupado' en la tabla 'spaces'
        try {
            const { error: updateError } = await supabase
                .from('spaces')
                .update({ estado: 'Ocupado' })
                .eq('id', espacioId);

            if (updateError) {
                console.error("Error al actualizar el estado del espacio:", updateError);
                alert("Pago exitoso, pero hubo un error al actualizar el estado del espacio. Por favor, contacta al soporte.");
            } else {
                console.log(`Estado del espacio ${espacioId} actualizado a 'Ocupado'.`);
            }
        } catch (err) {
            console.error("Error en la operación de actualización del espacio:", err.message);
            alert("Error crítico al actualizar el estado del espacio. Contacta al soporte.");
        }

        // Guardar la reserva en la tabla 'reservations'
        try {
            const userId = user?.id || null;
            if (!userId) {
                console.warn("No se pudo obtener el ID del usuario para registrar la reserva.");
            }

            const { data, error: insertError } = await supabase
                .from('reservations')
                .insert([
                    {
                        space_id: espacioId,
                        user_id: userId,
                        start_time: `${formData.fecha}T${formData.horaInicio}:00Z`,
                        end_time: `${formData.fecha}T${formData.horaFin}:00Z`,
                        purpose: formData.motivo,
                        status: 'confirmed',
                        paypal_order_id: details.orderID,
                    }
                ]);

            if (insertError) {
                console.error("Error al guardar la reserva en Supabase:", insertError);
                alert("Reserva confirmada con PayPal, pero hubo un error al guardarla en la base de datos.");
            } else {
                console.log("Reserva guardada en Supabase:", data);
                setReservaGuardada(true); // Confirma que la reserva se guardó
            }
        } catch (err) {
            console.error("Error en la operación de inserción de reserva:", err.message);
            alert("Error crítico al guardar la reserva. Contacta al soporte.");
        }

        // Redirigir solo después de un breve retraso para que el usuario vea el mensaje de éxito
        setTimeout(() => {
            navigate("/spaces");
        }, 3000);
    };

    if (!sesionActiva) {
        useEffect(() => {
            if (!loading && !user) {
                navigate('/login');
            }
        }, [user, loading, navigate]);
        return <div className="loading-message">Cargando sesión...</div>;
    }

    if (loadingDetails) {
        return (
            <div className="background-vista">
                <div className="reserva-container">
                    <h1>Cargando detalles del espacio...</h1>
                </div>
            </div>
        );
    }

    if (errorDetails) {
        return (
            <div className="background-vista">
                <div className="reserva-container">
                    <h1>Error al cargar el espacio</h1>
                    <p>{errorDetails}</p>
                    <button onClick={() => navigate('/spaces')}>Volver a la lista de espacios</button>
                </div>
            </div>
        );
    }

    if (!spaceDetails) {
        return (
            <div className="background-vista">
                <div className="reserva-container">
                    <h1>Espacio no encontrado</h1>
                    <p>El espacio con ID {espacioId} no existe o no se pudo cargar.</p>
                    <button onClick={() => navigate('/spaces')}>Volver a la lista de espacios</button>
                </div>
            </div>
        );
    }

    const imagesToDisplay = (spaceDetails.fotos && spaceDetails.fotos.length > 0)
        ? spaceDetails.fotos
        : [placeholder_image];

    return (
        <div className="background-vista">
            <div className="reserva-container">
                {pagoExitoso && reservaGuardada ? ( // Muestra este mensaje solo si el pago Y el guardado son exitosos
                    <>
                        <h1>¡Pago realizado y reserva confirmada!</h1>
                        <p>Gracias por tu reserva. El espacio "{spaceDetails.nombre}" ha sido marcado como 'Ocupado'. Serás redirigido a los espacios en breve.</p>
                    </>
                ) : pagoExitoso && !reservaGuardada ? ( // Si el pago fue exitoso pero el guardado falló
                    <>
                        <h1>¡Pago realizado!</h1>
                        <p>Hubo un problema al registrar tu reserva en la base de datos. Por favor, contacta al soporte con tu ID de transacción de PayPal.</p>
                        <button onClick={() => navigate('/spaces')}>Volver a la lista de espacios</button>
                    </>
                ) : (
                    <>
                        <h1>Reservar: {spaceDetails.nombre}</h1>
                        <p>ID del Espacio: <strong>{espacioId}</strong></p>
                        <p>Tipo: {spaceDetails.tipo} | Capacidad: {spaceDetails.capacidad}</p>
                        {spaceDetails.descripcion && <p>{spaceDetails.descripcion}</p>}
                        {spaceDetails.precio && <p>Precio estimado por reserva: ${parseFloat(spaceDetails.precio).toFixed(2)}</p>}
                        <p className={`space-status ${spaceDetails.estado ? spaceDetails.estado.toLowerCase() : ''}`}>Estado actual: {spaceDetails.estado}</p>

                        <ImageCarousel images={imagesToDisplay} />

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

                                <button
                                    type="submit"
                                    className="reserva-btn"
                                    disabled={spaceDetails.estado !== 'Disponible'} // Deshabilita el botón si no está disponible
                                >
                                    {spaceDetails.estado === 'Disponible' ? 'Confirmar Reserva' : `No disponible (${spaceDetails.estado})`}
                                </button>
                            </form>
                        ) : (
                            <div style={{ marginTop: 32 }}>
                                <h2>Finalizar Pago</h2>
                                <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID, currency: "USD" }}>
                                    <PayPalButtons
                                        style={{ layout: "vertical" }}
                                        createOrder={(data, actions) => {
                                            const totalAmount = parseFloat(spaceDetails.precio || "1.37").toFixed(2);
                                            return actions.order.create({
                                                purchase_units: [
                                                    {
                                                        amount: {
                                                            value: totalAmount
                                                        },
                                                        payee: {
                                                            email_address: PAYPAL_EMAIL
                                                        },
                                                        description: `Reserva espacio: ${spaceDetails.nombre} (ID: ${espacioId}) - Motivo: ${formData.motivo}`
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
                                            console.error("PayPal Error:", err);
                                            setShowPayPal(false);
                                        }}
                                        onCancel={() => {
                                            alert("Pago cancelado.");
                                            setShowPayPal(false);
                                        }}
                                    />
                                </PayPalScriptProvider>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
