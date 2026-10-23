import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function PublicarCarga({ usuario, onVolver, onConfirmarServicio }) {
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [direccionOrigen, setDireccionOrigen] = useState('');
  const [direccionDestino, setDireccionDestino] = useState('');
  const [fechaHora, setFechaHora] = useState('');
  const [tipoCarga, setTipoCarga] = useState('');
  const [peso, setPeso] = useState('');
  const [volumen, setVolumen] = useState('');
  const [esPerecedera, setEsPerecedera] = useState(false);
  const [esCompartida, setEsCompartida] = useState(false);
  const [descripcion, setDescripcion] = useState('');
  
  const [distancia, setDistancia] = useState(0);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!origen || !destino) {
      setDistancia(0);
      return;
    }
    const ruta = `${origen.toLowerCase().trim()}-${destino.toLowerCase().trim()}`;
    if (ruta.includes('bogota') && ruta.includes('medellin')) setDistancia(440);
    else if (ruta.includes('bogota') && ruta.includes('cali')) setDistancia(460);
    else if (ruta.includes('bogota') && ruta.includes('barranquilla')) setDistancia(1000);
    else if (ruta.includes('bogota') && ruta.includes('cartagena')) setDistancia(1050);
    else if (ruta.includes('medellin') && ruta.includes('cali')) setDistancia(420);
    else if (ruta.includes('medellin') && ruta.includes('cartagena')) setDistancia(640);
    else if (ruta.includes('cali') && ruta.includes('pasto')) setDistancia(260);
    else setDistancia(150); 
  }, [origen, destino]);

  const calcularPrecioBase = () => {
    const pesoNum = parseFloat(peso) || 0;
    const volumenNum = parseFloat(volumen) || 0;
    if (pesoNum === 0 && volumenNum === 0) return 0;
    const tarifaPorKm = 1500;    
    const tarifaPorKg = 200;     
    const tarifaPorVolumen = 5000; 
    return (distancia * tarifaPorKm) + (pesoNum * tarifaPorKg) + (volumenNum * tarifaPorVolumen);
  };

  const precioCalculado = calcularPrecioBase();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!origen || !destino) return setError('Debes ingresar origen y destino.');
    if (!direccionOrigen || !direccionDestino) return setError('Debes ingresar las direcciones exactas.');
    if (parseFloat(peso) <= 0) return setError('El peso debe ser mayor a 0.');
    if (parseFloat(volumen) <= 0) return setError('El volumen debe ser mayor a 0.');
    if (!fechaHora) return setError('Debes seleccionar una fecha y hora.');
    if (new Date(fechaHora) < new Date()) return setError('La fecha y hora no pueden ser anteriores a hoy.');
    if (!tipoCarga) return setError('Debes seleccionar un tipo de carga.');

    setCargando(true);

    const url = esCompartida
      ? 'http://localhost:8080/api/cargas/publicar-compartida'
      : 'http://localhost:8080/api/cargas/publicar';

    try {
      const response = await axios.post(url, {
        origen,
        destino,
        direccionOrigen,
        direccionDestino,
        fechaHora,
        tipoCarga,
        peso: parseFloat(peso),
        volumen: parseFloat(volumen),
        esPerecedera,
        esCompartida,
        descripcion,
        clienteId: usuario.id,
        precioBase: precioCalculado
      });

      if (response.data) {
        setMensaje(`¡Carga publicada! Precio final: $${response.data.precioFinal || response.data.precioBase}`);
        setTimeout(() => onConfirmarServicio(response.data), 1500);
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
                <label>Ciudad Origen *</label>
                <input type="text" value={origen} onChange={(e) => setOrigen(e.target.value)} placeholder="Ej: Bogota" required />
              </div>
              <div className="input-group">
                <label>Ciudad Destino *</label>
                <input type="text" value={destino} onChange={(e) => setDestino(e.target.value)} placeholder="Ej: Medellin" required />
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Dirección de Recogida *</label>
                <input type="text" value={direccionOrigen} onChange={(e) => setDireccionOrigen(e.target.value)} placeholder="Ej: Calle 100 #15-20" required />
              </div>
              <div className="input-group">
                <label>Dirección de Entrega *</label>
                <input type="text" value={direccionDestino} onChange={(e) => setDireccionDestino(e.target.value)} placeholder="Ej: Carrera 45 #10-05" required />
              </div>
            </div>

            <div className="input-group">
              <label>Distancia Estimada</label>
              <div className="distancia-calculada">
                {distancia > 0 ? `${distancia} km` : 'Esperando ruta...'}
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Fecha y Hora *</label>
                <input
                  type="datetime-local"
                  value={fechaHora}
                  onChange={(e) => setFechaHora(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  required
                />
              </div>
              <div className="input-group">
                <label>Tipo de Carga *</label>
                <select value={tipoCarga} onChange={(e) => setTipoCarga(e.target.value)} required>
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
              <label>Precio Base Calculado</label>
              <div className="precio-calculado">
                {precioCalculado === 0 
                  ? 'Ingresa peso, volumen y ruta' 
                  : `$${precioCalculado.toLocaleString()} COP`}
              </div>
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