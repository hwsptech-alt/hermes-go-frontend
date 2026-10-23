import { useState } from 'react';
import axios from 'axios';
import './App.css';

function ActaEntrega({ carga, onFinalizar, onVolver }) {
  const [codigo, setCodigo] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const handleConfirmar = async () => {
    if (!codigo) return setError('Por favor, ingresa el código de entrega.');
    
    setCargando(true);
    setError('');

    try {
      const response = await axios.put(
        `http://localhost:8080/api/cargas/${carga.id}/confirmar-entrega?codigo=${codigo}&observaciones=${observaciones}`
      );

      if (response.data) {
        alert('¡Entrega confirmada exitosamente!');
        onFinalizar(); 
      }
    } catch (error) {
      setError(error.response?.data || 'El código ingresado es incorrecto.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container">
      <div className="form-card">
        <h2>Acta de Entrega</h2>
        
        <div className="form-section">
          <h3>Resumen del Viaje</h3>
          <div className="info-item"><span className="info-label">Ruta</span><span className="info-valor">{carga.origen} ➔ {carga.destino}</span></div>
          <div className="info-item"><span className="info-label">Cliente</span><span className="info-valor">{carga.cliente?.nombreCompleto || 'Anónimo'}</span></div>
          <div className="info-item"><span className="info-label">Peso</span><span className="info-valor">{carga.peso} kg</span></div>
        </div>

        <div className="form-section">
          <h3>Constancia de Recibido</h3>
          <div className="input-group">
            <label>Código de Entrega *</label>
            <input 
              type="text" 
              placeholder="Ingresa el código de 4 dígitos" 
              value={codigo} 
              onChange={(e) => setCodigo(e.target.value)} 
              maxLength="4"
            />
          </div>

          <div className="input-group">
            <label>Observaciones del Receptor (Opcional)</label>
            <textarea 
              placeholder="Ej: Recibido conforme, faltó 1 caja, caja abollada..." 
              value={observaciones} 
              onChange={(e) => setObservaciones(e.target.value)}
              style={{ width: '100%', height: '80px', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontFamily: 'inherit' }}
            />
          </div>
        </div>

        {error && <p className="mensaje" style={{ color: '#d32f2f', marginBottom: '10px' }}>{error}</p>}

        <div className="button-group">
          <button className="btn-login" onClick={handleConfirmar} disabled={cargando}>
            {cargando ? 'Validando...' : 'Confirmar Entrega'}
          </button>
          <button className="btn-volver" onClick={onVolver} disabled={cargando}>
            ← Volver a Mis Viajes
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActaEntrega;