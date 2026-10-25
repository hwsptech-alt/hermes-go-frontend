import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function PublicarCarga({ usuario, onVolver, onConfirmarServicio }) {
  const [departamentos, setDepartamentos] = useState([]);
  const [ciudadesOrigen, setCiudadesOrigen] = useState([]);
  const [ciudadesDestino, setCiudadesDestino] = useState([]);

  const [departamentoOrigen, setDepartamentoOrigen] = useState('');
  const [ciudadOrigen, setCiudadOrigen] = useState('');
  const [departamentoDestino, setDepartamentoDestino] = useState('');
  const [ciudadDestino, setCiudadDestino] = useState('');
  
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

  const obtenerFechaMinima = () => {
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    manana.setMinutes(manana.getMinutes() - manana.getTimezoneOffset());
    return manana.toISOString().slice(0, 16);
  };

  useEffect(() => {
    axios.get('https://api-colombia.com/api/v1/Department')
      .then(res => {
        const deps = res.data.filter(d => d.name !== 'Archipiélago de San Andrés, Providencia y Santa Catalina');
        setDepartamentos(deps);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!departamentoOrigen) { setCiudadesOrigen([]); return; }
    axios.get(`https://api-colombia.com/api/v1/Department/${departamentoOrigen}/cities`)
      .then(res => setCiudadesOrigen(res.data))
      .catch(err => console.error(err));
  }, [departamentoOrigen]);

  useEffect(() => {
    if (!departamentoDestino) { setCiudadesDestino([]); return; }
    axios.get(`https://api-colombia.com/api/v1/Department/${departamentoDestino}/cities`)
      .then(res => setCiudadesDestino(res.data))
      .catch(err => console.error(err));
  }, [departamentoDestino]);

  useEffect(() => {
    if (!ciudadOrigen || !ciudadDestino) { setDistancia(0); return; }
    const ruta = `${String(ciudadOrigen).toLowerCase()}-${String(ciudadDestino).toLowerCase()}`;
    if (ruta.includes('bogota') && ruta.includes('medellin')) setDistancia(440);
    else if (ruta.includes('bogota') && ruta.includes('cali')) setDistancia(460);
    else if (ruta.includes('bogota') && ruta.includes('neiva')) setDistancia(300);
    else setDistancia(150);
  }, [ciudadOrigen, ciudadDestino]);

  const calcularPrecioBase = () => {
    const pesoNum = parseFloat(peso) || 0;
    const volumenNum = parseFloat(volumen) || 0;
    if (pesoNum === 0 && volumenNum === 0) return 0;
    return (distancia * 1500) + (pesoNum * 200) + (volumenNum * 5000);
  };

  const precioCalculado = calcularPrecioBase();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!ciudadOrigen || !ciudadDestino) return setError('Debes seleccionar las ciudades.');
    if (!direccionOrigen || !direccionDestino) return setError('Debes ingresar las direcciones exactas.');
    if (parseFloat(peso) <= 0) return setError('El peso debe ser mayor a 0.');
    if (parseFloat(volumen) <= 0) return setError('El volumen debe ser mayor a 0.');
    if (!fechaHora) return setError('Debes seleccionar una fecha y hora.');
    if (!tipoCarga) return setError('Debes seleccionar un tipo de carga.');

    const fechaMinima = new Date();
    fechaMinima.setDate(fechaMinima.getDate() + 1);
    if (new Date(fechaHora) < fechaMinima) return setError('La carga debe ser programada con al menos 24 horas de anticipación.');

    setCargando(true);
    const url = esCompartida
      ? 'http://localhost:8080/api/cargas/publicar-compartida'
      : 'http://localhost:8080/api/cargas/publicar';

    try {
      const response = await axios.post(url, {
        origen: String(ciudadOrigen),
        destino: String(ciudadDestino),
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
        setMensaje(`¡Carga publicada! Precio final: $${Number(response.data.precioFinal || response.data.precioBase).toLocaleString()}`);
        setTimeout(() => onConfirmarServicio(response.data), 1500);
      }
    } catch (error) {
      const mensajeError = error.response?.data?.message || error.response?.data || 'Error al publicar la carga.';
      setError(String(mensajeError));
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
            
            {/* --- SECCIÓN DE RECOGIDA --- */}
            <div style={{ marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '15px' }}>
              <h4 style={{ fontSize: '13px', color: '#FF8C00', marginBottom: '10px', fontWeight: 'bold' }}>📍 ORIGEN (RECOGIDA)</h4>
              <div className="input-row">
                <div className="input-group">
                  <label>Departamento *</label>
                  <select value={departamentoOrigen} onChange={(e) => setDepartamentoOrigen(e.target.value)} required>
                    <option value="">Selecciona...</option>
                    {departamentos.map(dep => (
                      <option key={dep.id} value={dep.id}>{String(dep.name)}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>Ciudad *</label>
                  <select value={ciudadOrigen} onChange={(e) => setCiudadOrigen(e.target.value)} required>
                    <option value="">Selecciona...</option>
                    {ciudadesOrigen.map(ciudad => (
                      <option key={ciudad.id} value={ciudad.name}>{String(ciudad.name)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label>Dirección Exacta *</label>
                <input type="text" value={direccionOrigen} onChange={(e) => setDireccionOrigen(e.target.value)} placeholder="Calle 100 #15-20" required />
              </div>
            </div>

            {/* --- SECCIÓN DE DESTINO --- */}
            <div style={{ marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '15px' }}>
              <h4 style={{ fontSize: '13px', color: '#FF8C00', marginBottom: '10px', fontWeight: 'bold' }}>🎯 DESTINO (ENTREGA)</h4>
              <div className="input-row">
                <div className="input-group">
                  <label>Departamento *</label>
                  <select value={departamentoDestino} onChange={(e) => setDepartamentoDestino(e.target.value)} required>
                    <option value="">Selecciona...</option>
                    {departamentos.map(dep => (
                      <option key={dep.id} value={dep.id}>{String(dep.name)}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>Ciudad *</label>
                  <select value={ciudadDestino} onChange={(e) => setCiudadDestino(e.target.value)} required>
                    <option value="">Selecciona...</option>
                    {ciudadesDestino.map(ciudad => (
                      <option key={ciudad.id} value={ciudad.name}>{String(ciudad.name)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label>Dirección Exacta *</label>
                <input type="text" value={direccionDestino} onChange={(e) => setDireccionDestino(e.target.value)} placeholder="Carrera 45 #10-05" required />
              </div>
            </div>

            {/* DISTANCIA Y DATOS DE CARGA */}
            <div className="input-group">
              <label>Distancia Estimada</label>
              <div className="distancia-calculada">
                {distancia > 0 ? `${distancia} km` : 'Esperando ruta...'}
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Fecha y Hora *</label>
                <input type="datetime-local" value={fechaHora} onChange={(e) => setFechaHora(e.target.value)} min={obtenerFechaMinima()} required />
              </div>
              <div className="input-group">
                <label>Tipo de Carga *</label>
                <select value={tipoCarga} onChange={(e) => setTipoCarga(e.target.value)} required>
                  <option value="">Selecciona...</option>
                  <option value="Perecederos">🍎 Perecederos</option>
                  <option value="Electrodomesticos">🔌 Electrodomésticos</option>
                  <option value="Materiales">🧱 Materiales</option>
                  <option value="Textiles">👕 Textiles</option>
                  <option value="Vehiculos">🚗 Vehículos</option>
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
                {precioCalculado === 0 ? 'Ingresa los datos' : `$${Number(precioCalculado).toLocaleString()} COP`}
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

          {error && <p className="mensaje" style={{ color: '#d32f2f', marginBottom: '10px' }}>{String(error)}</p>}
          {mensaje && <p className="mensaje" style={{ color: '#2e7d32', marginBottom: '10px' }}>{String(mensaje)}</p>}

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