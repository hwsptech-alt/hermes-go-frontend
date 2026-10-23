import './App.css';

function HomeTransportador({ usuario, onCerrarSesion, onVerPerfil, onVerCargas, onVerMisViajes }) {
  return (
    <div className="container">
      <div className="home-header">
        <h2>Hola, {usuario.nombreCompleto.split(' ')[0]} 🚚</h2>
        <p>Panel de Transportador</p>
      </div>

      <div className="home-menu">
        <button className="menu-card" onClick={onVerCargas}>
          <span className="menu-icon">📋</span>
          <span>Ver Cargas Disponibles</span>
        </button>
        
        <button className="menu-card" onClick={onVerMisViajes}>
          <span className="menu-icon">🚛</span>
          <span>Mis Viajes</span>
        </button>

        <button className="menu-card" onClick={() => alert('Módulo de Ganancias: Aquí verás el total de tus fletes cobrados.')}>
          <span className="menu-icon">💰</span>
          <span>Mis Ganancias</span>
        </button>
        
        <button className="menu-card" onClick={() => alert('Módulo de Calificaciones: Aquí verás las estrellas que te dan los clientes.')}>
          <span className="menu-icon">⭐</span>
          <span>Mis Calificaciones</span>
        </button>
        
        <button className="menu-card" onClick={onVerPerfil}>
          <span className="menu-icon">👤</span>
          <span>Mi Perfil</span>
        </button>
      </div>

      <button className="btn-cerrar-sesion" onClick={onCerrarSesion}>
        Cerrar Sesión
      </button>
    </div>
  );
}

export default HomeTransportador;