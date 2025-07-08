import "./css/ContactPage.css";
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { supabase } from './config/supabase.js';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert([formData])
        .select();

      if (error) {
        throw error;
      }

      setSubmitStatus({ success: true, message: 'Mensaje enviado con éxito!' });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error saving contact form:', error);
      setSubmitStatus({ success: false, message: 'Error al enviar el mensaje. Por favor intente nuevamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          {submitStatus && (
            <div className={`submit-message ${submitStatus.success ? 'success' : 'error'}`}>
              {submitStatus.message}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nombre Completo</label>
              <input 
                type="text" 
                id="name" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input 
                type="email" 
                id="email" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Asunto</label>
              <select 
                id="subject" 
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un asunto</option>
                <option value="reservation">Problemas con reservaciones</option>
                <option value="technical">Soporte técnico</option>
                <option value="general">Consulta general</option>
                <option value="other">Otro</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Mensaje</label>
              <textarea 
                id="message" 
                rows="5" 
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
            </button>
          </form>
        </section>
      </div>
      
      <div className="map-container">
        <h2>Ubicación en el Campus</h2>
        <div className="map-placeholder">
          {/* Poner el codigo de google maps con la ubicacion de la universidad acá */}
          <p>Mapa de Google Maps aparecerá aquí</p>
        </div>
      </div>
    </div>
  );
}