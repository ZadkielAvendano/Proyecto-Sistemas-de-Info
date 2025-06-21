import { useContext, useState, useEffect } from 'react';
import { UserContext } from './context/UserContext';
import { supabase } from './config/supabase';
import { useNavigate } from 'react-router';

export default function Profile() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    preferencia: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.user_metadata?.nombre || '',
        apellido: user.user_metadata?.apellido || '',
        preferencia: user.user_metadata?.preferencia || '',
      });
    }
  }, [user]);

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

      if (data.user) {
        setUser(data.user);
      }

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

  return (
    <div
      className="profile-container"
      style={{
        maxWidth: '600px',
        margin: '2rem auto',
        background: '#fff',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      }}
    >
      <h1 style={{ color: '#007bff', fontSize: '28px', marginBottom: '1rem' }}>Mi Perfil</h1>
      <p style={{ marginBottom: '2rem', color: '#555' }}>Gestiona tu información personal</p>

      <div className="profile-form">
        {['nombre', 'apellido', 'preferencia'].map((field) => (
          <div className="form-group" key={field} style={{ marginBottom: '1rem' }}>
            <label
              style={{
                display: 'block',
                fontWeight: 'bold',
                marginBottom: '0.3rem',
                color: '#333',
              }}
            >
              {field.toUpperCase()}:
            </label>
            {isEditing ? (
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="input-field-edit"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                }}
              />
            ) : (
              <div
                style={{
                  background: '#f1f1f1',
                  padding: '10px',
                  borderRadius: '6px',
                  color: '#333',
                }}
              >
                {user?.user_metadata?.[field] || '—'}
              </div>
            )}
          </div>
        ))}

        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label
            style={{
              display: 'block',
              fontWeight: 'bold',
              marginBottom: '0.3rem',
              color: '#333',
            }}
          >
            EMAIL:
          </label>
          <div
            style={{
              background: '#f1f1f1',
              padding: '10px',
              borderRadius: '6px',
              color: '#333',
            }}
          >
            {user?.email || ''}
          </div>
        </div>

        <div
          className="button-group"
          style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'flex-end',
            marginTop: '1rem',
          }}
        >
          {isEditing ? (
            <>
              <button
                className="save-button"
                onClick={handleSave}
                style={{
                  backgroundColor: '#007bff',
                  color: '#fff',
                  padding: '10px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Guardar
              </button>
              <button
                className="cancel-button"
                onClick={handleCancel}
                style={{
                  backgroundColor: '#ccc',
                  color: '#333',
                  padding: '10px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              <button
                className="edit-button"
                onClick={handleEditToggle}
                style={{
                  backgroundColor: '#ff8800',
                  color: '#fff',
                  padding: '10px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Editar Perfil
              </button>
              <button
                className="logout-button"
                onClick={handleSignOut}
                style={{
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  padding: '10px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
