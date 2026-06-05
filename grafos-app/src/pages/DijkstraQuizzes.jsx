import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dijkstra.css'; 
import logoUV from '../assets/Logo_de_la_Universidad_Veracruzana.png';
import logoFIEE from '../assets/LogoFIEE.png';

// Banco de 20 preguntas
const PREGUNTAS = [
  { p: "¿Qué problema principal resuelve el algoritmo de Dijkstra?", o: ["Árbol de expansión mínima", "Camino más corto", "Flujo máximo", "Ciclos eulerianos"], c: 1 },
  { p: "¿El algoritmo funciona correctamente si existen aristas con pesos negativos?", o: ["Sí, siempre", "Solo en grafos dirigidos", "No, puede fallar", "Sí, si se usa una cola de prioridad"], c: 2 },
  { p: "¿Quién es el creador de este algoritmo?", o: ["Alan Turing", "John von Neumann", "Edsger W. Dijkstra", "Leonhard Euler"], c: 2 },
  { p: "¿En qué técnica de diseño de algoritmos se basa Dijkstra?", o: ["Programación Dinámica", "Divide y Vencerás", "Backtracking", "Algoritmos Voraces (Greedy)"], c: 3 },
  { p: "¿Qué estructura de datos es la más eficiente para implementar Dijkstra?", o: ["Pila (Stack)", "Cola de Prioridad (Min-Heap)", "Lista Enlazada", "Árbol Binario de Búsqueda"], c: 1 },
  { p: "¿Cuál es el valor inicial de la distancia desde el nodo de inicio hacia sí mismo?", o: ["1", "Infinito", "0", "-1"], c: 2 },
  { p: "¿Cuál es el valor inicial de las distancias hacia el resto de los nodos?", o: ["0", "1", "Infinito", "Desconocido"], c: 2 },
  { p: "¿Qué significa que el algoritmo 'relaje' (relax) una arista?", o: ["Que la borra del grafo", "Que encuentra un camino más corto y actualiza la distancia", "Que ignora su peso", "Que le suma 1 al peso"], c: 1 },
  { p: "¿El algoritmo de Dijkstra se puede usar en grafos dirigidos?", o: ["No, solo no dirigidos", "Sí, funciona en ambos", "Solo si no tienen ciclos", "Solo si es un árbol"], c: 1 },
  { p: "¿Qué sucede si el nodo destino tiene una distancia final de Infinito?", o: ["El algoritmo falló", "Hay un error en el grafo", "El nodo es inalcanzable desde el origen", "Tiene peso negativo"], c: 2 },
  { p: "Si todos los pesos de las aristas son iguales a 1, ¿A qué algoritmo equivale Dijkstra?", o: ["Búsqueda en Profundidad (DFS)", "Búsqueda en Anchura (BFS)", "Kruskal", "Prim"], c: 1 },
  { p: "¿Dijkstra evalúa todas las rutas posibles exhaustivamente?", o: ["Sí", "No, explora inteligentemente guiado por el menor peso", "Solo si el grafo es pequeño", "Depende del nodo final"], c: 1 },
  { p: "¿Qué protocolo de enrutamiento de Internet utiliza Dijkstra?", o: ["BGP", "RIP", "OSPF", "HTTP"], c: 2 },
  { p: "¿Puede Dijkstra detectar si hay ciclos de peso negativo?", o: ["Sí", "No, para eso se usa Bellman-Ford", "Solo si se usa con arreglos", "Depende del tamaño del ciclo"], c: 1 },
  { p: "Una vez que Dijkstra marca un nodo como 'visitado', su distancia es...", o: ["Temporal", "Definitiva y óptima", "Aún puede cambiar", "Cero"], c: 1 },
  { p: "En la vida real, los 'pesos' en un mapa para Dijkstra representarían...", o: ["El color de la carretera", "La distancia, tiempo o costo", "La cantidad de curvas", "El nombre de la calle"], c: 1 },
  { p: "¿Qué complejidad temporal tiene Dijkstra implementado con un Min-Heap?", o: ["O(V^2)", "O(E log V)", "O(V!)", "O(E + V)"], c: 1 },
  { p: "¿Dijkstra usa heurísticas (pistas) para apuntar directamente hacia el destino?", o: ["Sí", "No, se expande en todas direcciones según el peso. (Ese es el algoritmo A*)", "A veces", "Solo en videojuegos"], c: 1 },
  { p: "¿Qué información guarda el arreglo/objeto de 'previos' en el código?", o: ["La distancia total", "El nodo por el que llegamos para reconstruir la ruta", "Los nodos que faltan por visitar", "El peso de la arista"], c: 1 },
  { p: "Si se quiere encontrar la ruta más corta a TODOS los nodos, ¿cuándo debe detenerse Dijkstra?", o: ["Cuando visita el primer vecino", "Cuando la cola de prioridad quede vacía", "Cuando visita 5 nodos", "Al encontrar el primer ciclo"], c: 1 }
];

