import { useState } from 'react';
import axios from 'axios';
import './App.css';

function Calificacion({ carga, onVolver }) {
  const [estrellas, setEstrellas] = useState(5);
  const [comentario, setComentario] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  const handleCalificar = async () => {
    try {
      await axios.put(`http://localhost:8080/api/cargas/${carga.id}/calificar?calificacion=${estrellas}&comentario=${comentario}`);
      setEnviado(true);
    } catch (error) {
      setError(error.response?.data || 'Error al calificar');
    }
  };

  if (enviado) {
    return (
      <div className="container">
        <div className="form-card">
          <h2 style={{ color: '#2e7d32' }}>¡Gracias por tu calificación!</h2>
          <p style={{ textAlign: 'center' }}>Tu opinión ayuda a mejorar Hermes GO.</p>
          <button className="btn-volver" onClick={onVolver} style={{ marginTop: '20px' }}>Volver al Inicio</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="form-card">
        <h2>¿Cómo fue tu experiencia?</h2>
        <p style={{ textAlign: 'center', marginBottom: '20px' }}>Califica a tu transportador</p>
        
        <div style={{ textAlign: 'center', fontSize: '40px', marginBottom: '20px', cursor: 'pointer' }}>
          {[1, 2, 3, 4, 5].map((num) => (
            <span key={num} onClick={() => setEstrellas(num)}>
              {num <= estrellas ? '⭐' : '☆'}
            </span>
          ))}
        </div>

        <div className="input-group">
          <input 
            type="text" 
            placeholder="Deja un comentario (opcional)" 
            value={comentario} 
            onChange={(e) => setComentario(e.target.value)} 
          />
        </div>

        {error && <p className="mensaje" style={{ color: '#d32f2f', marginBottom: '10px' }}>{error}</p>}

        <div className="button-group">
          <button className="btn-login" onClick={handleCalificar}>Aceptar Calificación</button>
          <button className="btn-volver" onClick={onVolver}>Omitir</button>
        </div>
      </div>
    </div>
  );
}

export default Calificacion;