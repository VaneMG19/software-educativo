import { useNavigate } from 'react-router-dom';
import '../styles/Dijkstra.css'; // Reutilizamos tu fondo
import logoUV from '../assets/Logo_de_la_Universidad_Veracruzana.png';
import logoFIEE from '../assets/LogoFIEE.png';

export default function DijkstraTeoria() {
  const navigate = useNavigate();

  return (
    <div className="dijkstra-page">
      <div className="bubble bubble-2" style={{ background: 'radial-gradient(circle, #F59E0B, transparent)' }} />
      <div className="bubble bubble-3" style={{ background: 'radial-gradient(circle, #0D9488, transparent)' }} />

      <header className="page-header">
        <div className="logos">
          <img src={logoUV} alt="UV" className="logo-img" />
          <div className="logo-divider" />
          <img src={logoFIEE} alt="FIEE" className="logo-img" />
        </div>
        <button className="back-btn" onClick={() => navigate('/dijkstra')}>
          ← Regresar al Menú
        </button>
      </header>

      <main className="dijkstra-content animate-pop">
        <div className="title-section">
          <span className="emoji-title">📖</span>
          <h1>Teoría de <span className="gradient-dijkstra">Dijkstra</span></h1>
          <p>Conoce los fundamentos matemáticos detrás de las rutas óptimas.</p>
        </div>

        <div className="theory-container" style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '15px', backdropFilter: 'blur(10px)' }}>
          <h2 style={{ color: '#F59E0B', marginBottom: '1rem' }}>¿Qué es?</h2>
          <p style={{ lineHeight: '1.6', marginBottom: '1.5rem', color: '#ccc' }}>
            El algoritmo de Dijkstra, concebido por el científico de la computación Edsger W. Dijkstra en 1956, 
            es un algoritmo para la determinación del camino más corto, dado un vértice origen, hacia el resto de los vértices en un grafo con pesos en cada arista.
          </p>

          <h2 style={{ color: '#F59E0B', marginBottom: '1rem' }}>Características Principales</h2>
          <ul style={{ lineHeight: '1.6', marginBottom: '1.5rem', color: '#ccc', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}><strong>Pesos Positivos:</strong> Dijkstra asume que el costo de viajar entre nodos nunca es negativo. Si hay pesos negativos, el algoritmo puede fallar.</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Estructura de Datos:</strong> Para ser eficiente, suele utilizarse una "Cola de Prioridad" (Min-Heap) para encontrar siempre el nodo más cercano rápidamente.</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Voraz (Greedy):</strong> En cada paso, toma la decisión óptima local (el vecino más cercano) asumiendo que lo llevará a la solución óptima global.</li>
          </ul>

          <h2 style={{ color: '#F59E0B', marginBottom: '1rem' }}>Aplicaciones Reales</h2>
          <p style={{ lineHeight: '1.6', color: '#ccc' }}>
            Se utiliza en el enrutamiento de paquetes en redes (como el protocolo OSPF de internet), en sistemas de navegación GPS (Google Maps) y en inteligencia artificial para el movimiento de personajes en videojuegos.
          </p>
        </div>
      </main>
    </div>
  );
}
