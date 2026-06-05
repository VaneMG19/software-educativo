import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// Agregamos Handle, Position y ConnectionMode a los imports
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Controls,
  Background,
  Handle,
  Position,
  ConnectionMode
} from 'reactflow';
import 'reactflow/dist/style.css';

import '../styles/Dijkstra.css';
import logoUV from '../assets/Logo_de_la_Universidad_Veracruzana.png';
import logoFIEE from '../assets/LogoFIEE.png';
import { calcularDijkstra, obtenerRuta, dijkstraConHistorial } from '../utils/dijkstra/dijkstra.js';

// ─── CREAMOS UN NODO PERSONALIZADO CON 4 PUNTOS DE CONEXIÓN ───
const NodoGrafo = ({ data }) => {
  return (
    <div className="nodo-custom">
      {/* Puntos de anclaje en los 4 lados */}
      <Handle type="source" position={Position.Top} id="top" style={{ background: '#F59E0B' }} />
      <Handle type="source" position={Position.Right} id="right" style={{ background: '#F59E0B' }} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ background: '#F59E0B' }} />
      <Handle type="source" position={Position.Left} id="left" style={{ background: '#F59E0B' }} />
      {data.label}
    </div>
  );
};

// Nodos iniciales más complejos y mejor distribuidos
const nodosIniciales = [
  { id: 'A', type: 'miNodo', position: { x: 50, y: 250 }, data: { label: 'A' } },
  { id: 'B', type: 'miNodo', position: { x: 250, y: 100 }, data: { label: 'B' } },
  { id: 'C', type: 'miNodo', position: { x: 250, y: 400 }, data: { label: 'C' } },
  { id: 'D', type: 'miNodo', position: { x: 450, y: 100 }, data: { label: 'D' } },
  { id: 'E', type: 'miNodo', position: { x: 450, y: 400 }, data: { label: 'E' } },
  { id: 'F', type: 'miNodo', position: { x: 650, y: 250 }, data: { label: 'F' } },
];

// Aristas que conectan usando los 4 puntos (top, right, bottom, left)
const aristasIniciales = [
  { id: 'eA-B', source: 'A', target: 'B', sourceHandle: 'top', targetHandle: 'left', label: '4' },
  { id: 'eA-C', source: 'A', target: 'C', sourceHandle: 'bottom', targetHandle: 'left', label: '2' },
  { id: 'eB-C', source: 'B', target: 'C', sourceHandle: 'bottom', targetHandle: 'top', label: '1' },
  { id: 'eB-D', source: 'B', target: 'D', sourceHandle: 'right', targetHandle: 'left', label: '5' },
  { id: 'eC-E', source: 'C', target: 'E', sourceHandle: 'right', targetHandle: 'left', label: '8' },
  { id: 'eD-E', source: 'D', target: 'E', sourceHandle: 'bottom', targetHandle: 'top', label: '2' },
  { id: 'eD-F', source: 'D', target: 'F', sourceHandle: 'right', targetHandle: 'top', label: '6' },
  { id: 'eE-F', source: 'E', target: 'F', sourceHandle: 'right', targetHandle: 'bottom', label: '3' },
];

