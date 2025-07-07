import { useEffect, useState } from 'react';
import { supabase } from './config/supabase.js';
import './css/AdminSpaces.css';

/* CRUD de espacios para administradores con soporte de imágenes y feedback visual */
export default function AdminSpaces() {
  const empty = {
    id: null,
    nombre: '', tipo: '', ubicacion: '',
    capacidad: '', precio: '', descripcion: '',
    estado: 'activo',
    fotos: [],
  };

  const [spaces, setSpaces]   = useState([]);
  const [form,   setForm]     = useState(empty);
  const [files,  setFiles]    = useState(null);  // archivos seleccionados
  const [show,   setShow]     = useState(false);
  const [editing,setEditing]  = useState(false);

  /* Trae espacios */
  useEffect(() => { fetchSpaces(); }, []);
  async function fetchSpaces() {
    const { data, error } = await supabase.from('spaces')
      .select()
      .order('creado_en', { ascending: false });
    if (!error) setSpaces(data);
  }

  /* Handlers modal */
  const openCreate = () => { setForm(empty); setFiles(null); setEditing(false); setShow(true); };
  const openEdit   = (e)  => { setForm(e);    setFiles(null); setEditing(true);  setShow(true); };
  const close      = ()   => setShow(false);
  const handle     = (e)  => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFiles= (e)  => setFiles(e.target.files);

  /* Sube imágenes al bucket "spaces" y devuelve URLs públicas */
  async function uploadImages() {
    if (!files || files.length === 0) return [];

    const urls = [];
    for (const file of files) {
      const filePath = `${crypto.randomUUID()}-${file.name}`;
      const { error } = await supabase.storage.from('spaces')
        .upload(filePath, file, { contentType: file.type, cacheControl: '3600', upsert: false });
      if (error) {
        console.error('Upload error:', error);
        throw new Error(error.message);
      }
      const { data } = supabase.storage.from('spaces').getPublicUrl(filePath);
      urls.push(data.publicUrl);
    }
    return urls;
  }

  /* Crear / actualizar */
  async function onSubmit(e) {
    e.preventDefault();

    // combina fotos existentes + nuevas
    let fotos = form.fotos ? [...form.fotos] : [];
    try {
      const nuevas = await uploadImages();
      fotos = [...fotos, ...nuevas];
    } catch (err) {
      console.error(err);
      return alert(`Error subiendo imágenes: ${err.message}`);
    }

    const payload = {
      ...form,
      capacidad: form.capacidad === '' ? null : +form.capacidad,
      precio:    form.precio    === '' ? null : +form.precio,
      fotos,
    };

    let error;
    if (editing) {
      ({ error } = await supabase.from('spaces')
        .update(payload)
        .eq('id', form.id));
    } else {
      const { id, ...toInsert } = payload;
      ({ error } = await supabase.from('spaces').insert(toInsert));
    }
    if (error) { console.error(error); return alert('Error guardando'); }

    await fetchSpaces();
    alert(editing ? '¡Espacio actualizado con éxito!' : '¡Espacio creado con éxito!');
    close();
  }

  /* Eliminar */
  async function remove(id) {
    if (!confirm('¿Eliminar este espacio?')) return;
    const { error } = await supabase.from('spaces').delete().eq('id', id);
    if (error) return alert('Error eliminando');
    setSpaces((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="admin-container">
      <h2 className="admin-header">Panel de Administración de Espacios</h2>
      <button className="create-button" onClick={openCreate}>+ Nuevo espacio</button>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Nombre</th><th>Tipo</th><th>Ubicación</th>
            <th>Capacidad</th><th>Precio</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {spaces.map((s) => (
            <tr key={s.id}>
              <td>{s.nombre}</td><td>{s.tipo}</td><td>{s.ubicacion}</td>
              <td>{s.capacidad ?? '-'}</td><td>{s.precio ? `$${s.precio}` : '-'}</td>
              <td>
                <div className="action-buttons">
                  <button className="edit-button"   onClick={() => openEdit(s)}>Editar</button>
                  <button className="delete-button" onClick={() => remove(s.id)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
          {spaces.length === 0 && <tr><td colSpan="6">No hay espacios</td></tr>}
        </tbody>
      </table>

      {show && (
        <div className="modal-backdrop" onClick={close}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">{editing ? 'Editar espacio' : 'Crear nuevo espacio'}</h3>
            <form className="modal-form" onSubmit={onSubmit}>
              {['nombre','tipo','ubicacion'].map((f) => (
                <label key={f}>{f[0].toUpperCase()+f.slice(1)}
                  <input name={f} value={form[f]} onChange={handle} required />
                </label>
              ))}
              <label>Capacidad
                <input type="number" min="1" name="capacidad" value={form.capacidad} onChange={handle} required />
              </label>
              <label>Precio (USD)
                <input type="number" step="0.01" name="precio" value={form.precio} onChange={handle} required />
              </label>
              <label>Descripción
                <textarea name="descripcion" rows="3" value={form.descripcion} onChange={handle} />
              </label>

              {/* Nueva entrada para imágenes */}
              <label>Fotos
                <input type="file" multiple accept="image/*" onChange={handleFiles}/>
              </label>

              {/* Muestra fotos existentes en modo edición */}
              {editing && form.fotos?.length > 0 && (
                <div className="current-photos">
                  <p>Fotos actuales:</p>
                  <div className="current-photos-grid">
                    {form.fotos.map((url,i)=>(
                      <img key={i} src={url} alt={`foto ${i+1}`} />
                    ))}
                  </div>
                </div>
              )}

              <label>Estado
                <select name="estado" value={form.estado} onChange={handle}>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </label>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={close}>Cancelar</button>
                <button type="submit" className="btn-save">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