const PREGUNTAS_POR_GRUPO = 5;
const TOTAL_GRUPOS = Math.ceil(PREGUNTAS.length / PREGUNTAS_POR_GRUPO);

export default function DijkstraQuizzes() {
  const navigate = useNavigate();
  const [grupoActual, setGrupoActual] = useState(0);
  const [respuestasUsuario, setRespuestasUsuario] = useState({}); // { indexPregunta: indexOpcion }
  const [mostrarResultados, setMostrarResultados] = useState(false);

  // Obtener las preguntas del grupo actual (de 5 en 5)
  const inicioIndex = grupoActual * PREGUNTAS_POR_GRUPO;
  const preguntasVisibles = PREGUNTAS.slice(inicioIndex, inicioIndex + PREGUNTAS_POR_GRUPO);

  const seleccionarRespuesta = (indexGlobal, indexOpcion) => {
    setRespuestasUsuario({ ...respuestasUsuario, [indexGlobal]: indexOpcion });
  };

  const calcularPuntaje = () => {
    let puntos = 0;
    PREGUNTAS.forEach((preg, i) => {
      if (respuestasUsuario[i] === preg.c) puntos++;
    });
    return puntos;
  };

  const avanzar = () => {
    if (grupoActual < TOTAL_GRUPOS - 1) {
      setGrupoActual(grupoActual + 1);
      window.scrollTo(0, 0); // Regresa el scroll arriba
    } else {
      setMostrarResultados(true);
    }
  };

  // Validar si respondió las 5 preguntas de esta página
  const grupoCompletado = preguntasVisibles.every((_, i) => respuestasUsuario[inicioIndex + i] !== undefined);

  return (
    <div className="dijkstra-page">
      <div className="bubble bubble-2" style={{ background: 'radial-gradient(circle, #F59E0B, transparent)' }} />
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
          <span className="emoji-title">📝</span>
          <h1>Quizzes de <span className="gradient-dijkstra">Dijkstra</span></h1>
          <p>Bloque {grupoActual + 1} de {TOTAL_GRUPOS}</p>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '2rem' }}>
          {mostrarResultados ? (
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '3rem', borderRadius: '15px', textAlign: 'center' }}>
              <h2 style={{ color: '#F59E0B', fontSize: '2.5rem', marginBottom: '1rem' }}>¡Test Finalizado!</h2>
              <p style={{ fontSize: '1.5rem', color: 'white', marginBottom: '2rem' }}>
                Acertaste <strong>{calcularPuntaje()}</strong> de {PREGUNTAS.length} preguntas.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <button onClick={() => { setGrupoActual(0); setRespuestasUsuario({}); setMostrarResultados(false); }} className="btn-calc" style={{ background: 'transparent', border: '2px solid #F59E0B' }}>
                  Reintentar
                </button>
                <button onClick={() => navigate('/dijkstra')} className="btn-calc">
                  Volver al Menú
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {preguntasVisibles.map((pregunta, indexLocal) => {
                  const indexGlobal = inicioIndex + indexLocal;
                  return (
                    <div key={indexGlobal} style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px' }}>
                      <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.1rem' }}>
                        {indexGlobal + 1}. {pregunta.p}
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                        {pregunta.o.map((opcion, indexOpcion) => {
                          const estaSeleccionada = respuestasUsuario[indexGlobal] === indexOpcion;
                          return (
                            <button 
                              key={indexOpcion} 
                              onClick={() => seleccionarRespuesta(indexGlobal, indexOpcion)}
                              style={{ 
                                background: estaSeleccionada ? '#F59E0B' : 'rgba(255,255,255,0.1)', 
                                border: `1px solid ${estaSeleccionada ? '#F59E0B' : 'rgba(255,255,255,0.2)'}`, 
                                padding: '0.8rem', color: estaSeleccionada ? '#1a1545' : 'white', 
                                borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: estaSeleccionada ? 'bold' : 'normal'
                              }}>
                              {opcion}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button 
                  className="btn-calc" 
                  onClick={avanzar} 
                  disabled={!grupoCompletado}
                  style={{ opacity: grupoCompletado ? 1 : 0.5, cursor: grupoCompletado ? 'pointer' : 'not-allowed' }}>
                  {grupoActual < TOTAL_GRUPOS - 1 ? "Siguiente Bloque →" : "Ver Resultados"}
                </button>
                {!grupoCompletado && <p style={{ color: '#EF4444', marginTop: '1rem', fontSize: '0.9rem' }}>Responde todas las preguntas para avanzar.</p>}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
