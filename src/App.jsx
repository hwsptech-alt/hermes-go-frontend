import { useState } from 'react';
import axios from 'axios';
import './App.css';
import Registro from './Registro';
import Home from './Home';
import HomeTransportador from './HomeTransportador';
import Perfil from './Perfil';
import PerfilTransportador from './PerfilTransportador';
import PublicarCarga from './PublicarCarga';
import ConfirmarServicio from './ConfirmarServicio';
import VerCargas from './VerCargas';
import Pago from './Pago';
import Historial from './Historial'; // <-- NUEVO IMPORT

function App() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [logueado, setLogueado] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const [mostrarPublicarCarga, setMostrarPublicarCarga] = useState(false);
  const [mostrarVerCargas, setMostrarVerCargas] = useState(false);
  const [mostrarConfirmarServicio, setMostrarConfirmarServicio] = useState(false);
  const [cargaPublicada, setCargaPublicada] = useState(null);
  const [cargaSeleccionadaTransportador, setCargaSeleccionadaTransportador] = useState(null);
  
  // Estados para el Pago
  const [mostrarPago, setMostrarPago] = useState(false);
  const [cargaParaPagar, setCargaParaPagar] = useState(null);

  // NUEVO Estado para el Historial
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

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
      setMensaje(error.response?.data || 'Error de conexión');
    }
  };

  // Pantalla de Pago
  if (mostrarPago && cargaParaPagar) {
    return <Pago 
      carga={cargaParaPagar} 
      usuario={usuario} 
      onPagar={() => { 
        setMostrarPago(false); 
        setMostrarPublicarCarga(false); 
        setCargaParaPagar(null); 
        alert('¡Pago exitoso! Tu carga está en camino.');
      }} 
      onVolver={() => setMostrarPago(false)} 
    />;
  }

  // NUEVA Pantalla de Historial (El cliente paga desde aquí)
  if (mostrarHistorial) {
    return <Historial 
      usuario={usuario} 
      onVolver={() => setMostrarHistorial(false)} 
      onIrAPagar={(carga) => {
        setCargaParaPagar(carga);
        setMostrarHistorial(false);
        setMostrarPago(true);
      }} 
    />;
  }

  // Ver Cargas (Transportador)
  if (mostrarVerCargas) {
    return <VerCargas 
      usuario={usuario} 
      onVolver={() => setMostrarVerCargas(false)} 
      onSeleccionarCarga={(carga) => {
        setCargaSeleccionadaTransportador(carga);
        setMostrarVerCargas(false);
        setMostrarConfirmarServicio(true);
      }}
    />;
  }

  // Confirmar Servicio (Cliente y Transportador)
  if (mostrarConfirmarServicio && (cargaPublicada || cargaSeleccionadaTransportador)) {
    const cargaAMostrar = cargaSeleccionadaTransportador || cargaPublicada;
    const transportadorAMostrar = cargaSeleccionadaTransportador 
      ? usuario 
      : (cargaAMostrar.transportador || { nombreCompleto: 'Pendiente', tipoVehiculo: 'N/A', placa: 'N/A' });

    return <ConfirmarServicio 
      carga={cargaAMostrar} 
      transportador={transportadorAMostrar}
      usuario={usuario}
      onConfirmar={() => { 
        setMostrarConfirmarServicio(false); 
        if (cargaSeleccionadaTransportador) {
          // Si es transportador, solo cierra y avisa
          setCargaSeleccionadaTransportador(null);
          setMostrarPublicarCarga(false); 
          alert('¡Has aceptado la carga exitosamente!');
        } else {
          // Si es cliente, se publica y vuelve al home (NO paga aún)
          setCargaPublicada(null);
          setMostrarPublicarCarga(false); 
          alert('¡Carga publicada! Un transportador la aceptará pronto. Podrás pagarla desde tu Historial.');
        }
      }} 
      onVolver={() => {
        setMostrarConfirmarServicio(false);
        if (cargaSeleccionadaTransportador) setMostrarVerCargas(true);
      }} 
    />;
  }

  // Perfil
  if (mostrarPerfil) {
    if (usuario.rol === 'TRANSPORTADOR') {
      return <PerfilTransportador usuario={usuario} onCerrarSesion={() => { setMostrarPerfil(false); setLogueado(false); }} onVolver={() => setMostrarPerfil(false)} />;
    } else {
      return <Perfil usuario={usuario} onCerrarSesion={() => { setMostrarPerfil(false); setLogueado(false); }} onVolver={() => setMostrarPerfil(false)} />;
    }
  }

  // Publicar Carga
  if (mostrarPublicarCarga) {
    return <PublicarCarga
      usuario={usuario}
      onVolver={() => setMostrarPublicarCarga(false)}
      onConfirmarServicio={(carga) => {
        setCargaPublicada(carga);
        setMostrarConfirmarServicio(true);
      }}
    />;
  }

  // Home
  if (logueado) {
    if (usuario.rol === 'TRANSPORTADOR') {
      return <HomeTransportador
        usuario={usuario}
        onCerrarSesion={() => setLogueado(false)}
        onVerPerfil={() => setMostrarPerfil(true)}
        onVerCargas={() => setMostrarVerCargas(true)}
      />;
    } else {
      return <Home
        usuario={usuario}
        onCerrarSesion={() => setLogueado(false)}
        onVerPerfil={() => setMostrarPerfil(true)}
        onPublicarCarga={() => setMostrarPublicarCarga(true)}
        onVerHistorial={() => setMostrarHistorial(true)} // <-- NUEVA PROP
      />;
    }
  }

  // Registro
  if (mostrarRegistro) {
    return <Registro onVolverAlLogin={() => setMostrarRegistro(false)} />;
  }

  // Login
  return (
    <div className="container">
      <div className="login-card">
        <div className="logo-container">
          <div className="logo-circle">HG</div>
          <h1>Hermes GO</h1>
          <p className="slogan">Logística inteligente<br/>en movimiento</p>
        </div>

        <div className="help-text">
          <div className="help-item"><span className="help-icon">📦</span><span>Publica tu carga</span></div>
          <div className="help-item"><span className="help-icon">🚚</span><span>Encuentra transportadores</span></div>
          <div className="help-item"><span className="help-icon">📍</span><span>Haz seguimiento en tiempo real</span></div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Correo Electrónico</label>
            <div className="input-with-icon">
              <span className="icon">✉️</span>
              <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="correo@ejemplo.com" required />
            </div>
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <div className="input-with-icon">
              <span className="icon">🔒</span>
              <input type="password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} placeholder="********" required />
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