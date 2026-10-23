import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function Historial({ usuario, onVolver, onIrAPagar, onVerMapa }) {
  const [cargas, setCargas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/cargas/historial/${usuario.id}`);
        setCargas(response.data);
      } catch (error) {
        console.error("Error al cargar historial", error);
      } finally {
        setCargando(false);
      }
    };
    fetchHistorial();
  }, [usuario.id]);

  return (
    <div className="container">
      <div className="form-card">
        <h2>Historial de Servicios</h2>

        {cargando && <p style={{ textAlign: 'center' }}>Cargando historial...</p>}
        
        {!cargando && cargas.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>No tienes envíos registrados aún.</p>
        )}

        <div className="lista-cargas">
          {cargas.map((carga) => (
            <div key={carga.id} className="carga-card" style={{ textAlign: 'center' }}>
              <strong>{carga.origen} ➔ {carga.destino}</strong>
              <p style={{ color: '#FF8C00', fontWeight: 'bold', margin: '5px 0' }}>
                ${carga.precioFinal?.toLocaleString() || carga.precioBase?.toLocaleString()} COP
              </p>
              <p style={{ fontSize: '12px', color: '#666' }}>
                {new Date(carga.fechaHora).toLocaleDateString()}
              </p>
              
              <p style={{ 
                fontSize: '13px', 
                fontWeight: 'bold', 
                marginBottom: '10px',
                color: carga.estado === 'ENTREGADA' ? '#2e7d32' : (carga.pagado ? '#FF8C00' : '#d32f2f') 
              }}>
                {carga.pagado ? 'Pagada ' : ''}
                {carga.estado === 'PENDIENTE' ? '⏳ Esperando transportador' : 
                 carga.estado === 'ACEPTADA' ? '🤝 Aceptada por transportador' : 
                 carga.estado === 'EN_RUTA' ? '🚚 En Ruta' : '✅ Entregado'}
              </p>

              {/* Botón para pagar solo si está aceptada y no se ha pagado */}
              {carga.estado === 'ACEPTADA' && !carga.pagado && (
                <button 
                  className="btn-login" 
                  style={{ padding: '8px', fontSize: '13px', marginBottom: '5px' }}
                  onClick={() => onIrAPagar(carga)}
                >
                  💳 Pagar Ahora
                </button>
              )}

              {/* Botón para ver el mapa (siempre visible) */}
              <button 
                className="btn-volver" 
                style={{ padding: '6px', fontSize: '12px' }}
                onClick={() => onVerMapa(carga)}
              >
                📍 Ver Seguimiento
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

export default Historial;