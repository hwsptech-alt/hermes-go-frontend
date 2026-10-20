import { useState } from 'react';
import axios from 'axios';
import './App.css';

function Registro({ onVolverAlLogin }) {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [telefono, setTelefono] = useState('');
  const [rol, setRol] = useState('CLIENTE');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    try {
      const response = await axios.post('http://localhost:8080/api/usuarios/registro', {
        nombreCompleto,
        correoElectronico,
        contrasena,
        telefono,
        rol
      });

      if (response.data) {
        setMensaje('¡Registro exitoso! Ahora puedes iniciar sesión.');
        setTimeout(() => onVolverAlLogin(), 2000);
      }
    } catch (error) {
      if (error.response) {
        setMensaje(error.response.data || 'Error al registrar usuario');
      } else {
        setMensaje('Error de conexión con el servidor');
      }
    }
  };

  return (
    <div className="container">
      <div className="login-card">
        <div className="logo-container">
          <div className="logo-circle">HG</div>
          <h1>Hermes GO</h1>
          <p className="slogan">Crear cuenta</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Nombre Completo</label>
            <div className="input-with-icon">
              <span className="icon">👤</span>
              <input 
                type="text" 
                value={nombreCompleto} 
                onChange={(e) => setNombreCompleto(e.target.value)} 
                placeholder="Tu nombre"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Correo Electrónico</label>
            <div className="input-with-icon">
              <span className="icon">✉️</span>
              <input 
                type="email" 
                value={correoElectronico} 
                onChange={(e) => setCorreoElectronico(e.target.value)} 
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <div className="input-with-icon">
              <span className="icon">🔒</span>
              <input 
                type="password" 
                value={contrasena} 
                onChange={(e) => setContrasena(e.target.value)} 
                placeholder="********"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Teléfono</label>
            <div className="input-with-icon">
              <span className="icon">📱</span>
              <input 
                type="text" 
                value={telefono} 
                onChange={(e) => setTelefono(e.target.value)} 
                placeholder="300 123 4567"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Tipo de Usuario</label>
            <select 
              value={rol} 
              onChange={(e) => setRol(e.target.value)}
              className="select-rol"
            >
              <option value="CLIENTE">Cliente</option>
              <option value="TRANSPORTADOR">Transportador</option>
            </select>
          </div>

          <button type="submit" className="btn-login">Registrarse</button>
        </form>

        <div className="register-link">
          <p>¿Ya tienes cuenta? <a href="#" onClick={(e) => { e.preventDefault(); onVolverAlLogin(); }}>Inicia sesión</a></p>
        </div>

        <button className="btn-volver" onClick={onVolverAlLogin}>
          ← Volver al Login
        </button>

        {mensaje && <p className="mensaje">{mensaje}</p>}
      </div>
    </div>
  );
}

export default Registro;