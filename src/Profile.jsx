// Importaciones necesarias
import { useContext, useState, useEffect } from 'react';
import { UserContext } from './context/UserContext';
import { supabase } from './config/supabase';
import { useNavigate } from 'react-router';
import './css/Profile.css';

export default function Profile() {
  //  Estados locales
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    preferencia: '',
  });

  //  Cargar datos del usuario cuando el componente se monta
  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.user_metadata?.nombre || '',
        apellido: user.user_metadata?.apellido || '',
        preferencia: user.user_metadata?.preferencia || '',
      });
    }
  }, [user]);

  //  Manejadores de sesión y edición
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
      alert('Error al cerrar sesión. Por favor intenta de nuevo.');
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!formData.nombre.trim() || !formData.apellido.trim()) {
      alert('Nombre y apellido no pueden estar vacíos.');
      return;
    }

    try {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          ...formData,
          display_name: `${formData.nombre} ${formData.apellido}`,
        },
      });

      if (error) throw error;
      if (data.user) setUser(data.user);

      setIsEditing(false);
      alert('Perfil actualizado con éxito');
    } catch (error) {
      console.error('Error al actualizar el perfil:', error.message);
      alert('Error al actualizar el perfil.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        nombre: user.user_metadata?.nombre || '',
        apellido: user.user_metadata?.apellido || '',
        preferencia: user.user_metadata?.preferencia || '',
      });
    }
  };

  //  Renderizado de la interfaz de usuario
  return (
    <div className="profile-container">
      <h1>Mi Perfil</h1>
      <p className="profile-subtitle">Gestiona tu información personal</p>

      <div className="profile-form">
        {['nombre', 'apellido', 'preferencia'].map((field) => (
          <div className="form-group" key={field}>
            <label>{field.toUpperCase()}:</label>
            {isEditing ? (
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="input-field-edit"
              />
            ) : (
              <div className="input-field">
                {user?.user_metadata?.[field] || '—'}
              </div>
            )}
          </div>
        ))}

        <div className="form-group">
          <label>EMAIL:</label>
          <div className="input-field">{user?.email || ''}</div>
        </div>

        <div className="button-group">
          {isEditing ? (
            <>
              <button className="save-button" onClick={handleSave}>
                Guardar
              </button>
              <button className="cancel-button" onClick={handleCancel}>
                Cancelar
              </button>
            </>
          ) : (
            <>
              <button className="edit-button" onClick={handleEditToggle}>
                Editar Perfil
              </button>
              <button className="logout-button" onClick={handleSignOut}>
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
