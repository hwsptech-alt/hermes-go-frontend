import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function VerCargas({ usuario, onVolver, onSeleccionarCarga }) {
  const [cargas, setCargas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCargas = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/cargas/disponibles');
        setCargas(response.data);
      } catch (err) {
        setError('Error al cargar las cargas disponibles.');
      } finally {
        setCargando(false);
      }
    };
    fetchCargas();
  }, []);

  return (
    <div className="container">
      <div className="form-card">
        <h2>Cargas Disponibles</h2>
        
        {cargando && <p className="mensaje">Cargando cargas...</p>}
        {error && <p className="mensaje" style={{ color: '#d32f2f' }}>{error}</p>}
        
        {!cargando && cargas.length === 0 && (
          <p className="mensaje">No hay cargas disponibles en este momento.</p>
        )}

        <div className="lista-cargas">
          {cargas.map((carga) => (
            <div key={carga.id} className="carga-card">
              <div className="carga-header">
                <strong>{carga.origen} ➔ {carga.destino}</strong>
                <span className="badge">{carga.tipoCarga}</span>
              </div>
              <div className="carga-info">
                <span>📅 {new Date(carga.fechaHora).toLocaleString()}</span>
                <span>⚖️ {carga.peso} kg | 📦 {carga.volumen} m³</span>
                <span>💰 ${carga.precioFinal?.toLocaleString() || carga.precioBase?.toLocaleString()} COP</span>
                <span>👤 Cliente: {carga.cliente?.nombreCompleto || 'Anónimo'}</span>
              </div>
              <button 
                className="btn-login" 
                style={{ marginTop: '10px', padding: '8px' }}
                onClick={() => onSeleccionarCarga(carga)}
              >
                Ver Detalles y Aceptar
              </button>
            </div>
          ))}
        </div>

        <button className="btn-volver" onClick={onVolver} style={{ marginTop: '20px' }}>
          ← Volver al Inicio
        </button>
      </div>
    </div>
  );
}

export default VerCargas;