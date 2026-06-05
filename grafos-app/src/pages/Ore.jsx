import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactFlow, {
    Background,
    Controls,
    Handle,
    Position,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    ConnectionMode
} from 'reactflow';
import 'reactflow/dist/style.css';
import '../styles/HamiltonMenu.css';
import '../styles/ORE.css';
import logoUV from '../assets/Logo_de_la_Universidad_Veracruzana.png';
import logoFIEE from '../assets/LogoFIEE.png';
import imgOre from '../assets/ORE.jpg';

const ORE_SUBTOPICS = [
    { id: "teoria",     title: "Teoría",      color: "#8B5CF6", glow: "rgba(139,92,246,0.35)" },
    { id: "quiz",       title: "Quiz",         color: "#6366F1", glow: "rgba(99,102,241,0.35)" },
    { id: "ejercicios", title: "Ejercicios",   color: "#3B82F6", glow: "rgba(59,130,246,0.35)" },
    { id: "simulacion", title: "Simulación",   color: "#10B981", glow: "rgba(16,185,129,0.35)" }
];

// ─── Nodo personalizado para ReactFlow ───────────────────────────────────────
const NodoOre = ({ data }) => (
    <div style={{
        background: '#1a1a2e',
        border: `2px solid ${data.color}`,
        borderRadius: '50%',
        width: 45,
        height: 45,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontWeight: 'bold'
    }}>
        <Handle type="source" position={Position.Top}    id="a" />
        <Handle type="source" position={Position.Right}  id="b" />
        <Handle type="source" position={Position.Bottom} id="c" />
        <Handle type="source" position={Position.Left}   id="d" />
        {data.label}
    </div>
);

