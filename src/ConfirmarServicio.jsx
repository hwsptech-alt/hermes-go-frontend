import { useState } from 'react';
import axios from 'axios';
import './App.css';

function ConfirmarServicio({ carga, transportador, usuario, onConfirmar, onVolver }) {
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const handleAceptar = async () => {
    setCargando(true);
    try {
      if (usuario.rol === 'TRANSPORTADOR') {
        const response = await axios.put(
          `http://localhost:8080/api/cargas/${carga.id}/aceptar/${transportador.id}`
        );
        if (response.data) {
          setMensaje('¡Servicio confirmado exitosamente!');
          setTimeout(() => onConfirmar(response.data), 1500);
        }
      } else {
        onConfirmar(carga);
      }
    } catch (error) {
      setMensaje(error.response?.data || 'Error al confirmar el servicio');
    } finally {
      setCargando(false);
    }
  };

  // Validaciones seguras para que no falle la pantalla
  const fechaFormateada = carga?.fechaHora ? new Date(carga.fechaHora).toLocaleString() : 'Fecha pendiente';
  const nombreConductor = transportador?.nombreCompleto || 'Pendiente';
  const tipoVehiculo = transportador?.tipoVehiculo || 'N/A';
  const placa = transportador?.placa || 'N/A';
  const calificacion = transportador?.calificacion || '5.0';
  const precio = carga?.precioFinal || carga?.precioBase || 0;

  return (
    <div className="container">
      <div className="form-card">
        <h2>Resumen del Servicio</h2>
        
        <div className="form-section">
          <h3>Información del Transportador</h3>
          <div className="info-item"><span className="info-label">Conductor</span><span className="info-valor">{nombreConductor}</span></div>
          <div className="info-item"><span className="info-label">Vehículo</span><span className="info-valor">{tipoVehiculo}</span></div>
          <div className="info-item"><span className="info-label">Placa</span><span className="info-valor">{placa}</span></div>
          <div className="info-item"><span className="info-label">Calificación</span><span className="info-valor">⭐⭐⭐⭐⭐ ({calificacion})</span></div>
        </div>

        <div className="form-section">
          <h3>Información del Servicio</h3>
          <div className="info-item"><span className="info-label">Origen</span><span className="info-valor">{carga?.origen || 'N/A'}</span></div>
          <div className="info-item"><span className="info-label">Destino</span><span className="info-valor">{carga?.destino || 'N/A'}</span></div>
          <div className="info-item"><span className="info-label">Fecha y Hora</span><span className="info-valor">{fechaFormateada}</span></div>
          <div className="info-item"><span className="info-label">Tipo de Carga</span><span className="info-valor">{carga?.tipoCarga || 'N/A'}</span></div>
          <div className="info-item"><span className="info-label">Peso</span><span className="info-valor">{carga?.peso || 0} kg</span></div>
        </div>

        <div className="form-section">
          <h3>Precio Total</h3>
          <div className="precio-total">
            ${precio.toLocaleString()} COP
          </div>
        </div>

        {mensaje && <p className="mensaje" style={{ color: '#2e7d32', marginBottom: '10px' }}>{mensaje}</p>}

        <div className="button-group">
          <button className="btn-login" onClick={handleAceptar} disabled={cargando}>
            {cargando ? 'Confirmando...' : (usuario.rol === 'TRANSPORTADOR' ? 'Aceptar Servicio' : 'Ir a Pagar')}
          </button>
          <button className="btn-volver" onClick={onVolver} disabled={cargando}>
            ← Rechazar y Volver
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmarServicio;