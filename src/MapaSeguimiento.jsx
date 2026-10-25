import { useState } from 'react';
import './App.css';

function MapaSeguimiento({ carga, onVolver }) {
  const [reporte, setReporte] = useState('');
  const [enviado, setEnviado] = useState(false);

  let progreso = 10;
  let estadoTexto = 'Esperando asignación de transportador';

  if (carga?.estado === 'ACEPTADA') {
    progreso = 33;
    estadoTexto = 'Transportador asignado, esperando recogida';
  } else if (carga?.estado === 'EN_RUTA') {
    progreso = 66;
    estadoTexto = 'Mercancía recogida, en ruta al destino';
  } else if (carga?.estado === 'ENTREGADA') {
    progreso = 100;
    estadoTexto = 'Entrega completada exitosamente';
  }

  const handleReportar = () => {
    if (!reporte) return;
    setTimeout(() => {
      setEnviado(true);
      setReporte('');
      alert('¡Novedad reportada al centro de control!');
    }, 500);
  };

  return (
    <div className="container">
      <div className="form-card">
        <h2>Seguimiento en Tiempo Real</h2>

        {/* MAPA SIMULADO */}
        <div style={{ 
          width: '100%', height: '180px', backgroundColor: '#e0e0e0', borderRadius: '12px', 
          position: 'relative', overflow: 'hidden', marginBottom: '15px', display: 'flex', 
          flexDirection: 'column', justifyContent: 'center', alignItems: 'center', 
          backgroundImage: 'radial-gradient(#bdbdbd 1px, transparent 1px)', backgroundSize: '20px 20px'
        }}>
          <p style={{ fontSize: '12px', color: '#555', fontWeight: 'bold' }}>📍 {carga?.origen} ➔ {carga?.destino}</p>
          
          <div style={{ width: '80%', height: '6px', backgroundColor: '#ccc', borderRadius: '3px', marginTop: '20px', position: 'relative' }}>
            <div style={{ width: `${progreso}%`, height: '100%', backgroundColor: '#FF8C00', borderRadius: '3px', transition: 'width 0.5s' }}></div>
            <div style={{ position: 'absolute', top: '-15px', left: `calc(${progreso}% - 10px)`, fontSize: '20px', transition: 'left 0.5s' }}>
              🚚
            </div>
          </div>
          <p style={{ fontSize: '11px', marginTop: '10px', color: '#FF8C00', fontWeight: 'bold' }}>{estadoTexto}</p>
        </div>

        {/* CÓDIGOS DE RECOGIDA Y ENTREGA */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <div style={{ flex: 1, padding: '10px', backgroundColor: '#fff3e0', border: '2px dashed #FF8C00', borderRadius: '8px', textAlign: 'center' }}>
            <h3 style={{ color: '#FF8C00', margin: 0, fontSize: '14px' }}>Código Recogida</h3>
            <p style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '4px', margin: '5px 0', color: '#333' }}>
              {carga?.codigoRecogida || '****'}
            </p>
            <p style={{ fontSize: '10px', color: '#666' }}>Dáselo al conductor al entregar la mercancía.</p>
          </div>
          
          <div style={{ flex: 1, padding: '10px', backgroundColor: '#fff3e0', border: '2px dashed #FF8C00', borderRadius: '8px', textAlign: 'center' }}>
            <h3 style={{ color: '#FF8C00', margin: 0, fontSize: '14px' }}>Código Entrega</h3>
            <p style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '4px', margin: '5px 0', color: '#333' }}>
              {carga?.codigoEntrega || '****'}
            </p>
            <p style={{ fontSize: '10px', color: '#666' }}>Dáselo al conductor al recibir la mercancía.</p>
          </div>
        </div>

        {/* INFORMACIÓN DEL SERVICIO */}
        <div className="form-section" style={{ marginBottom: '10px', marginTop: '15px' }}>
          <div className="info-item"><span className="info-label">Recoger en:</span><span className="info-valor">{carga?.direccionOrigen || carga?.origen}</span></div>
          <div className="info-item"><span className="info-label">Entregar en:</span><span className="info-valor">{carga?.direccionDestino || carga?.destino}</span></div>
          <div className="info-item"><span className="info-label">Vehículo</span><span className="info-valor">{carga?.transportador?.tipoVehiculo || 'Asignando...'}</span></div>
          <div className="info-item"><span className="info-label">Placa</span><span className="info-valor">{carga?.transportador?.placa || 'N/A'}</span></div>
          <div className="info-item"><span className="info-label">Conductor</span><span className="info-valor">{carga?.transportador?.nombreCompleto || 'Pendiente'}</span></div>
        </div>

        {/* BOTONES DE CONTACTO */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <button className="btn-login" style={{ padding: '8px', fontSize: '13px' }} onClick={() => alert('Llamando al conductor...')}>
            📞 Llamar
          </button>
          <button className="btn-login" style={{ padding: '8px', fontSize: '13px', backgroundColor: '#333' }} onClick={() => alert('Abriendo chat...')}>
            💬 Chat
          </button>
        </div>

        {/* REPORTAR NOVEDAD */}
        <div className="form-section" style={{ backgroundColor: '#fff3e0', padding: '10px', borderRadius: '8px' }}>
          <h3 style={{ borderBottom: 'none', marginBottom: '5px' }}>¿Problemas con el envío?</h3>
          <div style={{ display: 'flex', gap: '5px' }}>
            <input 
              type="text" placeholder="Describe la novedad..." value={reporte}
              onChange={(e) => setReporte(e.target.value)}
              style={{ flex: 1, padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <button className="btn-login" style={{ width: 'auto', padding: '8px 15px' }} onClick={handleReportar}>
              Reportar
            </button>
          </div>
          {enviado && <p style={{ fontSize: '11px', color: 'green', marginTop: '5px' }}>✅ Novedad enviada al centro de control.</p>}
        </div>

        <button className="btn-volver" onClick={onVolver} style={{ marginTop: '20px' }}>
          ← Volver
        </button>
      </div>
    </div>
  );
}