export default function Dijkstra() {
  const navigate = useNavigate();

  const [nodes, setNodes] = useState(nodosIniciales);
  const [edges, setEdges] = useState(aristasIniciales);
  const [nodoInicio, setNodoInicio] = useState('A');
  const [nodoDestino, setNodoDestino] = useState('B');
  const [resultado, setResultado] = useState(null);

  // Registramos nuestro nodo personalizado
  const nodeTypes = useMemo(() => ({ miNodo: NodoGrafo }), []);

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);

  const onConnect = useCallback((params) => {
    const peso = window.prompt("Ingresa el peso (distancia) de esta conexión:", "1");
    if (peso !== null && !isNaN(peso) && peso !== "") {
      const nuevaArista = { ...params, label: peso };
      setEdges((eds) => addEdge(nuevaArista, eds));
    }
  }, []);

  const agregarNodo = () => {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nuevoId = letras[nodes.length % 26] + (nodes.length >= 26 ? Math.floor(nodes.length/26) : '');

    const nuevoNodo = {
      id: nuevoId,
      type: 'miNodo', // ¡Le decimos que use nuestro diseño!
      position: { x: Math.random() * 200 + 50, y: Math.random() * 200 + 50 },
      data: { label: nuevoId }
    };
    setNodes((nds) => [...nds, nuevoNodo]);
  };

  const convertirAGrafo = () => {
    const grafoObj = {};
    nodes.forEach(n => grafoObj[n.id] = {});

    edges.forEach(e => {
      const peso = parseFloat(e.label) || 1;
      // Guardamos la arista en ambas direcciones para Dijkstra
      grafoObj[e.source][e.target] = peso;
      grafoObj[e.target][e.source] = peso;
    });

    return grafoObj;
  };

  // Función para pausar la ejecución (como un temporizador)
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const calcularRutaFront = async () => {
    const grafoActual = convertirAGrafo();

    if (!grafoActual[nodoInicio] || !grafoActual[nodoDestino]) {
      alert("Selecciona nodos válidos de la lista.");
      return;
    }

    const resultadoAlgoritmo = dijkstraConHistorial(grafoActual, nodoInicio);
    const historial = resultadoAlgoritmo.historial;
    const ruta = obtenerRuta(resultadoAlgoritmo.previos, nodoDestino);
    const distanciaFinal = resultadoAlgoritmo.distancias[nodoDestino];

    setNodes(nds => nds.map(n => ({ ...n, style: {} })));
    setEdges(eds => eds.map(e => ({ ...e, style: {}, animated: false })));
    setResultado(null);

    // Variable para recordar el árbol de "mejores caminos" encontrados hasta el momento
    let mejoresCaminosConocidos = {};

    for (let paso of historial) {
      if (paso.tipo === 'VISITANDO_NODO') {
        // 1. Iluminamos el nodo actual
        setNodes((nds) => nds.map((n) =>
          n.id === paso.nodo
            ? { ...n, style: { boxShadow: '0 0 20px #3B82F6', border: '3px solid #3B82F6' } }
            : n
        ));

        // 2. Iluminamos el CAMINO MÁS CONVENIENTE hasta este nodo
        setEdges((eds) => eds.map((e) => {
          let esParteDelCamino = false;
          for (let i = 0; i < paso.camino.length - 1; i++) {
            if (
              (e.source === paso.camino[i] && e.target === paso.camino[i + 1]) ||
              (e.source === paso.camino[i + 1] && e.target === paso.camino[i])
            ) {
              esParteDelCamino = true; break;
            }
          }

          if (esParteDelCamino) {
            // El camino que estamos analizando ahora mismo se ilumina en azul vibrante
            return { ...e, animated: true, style: { stroke: '#3B82F6', strokeWidth: 4 } };
          } else {
            // Revisamos si esta arista es parte de otros caminos óptimos ya encontrados
            let esCaminoOptimoConocido = false;
            for (let n in mejoresCaminosConocidos) {
              let previo = mejoresCaminosConocidos[n];
              if (previo && ((e.source === n && e.target === previo) || (e.source === previo && e.target === n))) {
                esCaminoOptimoConocido = true;
              }
            }
            if (esCaminoOptimoConocido) {
               // Caminos óptimos guardados en memoria: verde tenue
               return { ...e, animated: false, style: { stroke: '#10B981', strokeWidth: 2, opacity: 0.4 } };
            }
            // Aristas sin usar: grises
            return { ...e, animated: false, style: { stroke: 'rgba(255,255,255,0.2)', strokeWidth: 2 } };
          }
        }));
        await delay(1200); // Damos 1.2s para que el estudiante vea la ruta actual
      }

      if (paso.tipo === 'EVALUANDO_ARISTA') {
        setEdges((eds) => eds.map((e) => {
          if ((e.source === paso.desde && e.target === paso.hacia) || (e.source === paso.hacia && e.target === paso.desde)) {
            return { ...e, animated: true, style: { stroke: '#9CA3AF', strokeWidth: 3, strokeDasharray: '5,5' } };
          }
          return e;
        }));
        await delay(800);
      }

      if (paso.tipo === 'ACTUALIZANDO_DISTANCIA') {
        mejoresCaminosConocidos = paso.previosSnapshot; // Actualizamos nuestro mapa mental de rutas

        setEdges((eds) => eds.map((e) => {
          if ((e.source === paso.desde && e.target === paso.hacia) || (e.source === paso.hacia && e.target === paso.desde)) {
            return { ...e, animated: true, style: { stroke: '#10B981', strokeWidth: 4 } };
          }
          return e;
        }));
        await delay(800);
      }
    }

    await delay(500);
    setResultado({
      distancia: distanciaFinal,
      camino: distanciaFinal === Infinity ? [] : ruta
    });

    if (distanciaFinal !== Infinity && ruta.length > 0) {
      setEdges((eds) => eds.map((edge) => {
        let esParteDeLaRuta = false;
        for (let i = 0; i < ruta.length - 1; i++) {
          if (
            (edge.source === ruta[i] && edge.target === ruta[i + 1]) ||
            (edge.source === ruta[i + 1] && edge.target === ruta[i])
          ) {
            esParteDeLaRuta = true; break;
          }
        }
        return esParteDeLaRuta
          ? { ...edge, animated: true, style: { stroke: '#F59E0B', strokeWidth: 5 } }
          : { ...edge, animated: false, style: { stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 } };
      }));

      setNodes((nds) => nds.map((node) =>
        ruta.includes(node.id)
          ? { ...node, style: { boxShadow: '0 0 20px #F59E0B', border: '3px solid #F59E0B' } }
          : { ...node, style: { opacity: 0.5 } }
      ));
    }
  };

  // const calcularRutaFront = () => {
  //   const grafoActual = convertirAGrafo();

  //   if (!grafoActual[nodoInicio] || !grafoActual[nodoDestino]) {
  //     alert("Selecciona nodos válidos de la lista.");
  //     return;
  //   }

  //   // 1. Calculamos la ruta matemáticamente
  //   const resultadoAlgoritmo = calcularDijkstra(grafoActual, nodoInicio);
  //   const ruta = obtenerRuta(resultadoAlgoritmo.previos, nodoDestino);
  //   const distanciaFinal = resultadoAlgoritmo.distancias[nodoDestino];

  //   setResultado({
  //     distancia: distanciaFinal,
  //     camino: distanciaFinal === Infinity ? [] : ruta
  //   });

  //   // 2. ¡LA MAGIA DE LA ANIMACIÓN VISUAL!
  //   if (distanciaFinal !== Infinity && ruta.length > 0) {
  //     // Actualizamos las aristas (líneas)
  //     setEdges((eds) =>
  //       eds.map((edge) => {
  //         // Revisamos si esta arista conecta dos nodos que son parte de nuestro camino ganador
  //         let esParteDeLaRuta = false;
  //         for (let i = 0; i < ruta.length - 1; i++) {
  //           const actual = ruta[i];
  //           const siguiente = ruta[i + 1];

  //           // Como pueden conectar de A->B o de B->A, revisamos ambos casos
  //           if (
  //             (edge.source === actual && edge.target === siguiente) ||
  //             (edge.source === siguiente && edge.target === actual)
  //           ) {
  //             esParteDeLaRuta = true;
  //             break;
  //           }
  //         }

  //         if (esParteDeLaRuta) {
  //           // Arista ganadora: se ilumina y se anima
  //           return {
  //             ...edge,
  //             animated: true,
  //             style: { stroke: '#F59E0B', strokeWidth: 4 }, // Color ámbar grueso
  //           };
  //         } else {
  //           // Arista perdedora: se vuelve gris y semi-transparente
  //           return {
  //             ...edge,
  //             animated: false,
  //             style: { stroke: 'rgba(255,255,255,0.2)', strokeWidth: 2 },
  //           };
  //         }
  //       })
  //     );

  //     // Opcional: También podemos iluminar los nodos que pertenecen al camino
  //     setNodes((nds) =>
  //       nds.map((node) => {
  //         if (ruta.includes(node.id)) {
  //           // Nodo del camino: brillo especial
  //           return {
  //             ...node,
  //             style: {
  //               boxShadow: '0 0 15px #F59E0B',
  //               border: '3px solid #F59E0B'
  //             }
  //           };
  //         } else {
  //           // Nodo normal
  //           return {
  //             ...node,
  //             style: {
  //               boxShadow: 'none',
  //               border: '2px solid rgba(255,255,255,0.5)'
  //             }
  //           };
  //         }
  //       })
  //     );

  //   } else {
  //     // Si no hay ruta (ej. un nodo desconectado), limpiamos la animación
  //     setEdges((eds) => eds.map(e => ({ ...e, animated: false, style: {} })));
  //     setNodes((nds) => nds.map(n => ({ ...n, style: {} })));
  //   }
  // };

  // ... (El return del HTML se queda EXACTAMENTE IGUAL, solo cambiamos la etiqueta <ReactFlow>) ...

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
          <span className="emoji-title">⚡</span>
          <h1>Algoritmo de <span className="gradient-dijkstra">Dijkstra</span></h1>
          <p>Crea tus propios nodos, conéctalos y encuentra el camino más corto.</p>
        </div>

        <div className="interactive-section">
          {/* Lado izquierdo: El lienzo interactivo */}
          <div className="graph-panel">
            <div className="panel-header">
              <h3>Lienzo de Grafo</h3>
              <button className="btn-add-node" onClick={agregarNodo}>+ Agregar Nodo</button>
            </div>

            <div className="flow-container">
          <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes} // <- Registramos los nodos con 4 puntos
                connectionMode={ConnectionMode.Loose} // <- Permite conectar de cualquier lado a cualquier lado
                fitView
              >
                <Background color="#ccc" gap={16} />
                <Controls />
              </ReactFlow>
            </div>
            <p className="hint">💡 Arrastra desde los puntos de un nodo a otro para conectarlos.</p>
          </div>

          {/* Lado derecho: Controles y Resultados */}
          <div className="controls-panel">
            <h3>Calculadora de Rutas</h3>

            <div className="inputs">
              <div className="input-group">
                <label>Nodo de Inicio:</label>
                <select value={nodoInicio} onChange={(e) => setNodoInicio(e.target.value)}>
                  {nodes.map(nodo => <option key={nodo.id} value={nodo.id}>{nodo.id}</option>)}
                </select>
              </div>

              <div className="input-group">
                <label>Nodo Destino:</label>
                <select value={nodoDestino} onChange={(e) => setNodoDestino(e.target.value)}>
                  {nodes.map(nodo => <option key={nodo.id} value={nodo.id}>{nodo.id}</option>)}
                </select>
              </div>
            </div>

            <button className="btn-calc" onClick={calcularRutaFront}>
              Calcular Ruta Más Corta
            </button>

            {resultado && (
              <div className="result-box animate-pop">
                <h4>Resultado:</h4>
                {resultado.distancia === Infinity ? (
                  <p className="error">No hay un camino posible entre estos nodos.</p>
                ) : (
                  <>
                    <p><strong>Distancia total:</strong> <span className="highlight">{resultado.distancia}</span></p>
                    <div className="path-display">
                      {resultado.camino.map((nodo, index) => (
                        <span key={index}>
                          <span className="path-node">{nodo}</span>
                          {index < resultado.camino.length - 1 && <span className="path-arrow">→</span>}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
