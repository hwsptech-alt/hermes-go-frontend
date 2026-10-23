import './App.css';

function Home({ usuario, onCerrarSesion, onVerPerfil, onPublicarCarga, onVerHistorial }) {
  return (
    <div className="container">
      <div className="home-header">
        <h2>Hola, {usuario.nombreCompleto.split(' ')[0]} 👋</h2>
        <p>¿Qué deseas hacer hoy?</p>
      </div>

      <div className="home-menu">
        <button className="menu-card" onClick={onPublicarCarga}>
          <span className="menu-icon">📦</span>
          <span>Publicar Carga</span>
        </button>
        <button className="menu-card">
          <span className="menu-icon">🚚</span>
          <span>Buscar Transporte</span>
        </button>
        <button className="menu-card">
          <span className="menu-icon">📍</span>
          <span>Seguimiento</span>
        </button>
        <button className="menu-card" onClick={onVerHistorial}>
          <span className="menu-icon">📜</span>
          <span>Historial</span>
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

export default Home;