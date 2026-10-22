import { useState } from 'react';
import axios from 'axios';
import './App.css';

function PublicarCarga({ usuario, onVolver }) {
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [fechaHora, setFechaHora] = useState('');
  const [tipoCarga, setTipoCarga] = useState('');
  const [peso, setPeso] = useState('');
  const [volumen, setVolumen] = useState('');
  const [esPerecedera, setEsPerecedera] = useState(false);
  const [esCompartida, setEsCompartida] = useState(false);
  const [descripcion, setDescripcion] = useState('');
  const [precioBase, setPrecioBase] = useState('');
  
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    // Validaciones lógicas
    if (parseFloat(peso) <= 0) return setError('El peso debe ser mayor a 0.');
    if (parseFloat(volumen) <= 0) return setError('El volumen debe ser mayor a 0.');
    if (parseFloat(precioBase) <= 0) return setError('El precio base debe ser mayor a 0.');
    if (!fechaHora) return setError('Debes seleccionar una fecha y hora.');
    if (!tipoCarga) return setError('Debes seleccionar un tipo de carga.');

    setCargando(true);

    const url = esCompartida
      ? 'http://localhost:8080/api/cargas/publicar-compartida'
      : 'http://localhost:8080/api/cargas/publicar';

    try {
      const response = await axios.post(url, {
        origen,
        destino,
        fechaHora,
        tipoCarga,
        peso: parseFloat(peso),
        volumen: parseFloat(volumen),
        esPerecedera,
        esCompartida,
        descripcion,
        clienteId: usuario.id,
        precioBase: parseFloat(precioBase)
      });

      if (response.data) {
        setMensaje(`¡Carga publicada! Precio final: $${response.data.precioFinal || response.data.precioBase}`);
        setTimeout(() => onVolver(), 2000);
      }
    } catch (error) {
      setError(error.response?.data || 'Error al publicar la carga. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container">
      <div className="form-card">
        <h2>Publicar Carga</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Datos de la Carga</h3>
            <div className="input-row">
              <div className="input-group">
                <label>Origen *</label>
                <input type="text" value={origen} onChange={(e) => setOrigen(e.target.value)} placeholder="Ciudad de origen" required />
              </div>
              <div className="input-group">
                <label>Destino *</label>
                <input type="text" value={destino} onChange={(e) => setDestino(e.target.value)} placeholder="Ciudad de destino" required />
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Fecha y Hora *</label>
                <input type="datetime-local" value={fechaHora} onChange={(e) => setFechaHora(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Tipo de Carga *</label>
                <select 
                  value={tipoCarga} 
                  onChange={(e) => setTipoCarga(e.target.value)} 
                  required
                >
                  <option value="">Selecciona...</option>
                  <option value="Perecederos">🍎 Perecederos (Alimentos)</option>
                  <option value="Electrodomesticos">🔌 Electrodomésticos</option>
                  <option value="Materiales">🧱 Materiales de Construcción</option>
                  <option value="Textiles">👕 Textiles</option>
                  <option value="Vehiculos">🚗 Vehículos / Repuestos</option>
                  <option value="Carga General">📦 Carga General</option>
                </select>
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Peso (kg) *</label>
                <input type="number" value={peso} onChange={(e) => setPeso(e.target.value)} placeholder="Ej: 500" required />
              </div>
              <div className="input-group">
                <label>Volumen (m³) *</label>
                <input type="number" value={volumen} onChange={(e) => setVolumen(e.target.value)} placeholder="Ej: 2.5" required />
              </div>
            </div>

            <div className="input-group">
              <label>Descripción (Opcional)</label>
              <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Detalles de la carga" />
            </div>

            <div className="input-group">
              <label>Precio Base del Flete ($) *</label>
              <input type="number" value={precioBase} onChange={(e) => setPrecioBase(e.target.value)} placeholder="Ej: 1000000" required />
            </div>
          </div>

          <div className="form-section">
            <h3>Condiciones del Envío</h3>
            
            <div className="switch-group">
              <span>¿La carga es perecedera?</span>
              <label className="switch">
                <input type="checkbox" checked={esPerecedera} onChange={(e) => setEsPerecedera(e.target.checked)} />
                <span className="slider"></span>
              </label>
              <span className="switch-label">{esPerecedera ? 'Sí' : 'No'}</span>
            </div>

            <div className="switch-group" style={{ marginTop: '10px' }}>
              <span>¿Permite Carga Compartida?</span>
              <label className="switch">
                <input type="checkbox" checked={esCompartida} onChange={(e) => setEsCompartida(e.target.checked)} />
                <span className="slider"></span>
              </label>
              <span className="switch-label">{esCompartida ? 'Sí' : 'No'}</span>
            </div>
          </div>

          {error && <p className="mensaje" style={{ color: '#d32f2f', marginBottom: '10px' }}>{error}</p>}
          {mensaje && <p className="mensaje" style={{ color: '#2e7d32', marginBottom: '10px' }}>{mensaje}</p>}

          <div className="button-group">
            <button type="submit" className="btn-login" disabled={cargando}>
              {cargando ? 'Publicando...' : 'Confirmar Publicación'}
            </button>
            <button type="button" className="btn-volver" onClick={onVolver} disabled={cargando}>
              ← Regresar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PublicarCarga;