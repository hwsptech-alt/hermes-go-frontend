import { useState } from 'react';
import axios from 'axios';
import './App.css';
import Registro from './Registro';
import Home from './Home';
import HomeTransportador from './HomeTransportador';
import Perfil from './Perfil';

function App() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [logueado, setLogueado] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [mostrarPerfil, setMostrarPerfil] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    try {
      const response = await axios.post('http://localhost:8080/api/usuarios/login', {
        correoElectronico: correo,
        contrasena: contrasena
      });

      if (response.data) {
        setUsuario(response.data);
        setLogueado(true);
      }
    } catch (error) {
      if (error.response) {
        setMensaje(error.response.data || 'Credenciales incorrectas');
      } else {
        setMensaje('Error de conexión con el servidor');
      }
    }
  };

  // Pantalla de Perfil
  if (mostrarPerfil) {
    return <Perfil usuario={usuario} onCerrarSesion={() => { setMostrarPerfil(false); setLogueado(false); }} />;
  }

  // Pantalla después del login (según el rol)
  if (logueado) {
    if (usuario.rol === 'TRANSPORTADOR') {
      return <HomeTransportador usuario={usuario} onCerrarSesion={() => setLogueado(false)} onVerPerfil={() => setMostrarPerfil(true)} />;
    } else {
      return <Home usuario={usuario} onCerrarSesion={() => setLogueado(false)} onVerPerfil={() => setMostrarPerfil(true)} />;
    }
  }

  // Pantalla de Registro
  if (mostrarRegistro) {
    return <Registro onVolverAlLogin={() => setMostrarRegistro(false)} />;
  }

  // Pantalla de Login
  return (
    <div className="container">
      <div className="login-card">
        <div className="logo-container">
          <div className="logo-circle">HG</div>
          <h1>Hermes GO</h1>
          <p className="slogan">Logística inteligente<br/>en movimiento</p>
        </div>

        <div className="help-text">
          <div className="help-item">
            <span className="help-icon">📦</span>
            <span>Publica tu carga</span>
          </div>
          <div className="help-item">
            <span className="help-icon">🚚</span>
            <span>Encuentra transportadores</span>
          </div>
          <div className="help-item">
            <span className="help-icon">📍</span>
            <span>Haz seguimiento en tiempo real</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Correo Electrónico</label>
            <div className="input-with-icon">
              <span className="icon">✉️</span>
              <input 
                type="email" 
                value={correo} 
                onChange={(e) => setCorreo(e.target.value)} 
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

          <div className="forgot-password">
            <a href="#">¿Olvidaste tu contraseña?</a>
          </div>

          <button type="submit" className="btn-login">Ingresar</button>
        </form>

        <div className="register-link">
          <p>¿No tienes cuenta? <a href="#" onClick={(e) => { e.preventDefault(); setMostrarRegistro(true); }}>Regístrate</a></p>
        </div>

        {mensaje && <p className="mensaje">{mensaje}</p>}
      </div>
    </div>
  );
}

export default App;