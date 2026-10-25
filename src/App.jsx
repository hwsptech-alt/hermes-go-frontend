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
import Historial from './Historial';
import MapaSeguimiento from './MapaSeguimiento';
import ActaEntrega from './ActaEntrega';
import MisViajes from './MisViajes';
import LlegadaDestino from './LlegadaDestino';
import Calificacion from './Calificacion';
import Recogida from './Recogida';

function App() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [logueado, setLogueado] = useState(false);
  const [usuario, setUsuario] = useState(null);
  
  // Estados de Navegación
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const [mostrarPublicarCarga, setMostrarPublicarCarga] = useState(false);
  const [mostrarVerCargas, setMostrarVerCargas] = useState(false);
  const [mostrarConfirmarServicio, setMostrarConfirmarServicio] = useState(false);
  const [cargaPublicada, setCargaPublicada] = useState(null);
  const [cargaSeleccionadaTransportador, setCargaSeleccionadaTransportador] = useState(null);
  
  // Estados de Pago y Cliente
  const [mostrarPago, setMostrarPago] = useState(false);
  const [cargaParaPagar, setCargaParaPagar] = useState(null);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  
  // Estados de Seguimiento y Mapa
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [cargaParaMapa, setCargaParaMapa] = useState(null);
  
  // Estados de Transportador
  const [mostrarMisViajes, setMostrarMisViajes] = useState(false);
  const [mostrarActa, setMostrarActa] = useState(false);
  const [cargaParaActa, setCargaParaActa] = useState(null);
  const [mostrarLlegada, setMostrarLlegada] = useState(false);
  const [cargaLlegada, setCargaLlegada] = useState(null);
  const [mostrarRecogida, setMostrarRecogida] = useState(false);
  const [cargaRecogida, setCargaRecogida] = useState(null);

  // Estados para Calificación
  const [mostrarCalificacion, setMostrarCalificacion] = useState(false);
  const [cargaParaCalificar, setCargaParaCalificar] = useState(null);

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

  // 1. Calificación
  if (mostrarCalificacion && cargaParaCalificar) {
    return <Calificacion 
      carga={cargaParaCalificar} 
      onVolver={() => { setMostrarCalificacion(false); setCargaParaCalificar(null); setMostrarHistorial(true); }} 
    />;
  }

  // 2. Recogida (Transportador)
  if (mostrarRecogida && cargaRecogida) {
    return <Recogida 
      carga={cargaRecogida} 
      onFinalizar={() => { setMostrarRecogida(false); setCargaRecogida(null); setMostrarMisViajes(true); }} 
      onVolver={() => setMostrarRecogida(false)} 
    />;
  }

  // 3. Llegada al Destino (Transportador)
  if (mostrarLlegada && cargaLlegada) {
    return <LlegadaDestino 
      carga={cargaLlegada} 
      onFinalizar={() => { setMostrarLlegada(false); setCargaLlegada(null); setMostrarMisViajes(true); }} 
      onVolver={() => setMostrarLlegada(false)} 
    />;
  }

  // 4. Mapa de Seguimiento
  if (mostrarMapa && cargaParaMapa) {
    return <MapaSeguimiento carga={cargaParaMapa} onVolver={() => setMostrarMapa(false)} />;
  }

  // 5. Mis Viajes (Transportador)
  if (mostrarMisViajes) {
    return <MisViajes 
      usuario={usuario} 
      onVolver={() => setMostrarMisViajes(false)} 
      onVerMapa={(carga) => { setCargaParaMapa(carga); setMostrarMapa(true); setMostrarMisViajes(false); }}
      onRecogida={(carga) => { setCargaRecogida(carga); setMostrarRecogida(true); setMostrarMisViajes(false); }}
      onLlegadaDestino={(carga) => { setCargaLlegada(carga); setMostrarLlegada(true); setMostrarMisViajes(false); }}
    />;
  }

  // 6. Historial (Cliente)
  if (mostrarHistorial) {
    return <Historial 
      usuario={usuario} 
      onVolver={() => setMostrarHistorial(false)} 
      onIrAPagar={(carga) => { setCargaParaPagar(carga); setMostrarHistorial(false); setMostrarPago(true); }} 
      onVerMapa={(carga) => { setCargaParaMapa(carga); setMostrarHistorial(false); setMostrarMapa(true); }}
      onCalificar={(carga) => { setCargaParaCalificar(carga); setMostrarCalificacion(true); setMostrarHistorial(false); }}
    />;
  }

  // 7. Pago (Cliente)
  if (mostrarPago && cargaParaPagar) {
    return <Pago 
      carga={cargaParaPagar} 
      usuario={usuario} 
      onPagar={() => { setMostrarPago(false); setMostrarPublicarCarga(false); setCargaParaPagar(null); }} 
      onVolver={() => setMostrarPago(false)} 
    />;
  }

  // 8. Ver Cargas (Transportador)
  if (mostrarVerCargas) {
    return <VerCargas 
      usuario={usuario} 
      onVolver={() => setMostrarVerCargas(false)} 
      onSeleccionarCarga={(carga) => { setCargaSeleccionadaTransportador(carga); setMostrarVerCargas(false); setMostrarConfirmarServicio(true); }} 
    />;
  }

  // 9. Confirmar Servicio
  if (mostrarConfirmarServicio && (cargaPublicada || cargaSeleccionadaTransportador)) {
    const cargaAMostrar = cargaSeleccionadaTransportador || cargaPublicada;
    const transportadorAMostrar = cargaSeleccionadaTransportador ? usuario : (cargaAMostrar.transportador || { nombreCompleto: 'Pendiente', tipoVehiculo: 'N/A', placa: 'N/A' });

    return <ConfirmarServicio 
      carga={cargaAMostrar} 
      transportador={transportadorAMostrar} 
      usuario={usuario}
      onConfirmar={() => { 
        setMostrarConfirmarServicio(false); 
        if (cargaSeleccionadaTransportador) { 
          setCargaSeleccionadaTransportador(null); 
          setMostrarPublicarCarga(false); 
          alert('¡Has aceptado la carga exitosamente!'); 
        } else { 
          setCargaParaPagar(cargaAMostrar);
          setMostrarPago(true);
          setCargaPublicada(null); 
          setMostrarPublicarCarga(false); 
        }
      }} 
      onVolver={() => { 
        setMostrarConfirmarServicio(false); 
        if (cargaSeleccionadaTransportador) setMostrarVerCargas(true); 
      }} 
    />;
  }

  // 10. Perfil
  if (mostrarPerfil) {
    if (usuario.rol === 'TRANSPORTADOR') {
      return <PerfilTransportador usuario={usuario} onCerrarSesion={() => { setMostrarPerfil(false); setLogueado(false); }} onVolver={() => setMostrarPerfil(false)} />;
    } else {
      return <Perfil usuario={usuario} onCerrarSesion={() => { setMostrarPerfil(false); setLogueado(false); }} onVolver={() => setMostrarPerfil(false)} />;
    }
  }

  // 11. Publicar Carga (Cliente)
  if (mostrarPublicarCarga) {
    return <PublicarCarga 
      usuario={usuario} 
      onVolver={() => setMostrarPublicarCarga(false)} 
      onConfirmarServicio={(carga) => { setCargaPublicada(carga); setMostrarConfirmarServicio(true); }} 
    />;
  }

  // 12. Home
  if (logueado) {
    if (usuario.rol === 'TRANSPORTADOR') {
      return <HomeTransportador 
        usuario={usuario} 
        onCerrarSesion={() => setLogueado(false)} 
        onVerPerfil={() => setMostrarPerfil(true)} 
        onVerCargas={() => setMostrarVerCargas(true)} 
        onVerMisViajes={() => setMostrarMisViajes(true)} 
      />;
    } else {
      return <Home 
        usuario={usuario} 
        onCerrarSesion={() => setLogueado(false)} 
        onVerPerfil={() => setMostrarPerfil(true)} 
        onPublicarCarga={() => setMostrarPublicarCarga(true)} 
        onVerHistorial={() => setMostrarHistorial(true)} 
      />;
    }
  }

  // 13. Registro
  if (mostrarRegistro) {
    return <Registro onVolverAlLogin={() => setMostrarRegistro(false)} />;
  }

  // 14. Login
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
          <div className="forgot-password"><a href="#">¿Olvidaste tu contraseña?</a></div>
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