import { useState } from 'react';
import axios from 'axios';
import './App.css';

function Recogida({ carga, onFinalizar, onVolver }) {
  const [codigo, setCodigo] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const handleConfirmar = async () => {
    if (!codigo) return setError('Ingresa el código.');
    setCargando(true);
    setError('');
    try {
      await axios.put(`http://localhost:8080/api/cargas/${carga.id}/confirmar-recogida?codigo=${codigo}`);
      alert('¡Mercancía recogida! Ahora estás en ruta.');
      onFinalizar();
    } catch (error) {
      setError(error.response?.data || 'Código incorrecto');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container">
      <div className="form-card">
        <h2>Confirmar Recogida</h2>
        <p style={{ textAlign: 'center', fontSize: '12px', color: '#666' }}>Pide el código al cliente para iniciar el viaje.</p>
        <div className="input-group">
          <label>Código de Recogida *</label>
          <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Ej: 1234" maxLength="4" />
        </div>
        {error && <p className="mensaje" style={{ color: '#d32f2f' }}>{error}</p>}
        <div className="button-group">
          <button className="btn-login" onClick={handleConfirmar} disabled={cargando}>
            {cargando ? 'Validando...' : 'Confirmar Recogida'}
          </button>
          <button className="btn-volver" onClick={onVolver} disabled={cargando}>← Volver</button>
        </div>
      </div>
    </div>
  );
}

export default Recogida;