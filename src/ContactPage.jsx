import "./css/ContactPage.css";

export default function ContactPage() {
  return (
    <div className="contact-page">
      <h1>Contacto UNIMET</h1>
      
      <div className="contact-container">
        <section className="contact-info">
          <h2>Información de Contacto</h2>
          <div className="contact-card">
            <h3>Oficina Principal</h3>
            <p><strong>Teléfono:</strong> +58 212-555-1234</p>
            <p><strong>Email:</strong> reservaciones@unimet.edu.ve</p>
            <p><strong>Dirección:</strong> Ditribuidor metropolitano, Blvr. de Sabana Grande, Caracas 1060, Miranda</p>
          </div>
          
          <div className="contact-card">
            <h3>Soporte Técnico</h3>
            <p><strong>Teléfono:</strong> +58 212-555-5678</p>
            <p><strong>Email:</strong> soporte.reservas@unimet.edu.ve</p>
            <p><strong>Horario:</strong> Lunes a Viernes, 8:00 am - 5:00 pm</p>
          </div>
        </section>

        <section className="contact-form">
          <h2>Envíanos un Mensaje</h2>
          <form>
            <div className="form-group">
              <label htmlFor="name">Nombre Completo</label>
              <input type="text" id="name" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input type="email" id="email" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Asunto</label>
              <select id="subject" required>
                <option value="">Seleccione un asunto</option>
                <option value="reservation">Problemas con reservaciones</option>
                <option value="technical">Soporte técnico</option>
                <option value="general">Consulta general</option>
                <option value="other">Otro</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Mensaje</label>
              <textarea id="message" rows="5" required></textarea>
            </div>
            
            <button type="submit" className="submit-btn">Enviar Mensaje</button>
          </form>
        </section>
      </div>
      
      <div className="map-container">
        <h2>Ubicación en el Campus</h2>
        <div className="map-placeholder">
          {/* Replace with actual map embed code */}
          <p>Mapa de Google Maps aparecerá aquí</p>
        </div>
      </div>
    </div>
  );
}