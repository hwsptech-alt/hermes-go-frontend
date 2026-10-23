import { useState } from 'react';
import axios from 'axios';
import './App.css';

function Pago({ carga, usuario, onPagar, onVolver }) {
  const [metodoPago, setMetodoPago] = useState('TARJETA');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  // Protegemos los datos por si vienen vacíos
  const transportadorNombre = carga?.transportador?.nombreCompleto || 'Asignado';
  const precioAMostrar = carga?.precioFinal || carga?.precioBase || 0;

  const handlePagar = async () => {
    setCargando(true);
    setMensaje('');
    try {
      const response = await axios.put(
        `http://localhost:8080/api/cargas/${carga.id}/pagar?metodoPago=${metodoPago}`
      );
      if (response.data) {
        setMensaje('¡Pago exitoso! Tu carga está en camino.');
        setTimeout(() => onPagar(response.data), 2000);
      }
    } catch (error) {
      setMensaje(error.response?.data || 'Error al procesar el pago.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container">
      <div className="form-card">
        <h2>Pago del Servicio</h2>
        
        <div className="form-section">
          <h3>Resumen de la Carga</h3>
          <div className="info-item">
            <span className="info-label">Ruta</span>
            <span className="info-valor">{carga?.origen || 'Origen'} ➔ {carga?.destino || 'Destino'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Transportador</span>
            <span className="info-valor">{transportadorNombre}</span>
          </div>
          <div className="precio-total">
            ${precioAMostrar.toLocaleString()} COP
          </div>
        </div>

        <div className="form-section">
          <h3>Método de Pago</h3>
          <div className="switch-group" style={{ cursor: 'pointer' }} onClick={() => setMetodoPago('TARJETA')}>
            <span>Tarjeta de Crédito</span>
            <input type="radio" checked={metodoPago === 'TARJETA'} readOnly />
          </div>
          <div className="switch-group" style={{ cursor: 'pointer' }} onClick={() => setMetodoPago('NEQUI')}>
            <span>Nequi / Daviplata</span>
            <input type="radio" checked={metodoPago === 'NEQUI'} readOnly />
          </div>
          <div className="switch-group" style={{ cursor: 'pointer' }} onClick={() => setMetodoPago('PSE')}>
            <span>PSE (Débito Bancario)</span>
            <input type="radio" checked={metodoPago === 'PSE'} readOnly />
          </div>
        </div>

        {mensaje && <p className="mensaje" style={{ color: mensaje.includes('exitoso') ? '#2e7d32' : '#d32f2f' }}>{mensaje}</p>}

        <div className="button-group">
          <button className="btn-login" onClick={handlePagar} disabled={cargando}>
            {cargando ? 'Procesando Pago...' : `Pagar $${precioAMostrar.toLocaleString()} COP`}
          </button>
          <button className="btn-volver" onClick={onVolver} disabled={cargando}>
            ← Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
}

export default Pago;