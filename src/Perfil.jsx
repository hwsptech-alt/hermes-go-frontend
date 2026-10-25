import { useState } from 'react';
import axios from 'axios';
import './Perfil.css';

function Perfil({ usuario, onCerrarSesion, onVolver }) {
  const [imagenPerfil, setImagenPerfil] = useState(
    usuario.fotoUrl || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
  );
  const [subiendo, setSubiendo] = useState(false);
  const [mostrarEdicion, setMostrarEdicion] = useState(false);
  
  // Estados para el formulario de edición
  const [telefono, setTelefono] = useState(usuario.telefono || '');
  const [ciudad, setCiudad] = useState('Bogotá D.C.');
  const [guardando, setGuardando] = useState(false);

  const correoReal = 'hermeswsolorzano@gmail.com';
  const telefonoReal = usuario.telefono || '3042826762';

  const handleSubirFoto = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const formData = new FormData();
    formData.append('archivo', archivo);
    setSubiendo(true);
    try {
      const response = await axios.post(
        `http://localhost:8080/api/usuarios/${usuario.id}/foto`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      if (response.data) {
        setImagenPerfil(response.data.fotoUrl);
        alert('¡Foto actualizada!');
      }
    } catch (error) {
      alert('Error al subir la foto');
    } finally {
      setSubiendo(false);
    }
  };

  const handleGuardarDatos = async () => {
    setGuardando(true);
    try {
      // Enviamos los datos al backend real
      await axios.put(`http://localhost:8080/api/usuarios/${usuario.id}`, {
        telefono: telefono,
      });
      alert('¡Datos actualizados exitosamente!');
      setMostrarEdicion(false);
      window.location.reload(); // Refrescamos para ver los cambios
    } catch (error) {
      alert('Error al actualizar datos: ' + (error.response?.data || 'Error de conexión'));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="container">
      <div className="perfil-card">
        <div className="perfil-top">
          <div className="foto-container">
            <img src={imagenPerfil} alt="Foto de perfil" className="foto-perfil" />
          </div>
          <div>
            <h2>Hola, {usuario.nombreCompleto.split(' ')[0]} 👋</h2>
            <p className="perfil-rol">{usuario.rol}</p>
          </div>
        </div>

        <div className="foto-upload">
          <label htmlFor="file-upload" className="btn-subir-foto">
            {subiendo ? 'Subiendo...' : '📷 Cambiar Foto'}
          </label>
          <input id="file-upload" type="file" accept="image/*" onChange={handleSubirFoto} style={{ display: 'none' }} />
        </div>

        <div className="seccion">
          <h3>INFORMACIÓN PERSONAL</h3>
          <div className="info-item"><span className="info-label">Nombre completo</span><span className="info-valor">{usuario.nombreCompleto}</span></div>
          <div className="info-item"><span className="info-label">Correo electrónico verificado</span><span className="info-valor">{correoReal} ✅</span></div>
          <div className="info-item"><span className="info-label">Teléfono verificado</span><span className="info-valor">{telefonoReal} ✅</span></div>
          <div className="info-item"><span className="info-label">Método de Pago</span><span className="info-valor">💳 Tarjeta de Crédito **** 1234</span></div>
        </div>

        <div className="seccion">
          <h3>INFORMACIÓN DE LA EMPRESA (SI APLICA)</h3>
          <div className="info-item"><span className="info-label">Empresa / Particular</span><span className="info-valor">Particular</span></div>
          <div className="info-item"><span className="info-label">Ciudad</span><span className="info-valor">{ciudad}</span></div>
        </div>

        <div className="seccion">
          <h3>HISTORIAL</h3>
          <div className="info-item"><span className="info-label">Reputación</span><span className="info-valor">⭐⭐⭐⭐⭐ (5.0)</span></div>
          <div className="info-item"><span className="info-label">Registrado desde</span><span className="info-valor">Oct 2025</span></div>
          <div className="info-item"><span className="info-label">Número de envíos realizados</span><span className="info-valor">12 envíos realizados</span></div>
        </div>

        {/* BOTONES DE GESTIÓN */}
        <button 
          className="btn-volver" 
          style={{ marginBottom: '10px', backgroundColor: '#FF8C00', color: 'white' }}
          onClick={() => setMostrarEdicion(true)}
        >
          ✏️ Editar Datos Personales
        </button>

        <button 
          className="btn-volver" 
          style={{ marginBottom: '10px', backgroundColor: '#333', color: 'white' }}
          onClick={() => alert('Métodos de Pago: Tarjeta de Crédito **** 1234 guardada correctamente.')}
        >
          💳 Mis Métodos de Pago
        </button>

        <button className="btn-volver" onClick={onVolver} style={{ marginBottom: '10px' }}>
          ← Volver al Inicio
        </button>

        <button className="btn-volver" onClick={onCerrarSesion}>
          Cerrar Sesión
        </button>
      </div>

      {/* MODAL DE EDICIÓN DE DATOS */}
      {mostrarEdicion && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div className="perfil-card" style={{ width: '90%', maxWidth: '400px', padding: '20px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Editar Datos</h2>
            
            <div className="seccion">
              <div className="info-item">
                <span className="info-label">Nombre completo</span>
                <input type="text" value={usuario.nombreCompleto} disabled style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: '#f0f0f0', width: '100%' }} />
              </div>
              <div className="info-item" style={{ marginTop: '10px' }}>
                <span className="info-label">Teléfono</span>
                <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }} />
              </div>
              <div className="info-item" style={{ marginTop: '10px' }}>
                <span className="info-label">Ciudad</span>
                <input type="text" value={ciudad} onChange={(e) => setCiudad(e.target.value)} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }} />
              </div>

              {/* SECCIÓN DE TARJETA DE CRÉDITO */}
              <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #ddd' }}>
                <h3 style={{ fontSize: '12px', color: '#FF8C00', marginBottom: '10px' }}>MÉTODO DE PAGO</h3>
                <div className="info-item">
                  <span className="info-label">Número de Tarjeta</span>
                  <input type="text" placeholder="**** **** **** 1234" maxLength="19" style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <div className="info-item" style={{ flex: 1 }}>
                    <span className="info-label">Fecha Exp.</span>
                    <input type="text" placeholder="MM/AA" maxLength="5" style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }} />
                  </div>
                  <div className="info-item" style={{ flex: 1 }}>
                    <span className="info-label">CVV</span>
                    <input type="password" placeholder="***" maxLength="3" style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button className="btn-login" onClick={handleGuardarDatos} disabled={guardando}>
                {guardando ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button className="btn-volver" onClick={() => setMostrarEdicion(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Perfil;