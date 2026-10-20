import { useState } from 'react';
import axios from 'axios';
import './Perfil.css';

function Perfil({ usuario, onCerrarSesion }) {
  const [imagenPerfil, setImagenPerfil] = useState(
    usuario.fotoUrl || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
  );
  const [subiendo, setSubiendo] = useState(false);

  // Datos reales para mostrar
  const correoReal = 'hermeswsolorzano@gmail.com';
  const telefonoReal = '3042826762';

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
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleSubirFoto}
            style={{ display: 'none' }}
          />
        </div>

        <div className="seccion">
          <h3>INFORMACIÓN PERSONAL</h3>
          <div className="info-item">
            <span className="info-label">Nombre completo</span>
            <span className="info-valor">{usuario.nombreCompleto}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Correo electrónico verificado</span>
            <span className="info-valor">{correoReal} ✅</span>
          </div>
          <div className="info-item">
            <span className="info-label">Teléfono verificado</span>
            <span className="info-valor">{telefonoReal} ✅</span>
          </div>
        </div>

        <div className="seccion">
          <h3>INFORMACIÓN DE LA EMPRESA (SI APLICA)</h3>
          <div className="info-item">
            <span className="info-label">Empresa / Particular</span>
            <span className="info-valor">Particular</span>
          </div>
          <div className="info-item">
            <span className="info-label">Ciudad</span>
            <span className="info-valor">Bogotá D.C.</span>
          </div>
        </div>

        <div className="seccion">
          <h3>HISTORIAL</h3>
          <div className="info-item">
            <span className="info-label">Reputación</span>
            <span className="info-valor">⭐⭐⭐⭐⭐ (5.0)</span>
          </div>
          <div className="info-item">
            <span className="info-label">Registrado desde</span>
            <span className="info-valor">Oct 2025</span>
          </div>
          <div className="info-item">
            <span className="info-label">Número de envíos realizados</span>
            <span className="info-valor">12 envíos realizados</span>
          </div>
        </div>

        <button className="btn-volver" onClick={onCerrarSesion}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export default Perfil;