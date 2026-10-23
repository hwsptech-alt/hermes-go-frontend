import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function MisViajes({ usuario, onVolver, onVerMapa, onLlegadaDestino }) {
  const [cargas, setCargas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarViajes = async () => {
    try {
      // Traemos las cargas del transportador (filtramos en frontend por su ID)
      const todas = await axios.get('http://localhost:8080/api/cargas/historial/1'); 
      const misCargas = todas.data.filter(c => c.transportador && c.transportador.id === usuario.id);
      setCargas(misCargas);
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarViajes();
  }, []);

  return (
    <div className="container">
      <div className="form-card">
        <h2>Mis Viajes</h2>
        
        {cargando && <p>Cargando viajes...</p>}
        {!cargando && cargas.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666' }}>No tienes viajes asignados aún.</p>
        )}

        <div className="lista-cargas">
          {cargas.map((carga) => (
            <div key={carga.id} className="carga-card" style={{ textAlign: 'center' }}>
              <strong>{carga.origen} ➔ {carga.destino}</strong>
              <p style={{ color: '#FF8C00', fontWeight: 'bold' }}>${carga.precioFinal?.toLocaleString()} COP</p>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: carga.estado === 'ENTREGADA' ? 'green' : 'orange' }}>
                Estado: {carga.estado}
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px' }}>
                <button 
                  className="btn-volver" 
                  style={{ padding: '6px', fontSize: '12px' }}
                  onClick={() => onVerMapa(carga)}
                >
                  🗺️ Ver Mapa
                </button>

                {carga.estado !== 'ENTREGADA' && (
                  <button 
                    className="btn-login" 
                    style={{ padding: '8px', fontSize: '13px' }}
                    onClick={() => onLlegadaDestino(carga)}
                  >
                    📍 He llegado al destino
                  </button>
                )}
              </div>
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

export default MisViajes;