// ─── Componente principal ─────────────────────────────────────────────────────
export default function Ore() {
    const navigate = useNavigate();
    const [vistaActiva, setVistaActiva] = useState('menu');

    // ── Estados React Flow ──────────────────────────────────────────────────
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const nodeTypes = useMemo(() => ({ nodoOre: NodoOre }), []);
    const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
    const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
    const onConnect    = useCallback(
        (params) => setEdges((eds) => addEdge({ ...params, style: { stroke: '#10B981', strokeWidth: 3 } }, eds)),
        []
    );

    const agregarNodo = () => {
        const id = `V${nodes.length + 1}`;
        setNodes(ns => [
            ...ns,
            {
                id,
                type: 'nodoOre',
                position: { x: Math.random() * 250, y: Math.random() * 250 },
                data: { label: id, color: '#10B981' }
            }
        ]);
    };

    // ── Lógica de Ore ───────────────────────────────────────────────────────
    const n = nodes.length;

    const grados = useMemo(() => {
        const g = {};
        nodes.forEach(no => (g[no.id] = 0));
        edges.forEach(e => {
            g[e.source] = (g[e.source] || 0) + 1;
            g[e.target] = (g[e.target] || 0) + 1;
        });
        return g;
    }, [nodes, edges]);

    const cumpleOre = useMemo(() => {
        if (n < 3) return false;
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const u = nodes[i].id;
                const v = nodes[j].id;
                const existeArista = edges.some(
                    e => (e.source === u && e.target === v) || (e.source === v && e.target === u)
                );
                if (!existeArista) {
                    if ((grados[u] || 0) + (grados[v] || 0) < n) return false;
                }
            }
        }
        return true;
    }, [nodes, edges, grados, n]);

    // ── Estado del Quiz ─────────────────────────────────────────────────────
    const [preguntaActual,      setPreguntaActual]      = useState(0);
    const [mostrarResultadoQuiz, setMostrarResultadoQuiz] = useState(false);
    const [mensajeQuiz,         setMensajeQuiz]         = useState("");

    // ── Estado de Ejercicios ────────────────────────────────────────────────
    const [estadoEjercicios, setEstadoEjercicios] = useState({});

    // ── 15 preguntas del Quiz ───────────────────────────────────────────────
    const preguntasQuiz = [
        {
            pregunta: "¿Qué condición establece el Teorema de Ore para un grafo de n ≥ 3 vértices?",
            opciones: [
                "grado(u) + grado(v) ≥ n para vértices adyacentes.",
                "grado(u) + grado(v) ≥ n para vértices NO adyacentes.",
                "Todos los vértices deben tener grado par."
            ],
            correcta: 1,
            explicacion: "El Teorema de Ore evalúa específicamente los pares de vértices que NO están conectados directamente (no adyacentes)."
        },
        {
            pregunta: "¿El Teorema de Ore es una condición necesaria o suficiente para que un grafo sea Hamiltoniano?",
            opciones: ["Necesaria", "Suficiente", "Ambas"],
            correcta: 1,
            explicacion: "Es una condición suficiente. Si se cumple, seguro es Hamiltoniano. Pero si no se cumple, ¡aún podría serlo!"
        },
        {
            pregunta: "¿Qué pasa si un grafo NO cumple la condición de Ore?",
            opciones: [
                "Es imposible que tenga un ciclo Hamiltoniano.",
                "Aún podría tener un ciclo Hamiltoniano.",
                "Se convierte en un grafo Euleriano."
            ],
            correcta: 1,
            explicacion: "Como es una condición suficiente, fallar el teorema no descarta la posibilidad de que el ciclo exista por otras razones."
        },
        {
            pregunta: "Si el Teorema de Dirac se cumple en un grafo, ¿El Teorema de Ore también se cumple?",
            opciones: ["Sí, siempre.", "No, nunca.", "Solo si el grado es par."],
            correcta: 0,
            explicacion: "Sí. Dirac exige que todo vértice tenga grado ≥ n/2. Si sumas dos de ellos, siempre dará ≥ n, cumpliendo Ore automáticamente."
        },
        {
            pregunta: "¿Cuál es el número mínimo de vértices (n) para aplicar el Teorema de Ore?",
            opciones: ["n = 1", "n = 2", "n = 3"],
            correcta: 2,
            explicacion: "El teorema establece que n debe ser mayor o igual a 3 (n ≥ 3)."
        },
        {
            pregunta: "¿Un grafo completo Kn (con n ≥ 3) cumple el Teorema de Ore?",
            opciones: ["Sí", "No", "Depende de n"],
            correcta: 0,
            explicacion: "En un grafo completo TODOS los vértices son adyacentes. Como no hay vértices no adyacentes, la premisa de Ore es vacíamente cierta, y el grafo es trivialmente Hamiltoniano."
        },
        {
            pregunta: "En un grafo de 6 vértices, el grado mínimo de cualquier vértice es 3. ¿Cumple el Teorema de Ore?",
            opciones: ["Sí", "No"],
            correcta: 0,
            explicacion: "Sí. Si el peor caso es 3, cualquier par de vértices sumará al menos 3+3 = 6. Como n=6, se cumple la condición."
        },
        {
            pregunta: "Tienes un grafo n=5. Dos vértices no adyacentes tienen grados 2 y 2. ¿Cumple Ore?",
            opciones: ["Sí", "No"],
            correcta: 1,
            explicacion: "No. La suma es 2+2 = 4. Al ser menor que el número de vértices (5), falla la condición."
        },
        {
            pregunta: "¿Qué es un ciclo Hamiltoniano?",
            opciones: [
                "Recorre todas las aristas sin repetir.",
                "Visita todos los vértices exactamente una vez y regresa al inicio.",
                "Un camino que no regresa al punto de inicio."
            ],
            correcta: 1,
            explicacion: "Un ciclo Hamiltoniano debe tocar cada vértice (nodo) exactamente una vez y ser cerrado."
        },
        {
            pregunta: "Si un grafo tiene un vértice de grado 1, ¿Puede cumplir el Teorema de Ore (asumiendo n ≥ 4)?",
            opciones: ["Sí", "No"],
            correcta: 1,
            explicacion: "Si n ≥ 4 y hay un vértice de grado 1, para que la suma con sus no adyacentes sea ≥ n, los otros tendrían que tener grado n-1, pero es imposible en todos los casos simultáneos de forma simple que mantenga grado 1."
        },
        {
            pregunta: "¿Quién propuso este teorema y en qué año?",
            opciones: ["Leonhard Euler, 1736", "Gabriel Dirac, 1952", "Øystein Ore, 1960"],
            correcta: 2,
            explicacion: "Fue propuesto por el matemático noruego Øystein Ore en el año 1960."
        },
        {
            pregunta: "¿El Teorema de Ore se aplica típicamente a grafos simples o multigrafos?",
            opciones: ["Grafos simples", "Multigrafos", "Grafos dirigidos"],
            correcta: 0,
            explicacion: "Se formula y aplica sobre grafos simples (sin lazos ni aristas paralelas)."
        },
        {
            pregunta: "Un grafo ciclo C5 (un pentágono) tiene n=5. El grado de todos sus vértices es 2. ¿Cumple el Teorema de Ore?",
            opciones: ["Sí", "No"],
            correcta: 1,
            explicacion: "No lo cumple porque 2+2 = 4 (y 4 no es ≥ 5). Sin embargo, C5 sí es un grafo Hamiltoniano."
        },
        {
            pregunta: "Comparación: ¿Cuál teorema es más 'fuerte' o abarca más grafos?",
            opciones: ["Teorema de Dirac", "Teorema de Ore", "Son exactamente iguales"],
            correcta: 1,
            explicacion: "Ore es más fuerte (general). Hay grafos que no cumplen Dirac pero sí cumplen Ore."
        },
        {
            pregunta: "Si grado(u) + grado(v) = n - 1 para un par no adyacente, el grafo:",
            opciones: [
                "Definitivamente no es Hamiltoniano.",
                "No está garantizado por Ore, requiere análisis adicional.",
                "Es Euleriano."
            ],
            correcta: 1,
            explicacion: "Si la suma es menor que n, simplemente el teorema de Ore no puede afirmar nada. Podría ser o no ser Hamiltoniano."
        }
    ];

    // ── 7 Ejercicios con SVG ────────────────────────────────────────────────
    const listaEjercicios = [
        {
            id: 1,
            titulo: "Ejercicio 1: El Cuadrado Incompleto",
            svg: (
                <svg viewBox="0 0 100 100" style={{ width: '150px', height: '150px', overflow: 'visible' }}>
                    <line x1="20" y1="20" x2="80" y2="20" stroke="white" strokeWidth="3" />
                    <line x1="20" y1="20" x2="20" y2="80" stroke="white" strokeWidth="3" />
                    <line x1="20" y1="80" x2="80" y2="80" stroke="white" strokeWidth="3" />
                    <line x1="20" y1="20" x2="80" y2="80" stroke="white" strokeWidth="3" />
                    <circle cx="20" cy="20" r="7" fill="#FBBF24" /><text x="5"  y="15" fill="white" fontSize="10">A(3)</text>
                    <circle cx="80" cy="20" r="7" fill="#FBBF24" /><text x="85" y="15" fill="white" fontSize="10">B(1)</text>
                    <circle cx="80" cy="80" r="7" fill="#FBBF24" /><text x="85" y="90" fill="white" fontSize="10">C(2)</text>
                    <circle cx="20" cy="80" r="7" fill="#FBBF24" /><text x="5"  y="90" fill="white" fontSize="10">D(2)</text>
                </svg>
            ),
            pregunta: "Grafo con n = 4. Los vértices B y D NO son adyacentes. grado(B)=1, grado(D)=2. ¿Cumple la condición de Ore?",
            opciones: ["Sí lo cumple (Garantiza ciclo)", "No lo cumple (Falla Ore)"],
            correcta: 1,
            explicacion: "No lo cumple. La suma de los vértices no adyacentes B y D es 1 + 2 = 3. Como n = 4, 3 no es ≥ 4. De hecho, al tener un vértice de grado 1, es imposible hacer un ciclo."
        },
        {
            id: 2,
            titulo: "Ejercicio 2: Grafo Estrella",
            svg: (
                <svg viewBox="0 0 100 100" style={{ width: '150px', height: '150px', overflow: 'visible' }}>
                    <line x1="50" y1="50" x2="50" y2="10" stroke="white" strokeWidth="3" />
                    <line x1="50" y1="50" x2="90" y2="50" stroke="white" strokeWidth="3" />
                    <line x1="50" y1="50" x2="50" y2="90" stroke="white" strokeWidth="3" />
                    <line x1="50" y1="50" x2="10" y2="50" stroke="white" strokeWidth="3" />
                    <circle cx="50" cy="50" r="7" fill="#FBBF24" />
                    <circle cx="50" cy="10" r="7" fill="#FBBF24" /><text x="55" y="15" fill="white" fontSize="10">g=1</text>
                    <circle cx="90" cy="50" r="7" fill="#FBBF24" /><text x="95" y="45" fill="white" fontSize="10">g=1</text>
                    <circle cx="50" cy="90" r="7" fill="#FBBF24" />
                    <circle cx="10" cy="50" r="7" fill="#FBBF24" />
                </svg>
            ),
            pregunta: "Tenemos n = 5. El vértice central tiene grado 4. Todos los extremos tienen grado 1 y no están conectados entre sí. ¿Cumple Ore?",
            opciones: ["Sí", "No"],
            correcta: 1,
            explicacion: "No. Si tomas dos vértices de los extremos (que no son adyacentes), sus grados son 1 y 1. La suma es 2, lo cual es mucho menor que n=5."
        },
        {
            id: 3,
            titulo: "Ejercicio 3: El Pentágono (Ciclo C5)",
            svg: (
                <svg viewBox="0 0 100 100" style={{ width: '150px', height: '150px', overflow: 'visible' }}>
                    <polygon points="50,10 90,40 75,90 25,90 10,40" fill="none" stroke="white" strokeWidth="3" />
                    <circle cx="50" cy="10" r="7" fill="#10B981" />
                    <circle cx="90" cy="40" r="7" fill="#10B981" />
                    <circle cx="75" cy="90" r="7" fill="#10B981" />
                    <circle cx="25" cy="90" r="7" fill="#10B981" />
                    <circle cx="10" cy="40" r="7" fill="#10B981" />
                </svg>
            ),
            pregunta: "Este es un ciclo C5 donde n = 5. Todos los vértices tienen exactamente grado 2. ¿Garantiza el Teorema de Ore que este grafo es Hamiltoniano?",
            opciones: ["Garantizado por Ore", "Ore no lo garantiza"],
            correcta: 1,
            explicacion: "Ore NO lo garantiza. Cualquier par de vértices no adyacentes sumará 2 + 2 = 4, que es menor a 5. ¡A pesar de esto, el grafo evidentemente SÍ es un ciclo Hamiltoniano! Esto demuestra que Ore es solo condición suficiente."
        },
        {
            id: 4,
            titulo: "Ejercicio 4: Diamante modificado",
            svg: (
                <svg viewBox="0 0 100 100" style={{ width: '150px', height: '150px', overflow: 'visible' }}>
                    <line x1="50" y1="10" x2="90" y2="50" stroke="white" strokeWidth="3" />
                    <line x1="90" y1="50" x2="50" y2="90" stroke="white" strokeWidth="3" />
                    <line x1="50" y1="90" x2="10" y2="50" stroke="white" strokeWidth="3" />
                    <line x1="10" y1="50" x2="50" y2="10" stroke="white" strokeWidth="3" />
                    <line x1="10" y1="50" x2="90" y2="50" stroke="white" strokeWidth="3" />
                    <circle cx="50" cy="10" r="7" fill="#FBBF24" /><text x="50" y="5"   fill="white" fontSize="10">2</text>
                    <circle cx="90" cy="50" r="7" fill="#FBBF24" /><text x="95" y="45"  fill="white" fontSize="10">3</text>
                    <circle cx="50" cy="90" r="7" fill="#FBBF24" /><text x="50" y="105" fill="white" fontSize="10">2</text>
                    <circle cx="10" cy="50" r="7" fill="#FBBF24" /><text x="0"  y="45"  fill="white" fontSize="10">3</text>
                </svg>
            ),
            pregunta: "Grafo con n = 4. Los vértices superior e inferior NO son adyacentes y ambos tienen grado 2. ¿Cumple Ore?",
            opciones: ["Sí cumple", "No cumple"],
            correcta: 0,
            explicacion: "¡Sí cumple! Los únicos no adyacentes son el superior (grado 2) y el inferior (grado 2). Su suma es 2 + 2 = 4. Como n = 4, 4 ≥ 4 es VERDADERO."
        },
        {
            id: 5,
            titulo: "Ejercicio 5: La Rueda W4",
            svg: (
                <svg viewBox="0 0 100 100" style={{ width: '150px', height: '150px', overflow: 'visible' }}>
                    <line x1="20" y1="20" x2="80" y2="20" stroke="white" strokeWidth="3" />
                    <line x1="80" y1="20" x2="80" y2="80" stroke="white" strokeWidth="3" />
                    <line x1="80" y1="80" x2="20" y2="80" stroke="white" strokeWidth="3" />
                    <line x1="20" y1="80" x2="20" y2="20" stroke="white" strokeWidth="3" />
                    <line x1="50" y1="50" x2="20" y2="20" stroke="white" strokeWidth="3" />
                    <line x1="50" y1="50" x2="80" y2="20" stroke="white" strokeWidth="3" />
                    <line x1="50" y1="50" x2="80" y2="80" stroke="white" strokeWidth="3" />
                    <line x1="50" y1="50" x2="20" y2="80" stroke="white" strokeWidth="3" />
                    <circle cx="50" cy="50" r="7" fill="#6366F1" /><text x="55" y="45" fill="white" fontSize="10">4</text>
                    <circle cx="20" cy="20" r="7" fill="#FBBF24" /><text x="5"  y="15" fill="white" fontSize="10">3</text>
                    <circle cx="80" cy="20" r="7" fill="#FBBF24" />
                    <circle cx="80" cy="80" r="7" fill="#FBBF24" />
                    <circle cx="20" cy="80" r="7" fill="#FBBF24" />
                </svg>
            ),
            pregunta: "Grafo n = 5. El centro conecta con todos (grado 4). Las esquinas forman un cuadrado y tienen grado 3. Las esquinas opuestas no son adyacentes. ¿Cumple Ore?",
            opciones: ["Sí", "No"],
            correcta: 0,
            explicacion: "Sí. Las únicas parejas no adyacentes son las esquinas diagonales. Sus grados son 3 y 3. La suma es 6, que es mayor que n=5. ¡Garantiza ciclo Hamiltoniano!"
        },
        {
            id: 6,
            titulo: "Ejercicio 6: Dos Triángulos conectados",
            svg: (
                <svg viewBox="0 0 100 100" style={{ width: '150px', height: '150px', overflow: 'visible' }}>
                    <polygon points="10,50 40,20 40,80" fill="none" stroke="white" strokeWidth="3" />
                    <line x1="40" y1="50" x2="60" y2="50" stroke="white" strokeWidth="3" />
                    <polygon points="90,50 60,20 60,80" fill="none" stroke="white" strokeWidth="3" />
                    <circle cx="10" cy="50" r="6" fill="#EF4444" /><text x="0"  y="40" fill="white" fontSize="10">2</text>
                    <circle cx="40" cy="20" r="6" fill="#FBBF24" />
                    <circle cx="40" cy="80" r="6" fill="#FBBF24" />
                    <circle cx="90" cy="50" r="6" fill="#EF4444" /><text x="95" y="40" fill="white" fontSize="10">2</text>
                    <circle cx="60" cy="20" r="6" fill="#FBBF24" />
                    <circle cx="60" cy="80" r="6" fill="#FBBF24" />
                </svg>
            ),
            pregunta: "Grafo n = 6 (conocido como corbata o mariposa extendida). Los extremos izquierdos y derechos NO son adyacentes y tienen grado 2. ¿Cumple Ore?",
            opciones: ["Cumple Ore", "No cumple Ore"],
            correcta: 1,
            explicacion: "No lo cumple. Los vértices rojos en los extremos tienen grado 2. Como no están conectados, sumamos 2 + 2 = 4. El número de vértices es 6. Como 4 no es ≥ 6, falla."
        },
        {
            id: 7,
            titulo: "Ejercicio 7: El Grafo Completo K5",
            svg: (
                <svg viewBox="0 0 100 100" style={{ width: '150px', height: '150px', overflow: 'visible' }}>
                    <polygon points="50,10 88,38 73,86 27,86 12,38" fill="none" stroke="white" strokeWidth="3" />
                    <line x1="50" y1="10" x2="73" y2="86" stroke="white" strokeWidth="3" />
                    <line x1="50" y1="10" x2="27" y2="86" stroke="white" strokeWidth="3" />
                    <line x1="88" y1="38" x2="27" y2="86" stroke="white" strokeWidth="3" />
                    <line x1="88" y1="38" x2="12" y2="38" stroke="white" strokeWidth="3" />
                    <line x1="73" y1="86" x2="12" y2="38" stroke="white" strokeWidth="3" />
                    <circle cx="50" cy="10" r="7" fill="#3B82F6" />
                    <circle cx="88" cy="38" r="7" fill="#3B82F6" />
                    <circle cx="73" cy="86" r="7" fill="#3B82F6" />
                    <circle cx="27" cy="86" r="7" fill="#3B82F6" />
                    <circle cx="12" cy="38" r="7" fill="#3B82F6" />
                </svg>
            ),
            pregunta: "Grafo K5 (n = 5). Todos están conectados con todos. Grado de cada vértice es 4. ¿Cumple el Teorema de Ore?",
            opciones: ["No", "Sí (Trivialmente)"],
            correcta: 1,
            explicacion: "Sí. El teorema dice 'SI existen vértices no adyacentes, entonces la suma debe ser ≥ n'. Al no existir NINGÚN par no adyacente, la condición matemática no se rompe nunca (es vacuamente cierta). ¡Siempre tiene ciclo Hamiltoniano!"
        }
    ];

    // ── Handlers Quiz ───────────────────────────────────────────────────────
    const manejarRespuestaQuiz = (indexOpcion) => {
        if (indexOpcion === preguntasQuiz[preguntaActual].correcta) {
            setMensajeQuiz("¡Correcto! " + preguntasQuiz[preguntaActual].explicacion);
        } else {
            setMensajeQuiz("Incorrecto. " + preguntasQuiz[preguntaActual].explicacion);
        }
        setMostrarResultadoQuiz(true);
    };

    const siguientePregunta = () => {
        if (preguntaActual < preguntasQuiz.length - 1) {
            setPreguntaActual(prev => prev + 1);
            setMostrarResultadoQuiz(false);
            setMensajeQuiz("");
        } else {
            setMensajeQuiz("¡Has completado todas las preguntas del Quiz!");
        }
    };

    // ── Handlers Ejercicios ─────────────────────────────────────────────────
    const seleccionarRespuestaEjercicio = (ejercicioId, indexOpcion) => {
        setEstadoEjercicios(prev => ({
            ...prev,
            [ejercicioId]: { seleccion: indexOpcion, mostrado: true }
        }));
    };

    // ── Volver al menú: también resetea el quiz ─────────────────────────────
    const volverAlMenu = () => {
        setVistaActiva('menu');
        setPreguntaActual(0);
        setMostrarResultadoQuiz(false);
        setMensajeQuiz("");
    };

    // ═══════════════════════════════════════════════════════════════════════
    // VISTA MENÚ PRINCIPAL
    // ═══════════════════════════════════════════════════════════════════════
    if (vistaActiva === 'menu') {
        return (
            <div className="hamilton-menu">
                <div className="bubble bubble-ham-1" />
                <div className="bubble bubble-ham-2" />
                <div className="bubble bubble-ham-3" />

                <header className="topics-header">
                    <div className="logos">
                        <img src={logoUV} alt="Universidad Veracruzana" className="logo-img" />
                        <div className="logo-divider" />
                        <img src={logoFIEE} alt="FIEE" className="logo-img" />
                    </div>
                    <button className="back-btn" onClick={() => navigate("/temas/hamilton")}>
                        ← Volver a Hamilton
                    </button>
                </header>

                <div className="topics-title animate-pop" style={{ animationDelay: "0s" }}>
                    <p className="topics-sup">Camino de Hamilton</p>
                    <h1>Teorema de <span className="gradient-word-hamilton">Ore</span></h1>
                </div>

                <section className="topics-grid">
                    {ORE_SUBTOPICS.map((topic, i) => (
                        <div
                            key={topic.id}
                            className="topic-card animate-pop"
                            style={{
                                "--c": topic.color,
                                "--glow": topic.glow,
                                animationDelay: `${0.1 + i * 0.12}s`
                            }}
                            onClick={() => setVistaActiva(topic.id)}
                        >
                            <div className="card-top">
                                <h2 className="card-title">{topic.title}</h2>
                            </div>
                            <p className="card-desc">{topic.description}</p>
                            <div className="card-footer-simple">
                                <span className="card-arrow">→</span>
                            </div>
                        </div>
                    ))}
                </section>
            </div>
        );
    }

    // ═══════════════════════════════════════════════════════════════════════
    // VISTAS DE CONTENIDO (Teoría / Quiz / Ejercicios / Simulación)
    // ═══════════════════════════════════════════════════════════════════════
    return (
        <div className="ore-page" style={{ paddingBottom: '80px' }}>
            <div className="bubble bubble-ham-1" style={{ position: 'fixed' }} />
            <div className="bubble bubble-ham-2" style={{ position: 'fixed' }} />

            {/* Header */}
            <header className="topics-header" style={{ position: 'relative', zIndex: 10 }}>
                <div className="logos">
                    <img src={logoUV} alt="UV" className="logo-img" />
                    <div className="logo-divider" />
                    <img src={logoFIEE} alt="FIEE" className="logo-img" />
                </div>
                <button className="back-btn" onClick={volverAlMenu}>
                    ← Volver a Ore
                </button>
            </header>

            {/* Título de sección */}
            <div className="topics-title animate-pop" style={{ position: 'relative', zIndex: 10, marginTop: '20px' }}>
                <h1 style={{ color: '#fff' }}>
                    {ORE_SUBTOPICS.find(t => t.id === vistaActiva)?.title.toUpperCase()}
                </h1>
            </div>

            {/* Contenido principal */}
            <div style={{
                position: 'relative', zIndex: 10, color: 'white',
                maxWidth: '850px', margin: '2rem auto', textAlign: 'left',
                fontSize: '1.1rem', backgroundColor: 'rgba(0,0,0,0.3)',
                padding: '2.5rem', borderRadius: '15px',
                backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)'
            }}>

                {/* ──────────── TEORÍA ──────────── */}
                {vistaActiva === 'teoria' && (
                    <div className="fade-in">
                        <h2 style={{ color: '#3B82F6', borderBottom: '1px solid #3B82F6', paddingBottom: '10px' }}>
                            Fundamentos del Teorema
                        </h2>
                        <p style={{ lineHeight: '1.7' }}>
                            Propuesto por el matemático noruego Øystein Ore en 1960, este teorema nos proporciona una{' '}
                            <strong>condición suficiente</strong> para determinar si un grafo simple posee un ciclo Hamiltoniano
                            (un recorrido cerrado que visita todos los vértices exactamente una vez).
                        </p>

                        <div style={{
                            background: 'rgba(59, 130, 246, 0.1)', padding: '1.5rem',
                            borderRadius: '10px', margin: '2rem 0', borderLeft: '4px solid #3B82F6'
                        }}>
                            <h3 style={{ marginTop: 0, color: '#60A5FA' }}>La Condición de Ore</h3>
                            <p>
                                Sea G un grafo simple con <strong>n ≥ 3</strong> vértices. Si para cada par de vértices{' '}
                                <strong>no adyacentes</strong> (u y v), se cumple que:
                            </p>
                            <div style={{ textAlign: 'center', fontSize: '1.4rem', color: '#10B981', margin: '15px 0', fontWeight: 'bold' }}>
                                grado(u) + grado(v) ≥ n
                            </div>
                            <p style={{ marginBottom: 0 }}>Entonces G es un grafo Hamiltoniano.</p>
                        </div>

                        <h3 style={{ color: '#8B5CF6', marginTop: '2rem' }}>Ejemplo Visual</h3>
                        <p>
                            En el siguiente grafo, verifica los grados de los vértices que no están conectados por una
                            arista directa. Verás que la suma de sus grados siempre es mayor o igual al total de vértices,
                            garantizando el ciclo.
                        </p>
                        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
                            <img
                                src={imgOre}
                                alt="Grafo Teorema de Ore"
                                style={{ maxWidth: '100%', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)' }}
                            />
                        </div>
                    </div>
                )}

                {/* ──────────── QUIZ ──────────── */}
                {vistaActiva === 'quiz' && (
                    <div className="fade-in">
                        <h2 style={{ color: '#6366F1', textAlign: 'center' }}>
                            Pregunta {preguntaActual + 1} de {preguntasQuiz.length}
                        </h2>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '12px', marginTop: '2rem' }}>
                            <p style={{ fontSize: '1.3rem', marginBottom: '2rem' }}>
                                {preguntasQuiz[preguntaActual].pregunta}
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {preguntasQuiz[preguntaActual].opciones.map((opcion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => manejarRespuestaQuiz(index)}
                                        disabled={mostrarResultadoQuiz}
                                        style={{
                                            padding: '15px',
                                            backgroundColor: mostrarResultadoQuiz && index === preguntasQuiz[preguntaActual].correcta
                                                ? '#10B981'
                                                : 'rgba(255,255,255,0.1)',
                                            color: 'white',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            borderRadius: '8px',
                                            cursor: mostrarResultadoQuiz ? 'default' : 'pointer',
                                            textAlign: 'left',
                                            fontSize: '1.1rem',
                                            transition: '0.3s'
                                        }}
                                    >
                                        {opcion}
                                    </button>
                                ))}
                            </div>

                            {mostrarResultadoQuiz && (
                                <div style={{
                                    marginTop: '2rem', padding: '15px',
                                    background: 'rgba(0,0,0,0.5)', borderRadius: '8px',
                                    borderLeft: mensajeQuiz.includes('¡Correcto!') ? '4px solid #10B981' : '4px solid #EF4444'
                                }}>
                                    <p>{mensajeQuiz}</p>
                                    {mensajeQuiz !== "¡Has completado todas las preguntas del Quiz!" && (
                                        <button
                                            onClick={siguientePregunta}
                                            style={{
                                                marginTop: '15px', padding: '10px 20px',
                                                background: '#6366F1', color: 'white',
                                                border: 'none', borderRadius: '5px', cursor: 'pointer'
                                            }}
                                        >
                                            {preguntaActual < preguntasQuiz.length - 1 ? 'Siguiente Pregunta →' : 'Finalizar'}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ──────────── EJERCICIOS ──────────── */}
                {vistaActiva === 'ejercicios' && (
                    <div className="fade-in">
                        <h2 style={{ color: '#3B82F6', textAlign: 'center', marginBottom: '2rem' }}>
                            Análisis Visual de Grafos
                        </h2>
                        <p style={{ textAlign: 'center', marginBottom: '3rem', color: '#9CA3AF' }}>
                            Observa las imágenes generadas, lee los grados y determina si cumplen la condición de Ore.
                        </p>

                        {listaEjercicios.map((ej) => {
                            const estadoActual = estadoEjercicios[ej.id] || {};
                            const isRespondido = estadoActual.mostrado;
                            const isCorrecto  = estadoActual.seleccion === ej.correcta;

                            return (
                                <div
                                    key={ej.id}
                                    style={{
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        padding: '2rem', borderRadius: '15px', marginBottom: '3rem'
                                    }}
                                >
                                    <h3 style={{
                                        marginTop: 0, color: '#60A5FA',
                                        borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px'
                                    }}>
                                        {ej.titulo}
                                    </h3>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', marginTop: '1.5rem' }}>
                                        {/* SVG */}
                                        <div style={{
                                            flex: '1', minWidth: '200px', display: 'flex',
                                            justifyContent: 'center', background: 'rgba(0,0,0,0.4)',
                                            borderRadius: '10px', padding: '1rem'
                                        }}>
                                            {ej.svg}
                                        </div>

                                        {/* Pregunta + Botones */}
                                        <div style={{ flex: '2', minWidth: '300px' }}>
                                            <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>{ej.pregunta}</p>

                                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                                {ej.opciones.map((opcion, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => seleccionarRespuestaEjercicio(ej.id, index)}
                                                        disabled={isRespondido}
                                                        style={{
                                                            flex: 1, padding: '12px', borderRadius: '8px',
                                                            cursor: isRespondido ? 'default' : 'pointer',
                                                            fontWeight: 'bold', border: 'none', transition: '0.3s',
                                                            background: isRespondido
                                                                ? (index === ej.correcta
                                                                    ? '#10B981'
                                                                    : (index === estadoActual.seleccion ? '#EF4444' : 'rgba(255,255,255,0.1)'))
                                                                : '#3B82F6',
                                                            color: 'white',
                                                            opacity: isRespondido && index !== ej.correcta && index !== estadoActual.seleccion ? 0.5 : 1
                                                        }}
                                                    >
                                                        {opcion}
                                                    </button>
                                                ))}
                                            </div>

                                            {isRespondido && (
                                                <div style={{
                                                    marginTop: '1.5rem', padding: '15px',
                                                    background: 'rgba(0,0,0,0.5)', borderRadius: '8px',
                                                    borderLeft: isCorrecto ? '4px solid #10B981' : '4px solid #EF4444'
                                                }}>
                                                    <h4 style={{ marginTop: 0, color: isCorrecto ? '#10B981' : '#EF4444' }}>
                                                        {isCorrecto ? '¡Excelente!' : 'Casi... revisemos por qué:'}
                                                    </h4>
                                                    <p style={{ margin: 0, fontSize: '0.95rem' }}>{ej.explicacion}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ──────────── SIMULACIÓN ──────────── */}
                {vistaActiva === 'simulacion' && (
                    <div className="fade-in" style={{ height: '700px' }}>
                        <h1 className="content-title">Simulador: Teorema de Ore</h1>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', marginTop: '1rem' }}>
                            {/* Canvas ReactFlow */}
                            <div style={{
                                height: '500px', background: '#0f172a',
                                borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                <ReactFlow
                                    nodes={nodes}
                                    edges={edges}
                                    onNodesChange={onNodesChange}
                                    onEdgesChange={onEdgesChange}
                                    onConnect={onConnect}
                                    nodeTypes={nodeTypes}
                                    connectionMode={ConnectionMode.Loose}
                                    fitView
                                >
                                    <Background color="rgba(255,255,255,0.05)" />
                                    <Controls />
                                </ReactFlow>
                            </div>

                            {/* Panel lateral */}
                            <div>
                                <button
                                    className="btn-primary"
                                    style={{ width: '100%', marginBottom: '1rem', background: '#3B82F6' }}
                                    onClick={agregarNodo}
                                >
                                    + Agregar Vértice
                                </button>
                                <button
                                    className="btn-primary"
                                    style={{ width: '100%', marginBottom: '2rem', background: 'transparent', border: '1px solid #EF4444' }}
                                    onClick={() => { setNodes([]); setEdges([]); }}
                                >
                                    🗑 Limpiar
                                </button>

                                <div className="ore-info-box" style={{ borderColor: cumpleOre ? '#10B981' : '#EF4444' }}>
                                    <div className="box-label">ANÁLISIS ORE</div>
                                    <p><strong>Total (n):</strong> {n}</p>
                                    {n < 3 ? (
                                        <p>Agrega más nodos (n ≥ 3)</p>
                                    ) : cumpleOre ? (
                                        <p style={{ color: '#10B981' }}>
                                            ✓ TODOS los pares no adyacentes cumplen deg(u)+deg(v) ≥ n
                                        </p>
                                    ) : (
                                        <p style={{ color: '#EF4444' }}>
                                            ✕ Existe al menos un par no adyacente que falla la condición.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}