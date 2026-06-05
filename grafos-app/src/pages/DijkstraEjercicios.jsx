import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dijkstra.css';
import logoUV from '../assets/Logo_de_la_Universidad_Veracruzana.png';
import logoFIEE from '../assets/LogoFIEE.png';
import imgDijkstra from '../assets/dijkstra.png';

// ¡IMPORTANTE! 
// Ajusta las letras (inicio/fin) y las respuestas de estos 5 ejercicios
// para que coincidan matemáticamente con la imagen real de dijkstra.png
const EJERCICIOS = [
  { id: 1, inicio: 'u', fin: 'z', respuestaCorrecta: "6", pista: "Comienza sumando los vecinos más pequeños de u." },
  { id: 2, inicio: 'v', fin: 'y', respuestaCorrecta: "4", pista: "Recuerda que no siempre pasar por menos nodos significa menos peso." },
  { id: 3, inicio: 'x', fin: 'w', respuestaCorrecta: "3", pista: "Observa bien si hay una conexión directa que sea más barata que dar la vuelta." },
  { id: 4, inicio: 'u', fin: 'w', respuestaCorrecta: "5", pista: "Este camino tiene una trampa, calcula la suma de al menos 3 rutas alternativas." },
  { id: 5, inicio: 'v', fin: 'z', respuestaCorrecta: "5", pista: "Último ejercicio, aplica el algoritmo completo paso a paso." }
];

export default function DijkstraEjercicios() {
  const navigate = useNavigate();
  const [ejercicioActual, setEjercicioActual] = useState(0);
  const [respuestaUsuario, setRespuestaUsuario] = useState('');
  const [estado, setEstado] = useState('pendiente'); // 'pendiente', 'correcto', 'incorrecto'

  const ejercicio = EJERCICIOS[ejercicioActual];

  const verificarRespuesta = () => {
    if (respuestaUsuario.trim() === ejercicio.respuestaCorrecta) {
      setEstado('correcto');
    } else {
      setEstado('incorrecto');
    }
  };

  const siguienteEjercicio = () => {
    if (ejercicioActual < EJERCICIOS.length - 1) {
      setEjercicioActual(ejercicioActual + 1);
      setRespuestaUsuario('');
      setEstado('pendiente');
    } else {
      setEstado('finalizado');
    }
  };

  return (
    <div className="dijkstra-page">
      <div className="bubble bubble-3" style={{ background: 'radial-gradient(circle, #D97706, transparent)' }} />
      <header className="page-header">
        <div className="logos">
          <img src={logoUV} alt="UV" className="logo-img" />
          <div className="logo-divider" />
          <img src={logoFIEE} alt="FIEE" className="logo-img" />
        </div>
        <button className="back-btn" onClick={() => navigate('/dijkstra')}>← Regresar al Menú</button>
      </header>

      <main className="dijkstra-content animate-pop">
        <div className="title-section">
          <span className="emoji-title">✍️</span>
          <h1>Ejercicios <span className="gradient-dijkstra">Prácticos</span></h1>
          <p>Nivel {ejercicioActual + 1} de {EJERCICIOS.length}</p>
        </div>

        {estado === 'finalizado' ? (
          <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.05)', padding: '3rem', borderRadius: '15px', maxWidth: '600px', margin: '0 auto' }}>
            <span style={{ fontSize: '4rem' }}>🏆</span>
            <h2 style={{ color: '#F59E0B', margin: '1rem 0' }}>¡Felicidades!</h2>
            <p style={{ color: 'white', marginBottom: '2rem' }}>Has completado los 5 ejercicios prácticos con éxito.</p>
            <button className="btn-calc" onClick={() => navigate('/dijkstra')}>Volver al Menú</button>
          </div>
        ) : (
          <div className="interactive-section">
            {/* Panel de la imagen (Izquierda) */}
            <div className="graph-panel">
              <h3 style={{ color: '#F59E0B' }}>Problema {ejercicio.id}</h3>
              <p style={{ color: '#ccc', marginBottom: '1rem', fontSize: '1.1rem' }}>
                Basándote en el grafo, ¿Cuál es el costo de la ruta más corta desde el nodo <strong style={{ color: 'white', fontSize: '1.2rem' }}>{ejercicio.inicio}</strong> hasta el nodo <strong style={{ color: 'white', fontSize: '1.2rem' }}>{ejercicio.fin}</strong>?
              </p>
              <div style={{ background: 'white', padding: '1rem', borderRadius: '12px' }}>
                <img src={imgDijkstra} alt="Ejercicio Dijkstra" style={{ width: '100%', borderRadius: '8px' }} />
              </div>
            </div>

            {/* Panel de respuesta (Derecha) */}
            <div className="controls-panel" style={{ justifyContent: 'center' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '15px', textAlign: 'center', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <h3 style={{ color: 'white', marginBottom: '1.5rem' }}>Tu Respuesta</h3>
                
                <input 
                  type="number" 
                  value={respuestaUsuario}
                  onChange={(e) => {
                    setRespuestaUsuario(e.target.value);
                    setEstado('pendiente'); // Limpia el error al volver a escribir
                  }}
                  disabled={estado === 'correcto'}
                  placeholder="Ej. 12"
                  style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: 'none', marginBottom: '1rem', fontSize: '1.5rem', textAlign: 'center', background: 'rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}
                />
                
                {estado === 'pendiente' && (
                  <button className="btn-calc" onClick={verificarRespuesta} style={{ width: '100%' }}>Verificar Distancia</button>
                )}

                {estado === 'incorrecto' && (
                  <div className="animate-pop">
                    <p style={{ color: '#EF4444', fontWeight: 'bold', marginBottom: '1rem' }}>Incorrecto. Revisa tus sumas.</p>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', fontStyle: 'italic' }}>💡 Pista: {ejercicio.pista}</p>
                    <button className="btn-calc" onClick={verificarRespuesta} style={{ width: '100%', marginTop: '1rem' }}>Volver a intentar</button>
                  </div>
                )}

                {estado === 'correcto' && (
                  <div className="animate-pop">
                    <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', borderRadius: '8px', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                      ¡Excelente! Respuesta correcta.
                    </div>
                    <button className="btn-calc" onClick={siguienteEjercicio} style={{ width: '100%', background: '#10B981', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}>
                      {ejercicioActual === 4 ? "Finalizar Ejercicios" : "Siguiente Ejercicio →"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
