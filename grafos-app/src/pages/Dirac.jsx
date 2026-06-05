import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactFlow, { addEdge, applyNodeChanges, applyEdgeChanges, Controls, Background, Handle, Position, ConnectionMode } from 'reactflow'
import 'reactflow/dist/style.css'

import '../styles/Euler.css' // Usamos las clases de Euler para reciclar la estética
import logoUV from '../assets/Logo_de_la_Universidad_Veracruzana.png'
import logoFIEE from '../assets/LogoFIEE.png'

// ==========================================
// DATA: 20 PREGUNTAS (Se elegirán 5)
// ==========================================
const QUIZ_DIRAC = [
    { q: '¿Qué garantiza el Teorema de Dirac?', opts: ['Un camino de Euler', 'Un ciclo de Euler', 'Un camino Hamiltoniano', 'Un ciclo Hamiltoniano'], a: 3 },
    { q: 'Sea n el número de vértices. ¿Cuál es la condición de Dirac para el grado de cada vértice v?', opts: ['deg(v) = n', 'deg(v) ≥ n/2', 'deg(v) < n/2', 'deg(v) ≥ 2'], a: 1 },
    { q: '¿Para qué tamaño de grafos (n) aplica el Teorema de Dirac?', opts: ['n ≥ 1', 'n ≥ 2', 'n ≥ 3', 'Cualquier n'], a: 2 },
    { q: 'Si un grafo cumple la condición de Dirac, ¿puede ser disconexo?', opts: ['Sí', 'No, la condición fuerza a que sea conexo', 'Solo si n es par', 'Solo si es dirigido'], a: 1 },
    { q: '¿Quién formuló el Teorema de Dirac?', opts: ['Paul Dirac', 'Gabriel Andrew Dirac', 'Leonhard Euler', 'William Hamilton'], a: 1 },
    { q: 'En un grafo de 6 vértices, ¿cuál es el grado mínimo que debe tener CADA vértice según Dirac?', opts: ['2', '3', '4', '6'], a: 1 },
    { q: 'Si un grafo NO cumple la condición de Dirac, ¿significa que NO tiene ciclo Hamiltoniano?', opts: ['Sí, es una condición necesaria y suficiente', 'No, es solo una condición suficiente', 'Sí, pero solo en grafos bipartitos', 'No se puede saber'], a: 1 },
    { q: 'El Teorema de Dirac es un caso especial (corolario) de otro teorema más general. ¿Cuál?', opts: ['Teorema de Euler', 'Teorema de Kuratowski', 'Teorema de Ore', 'Teorema de Fleury'], a: 2 },
    { q: 'En un grafo de 7 vértices, ¿cuál es el grado mínimo entero para cumplir Dirac?', opts: ['3', '3.5', '4', '7'], a: 2 },
    { q: '¿El teorema de Dirac aplica para grafos con lazos (bucles) o aristas múltiples?', opts: ['Sí, siempre', 'Solo aristas múltiples', 'No, aplica para grafos simples', 'Depende de n'], a: 2 },
    { q: 'Si un grafo completo K_n tiene n=5, ¿cumple Dirac?', opts: ['No', 'Sí, porque todos los grados son 4 (y 4 ≥ 2.5)', 'Solo si quitamos una arista', 'Los grafos completos no tienen ciclos hamiltonianos'], a: 1 },
    { q: 'Si tenemos un grafo de 4 vértices formando una línea (A-B-C-D), ¿cumple Dirac?', opts: ['Sí', 'No, los extremos tienen grado 1 (1 < 2)', 'Solo el vértice B y C', 'Falta información'], a: 1 },
    { q: '¿El ciclo C_n (para n ≥ 3) cumple siempre el teorema de Dirac?', opts: ['Siempre', 'Nunca', 'Solo para n=3 y n=4', 'Solo para n pares'], a: 2 },
    { q: 'Si un grafo tiene un vértice de grado 2 y n=10, ¿qué podemos decir?', opts: ['Cumple Dirac', 'No cumple Dirac', 'No tiene ciclo Hamiltoniano', 'Es un árbol'], a: 1 },
    { q: '¿Por qué las condiciones como Dirac y Ore son útiles en Teoría de Grafos?', opts: ['Porque encontrar ciclos Hamiltonianos es fácil', 'Porque el problema del ciclo Hamiltoniano es NP-Completo', 'Porque colorean el grafo', 'Porque calculan el camino más corto'], a: 1 },
    { q: '¿Qué pasa si deg(v) ≥ (n-1)/2 en lugar de n/2?', opts: ['Sigue garantizando un ciclo Hamiltoniano', 'Garantiza un camino Hamiltoniano, pero no necesariamente un ciclo', 'No garantiza nada', 'Es la condición de Euler'], a: 1 },
    { q: 'Si añado aristas a un grafo que ya cumple Dirac, el nuevo grafo:', opts: ['Deja de cumplir Dirac', 'También cumple Dirac', 'Se vuelve Euleriano', 'Se vuelve disconexo'], a: 1 },
    { q: 'En un grafo bipartito K_m,m (m ≥ 2), ¿se cumple Dirac?', opts: ['No', 'Sí, n=2m, y cada vértice tiene grado m (m ≥ 2m/2)', 'Solo si m es impar', 'Solo si m=2'], a: 1 },
    { q: 'Un grafo simple con n vértices tiene el número máximo posible de aristas. ¿Cumple Dirac?', opts: ['No', 'Depende de n', 'Sí (es K_n y siempre cumple si n≥3)', 'Falta el peso de las aristas'], a: 2 },
    { q: 'Si n=8, y los grados de los vértices son {4,5,4,4,6,7,4,3}. ¿Cumple Dirac?', opts: ['Sí, la media es alta', 'No, hay un vértice con grado 3 (3 < 4)', 'Sí, porque la suma es grande', 'No se puede tener un grafo así'], a: 1 },
]

// ==========================================
// DATA: 10 EJERCICIOS (Se elegirán 5)
// ==========================================
const EJERCICIOS_DIRAC = [
    { titulo: 'K4 (Completo)',     nodos: [{id:'1',x:80,y:80},{id:'2',x:160,y:80},{id:'3',x:80,y:160},{id:'4',x:160,y:160}], aristas: [['1','2'],['1','3'],['1','4'],['2','3'],['2','4'],['3','4']], a: 0, opts: ['Cumple Dirac', 'No cumple Dirac'], expl: 'n=4, n/2=2. Todos los nodos tienen grado 3. Como 3 ≥ 2, CUMPLE.' },
    { titulo: 'Estrella S4',       nodos: [{id:'C',x:120,y:120},{id:'1',x:120,y:50},{id:'2',x:50,y:160},{id:'3',x:190,y:160}], aristas: [['C','1'],['C','2'],['C','3']], a: 1, opts: ['Cumple Dirac', 'No cumple Dirac'], expl: 'n=4, n/2=2. Los nodos de los extremos tienen grado 1. Como 1 < 2, NO CUMPLE.' },
    { titulo: 'Cuadrado C4',       nodos: [{id:'1',x:80,y:80},{id:'2',x:160,y:80},{id:'3',x:160,y:160},{id:'4',x:80,y:160}], aristas: [['1','2'],['2','3'],['3','4'],['4','1']], a: 0, opts: ['Cumple Dirac', 'No cumple Dirac'], expl: 'n=4, n/2=2. Todos tienen grado 2. Como 2 ≥ 2, CUMPLE.' },
    { titulo: 'Línea de 4',        nodos: [{id:'1',x:50,y:120},{id:'2',x:100,y:120},{id:'3',x:150,y:120},{id:'4',x:200,y:120}], aristas: [['1','2'],['2','3'],['3','4']], a: 1, opts: ['Cumple Dirac', 'No cumple Dirac'], expl: 'n=4, n/2=2. Los extremos tienen grado 1. 1 < 2. NO CUMPLE.' },
    { titulo: 'Pentágono C5',      nodos: [{id:'1',x:120,y:50},{id:'2',x:190,y:100},{id:'3',x:160,y:180},{id:'4',x:80,y:180},{id:'5',x:50,y:100}], aristas: [['1','2'],['2','3'],['3','4'],['4','5'],['5','1']], a: 1, opts: ['Cumple Dirac', 'No cumple Dirac'], expl: 'n=5, n/2=2.5. Todos tienen grado 2. Como 2 < 2.5, NO CUMPLE (aunque sí tiene ciclo hamiltoniano, Dirac no lo detecta).' },
    { titulo: 'K5 menos arista',  nodos: [{id:'1',x:120,y:50},{id:'2',x:190,y:100},{id:'3',x:160,y:180},{id:'4',x:80,y:180},{id:'5',x:50,y:100}], aristas: [['1','2'],['1','3'],['1','4'],['1','5'],['2','3'],['2','4'],['2','5'],['3','4'],['4','5']], a: 0, opts: ['Cumple Dirac', 'No cumple Dirac'], expl: 'n=5, n/2=2.5. El grado mínimo es 3 (nodos 3 y 5 perdieron una arista). Como 3 ≥ 2.5, CUMPLE.' },
    { titulo: 'Hexágono C6',       nodos: [{id:'1',x:120,y:50},{id:'2',x:180,y:80},{id:'3',x:180,y:150},{id:'4',x:120,y:180},{id:'5',x:60,y:150},{id:'6',x:60,y:80}], aristas: [['1','2'],['2','3'],['3','4'],['4','5'],['5','6'],['6','1']], a: 1, opts: ['Cumple Dirac', 'No cumple Dirac'], expl: 'n=6, n/2=3. Todos tienen grado 2. Como 2 < 3, NO CUMPLE.' },
    { titulo: 'K3,3 Bipartito',   nodos: [{id:'1',x:60,y:60},{id:'2',x:120,y:60},{id:'3',x:180,y:60},{id:'4',x:60,y:160},{id:'5',x:120,y:160},{id:'6',x:180,y:160}], aristas: [['1','4'],['1','5'],['1','6'],['2','4'],['2','5'],['2','6'],['3','4'],['3','5'],['3','6']], a: 0, opts: ['Cumple Dirac', 'No cumple Dirac'], expl: 'n=6, n/2=3. Todos tienen grado 3. Como 3 ≥ 3, CUMPLE.' },
    { titulo: 'Moño (Dos K3)',     nodos: [{id:'1',x:60,y:80},{id:'2',x:60,y:160},{id:'C',x:120,y:120},{id:'3',x:180,y:80},{id:'4',x:180,y:160}], aristas: [['1','2'],['1','C'],['2','C'],['3','4'],['3','C'],['4','C']], a: 1, opts: ['Cumple Dirac', 'No cumple Dirac'], expl: 'n=5, n/2=2.5. Los vértices 1, 2, 3, 4 tienen grado 2. Como 2 < 2.5, NO CUMPLE.' },
    { titulo: 'Grafo Denso 6',     nodos: [{id:'1',x:120,y:50},{id:'2',x:180,y:80},{id:'3',x:180,y:150},{id:'4',x:120,y:180},{id:'5',x:60,y:150},{id:'6',x:60,y:80}], aristas: [['1','2'],['2','3'],['3','4'],['4','5'],['5','6'],['6','1'], ['1','4'], ['2','5'], ['3','6']], a: 0, opts: ['Cumple Dirac', 'No cumple Dirac'], expl: 'n=6, n/2=3. Todos los vértices tienen grado 3. Como 3 ≥ 3, CUMPLE.' }
]

function shuffle(arr) {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] } return a
}

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function Dirac() {
    const navigate = useNavigate()
    const [vista, setVista] = useState('menu')

    return (
        <div className="euler" style={{ background: 'linear-gradient(135deg, #0f0c29, #1a1a2e, #231b4d)' }}>
        <div className="bubble bubble-1" style={{ background: 'radial-gradient(circle, #6366F1, transparent)' }} />
        <div className="bubble bubble-2" style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)' }} />
        <div className="bubble bubble-3" style={{ background: 'radial-gradient(circle, #3B82F6, transparent)' }} />

        <header className="euler-header">
            <div className="logos">
            <img src={logoUV} alt="UV" className="logo-img" />
            <div className="logo-divider" />
            <img src={logoFIEE} alt="FIEE" className="logo-img" />
            </div>
            <button className="back-btn" onClick={() => vista === 'menu' ? navigate('/temas/hamilton') : setVista('menu')}>
            ← {vista === 'menu' ? 'Hamilton' : 'Menú Dirac'}
            </button>
        </header>

        {vista === 'menu' && <Menu ir={setVista} />}
        {vista === 'teoria' && <Teoria />}
        {vista === 'quiz' && <QuizDirac />}
        {vista === 'ejercicios' && <EjerciciosDirac />}
        {vista === 'simulacion' && <SimulacionDirac />}
        </div>
    )
}

function Menu({ ir }) {
    const items = [
        { key:'teoria',     emoji:'📐', label:'Teoría',     desc:'Condición de n/2 y definiciones formales.' },
        { key:'quiz',       emoji:'🧠', label:'Quiz',       desc:'5 preguntas rápidas aleatorias sobre Dirac.' },
        { key:'ejercicios', emoji:'📝', label:'Ejercicios', desc:'Evalúa si 5 grafos cumplen la condición.' },
        { key:'simulacion', emoji:'🎮', label:'Simulación', desc:'Construye tu grafo y evalúa Dirac con ReactFlow.' },
    ]
    return (
        <>
        <div className="euler-title animate-pop">
            <p className="euler-sup" style={{color:'#6366F1'}}>Camino de Hamilton</p>
            <h1>Teorema de <span style={{color:'#8B5CF6'}}>Dirac</span></h1>
            <p className="euler-sub">Una condición suficiente para asegurar que existe un ciclo que visita todos los vértices sin repetir.</p>
        </div>
        <section className="euler-grid">
            {items.map((it, i) => (
            <div key={it.key} className="euler-card animate-pop" style={{ animationDelay: `${0.15 + i * 0.1}s` }} onClick={() => ir(it.key)}>
                <div className="card-top"><span className="card-emoji">{it.emoji}</span><h2 className="card-title" style={{color:'#6366F1'}}>{it.label}</h2></div>
                <p className="card-desc">{it.desc}</p><div className="card-arrow" style={{color:'#6366F1'}}>→</div>
            </div>
            ))}
        </section>
        </>
    )
}

function Teoria() {
    return (
        <div className="euler-content animate-pop">
        <p className="euler-sup" style={{color:'#6366F1'}}>I · Teoría</p>
        <h1 className="content-title">El Teorema de <span style={{color:'#8B5CF6'}}>Dirac</span></h1>
        <p className="content-p">Publicado por Gabriel Andrew Dirac en 1952, establece una regla simple (condición suficiente) para saber si un grafo contiene un ciclo Hamiltoniano basándose solo en los grados de los vértices.</p>
        
        <div className="content-box" style={{ borderColor: 'rgba(99,102,241,0.5)' }}>
            <div className="box-label" style={{ color: '#6366F1' }}>El Teorema</div>
            <p>Sea <em>G</em> un grafo simple con <strong>n ≥ 3</strong> vértices.</p>
            <p>Si para <strong>TODO</strong> vértice <em>v</em> se cumple que su grado es mayor o igual a la mitad de los vértices:</p>
            <div style={{ textAlign:'center', margin:'1rem 0', fontSize:'1.3rem', fontWeight:'bold', color:'white'}}>
            deg(v) ≥ n/2
            </div>
            <p>Entonces, el grafo <em>G</em> es <strong>Hamiltoniano</strong> (contiene un ciclo hamiltoniano).</p>
        </div>

        <h2 className="content-h2" style={{color:'#8B5CF6'}}>Cosas a tener en cuenta</h2>
        <ul style={{ color:'rgba(255,255,255,0.7)', lineHeight:'1.8', marginLeft:'1.5rem' }}>
            <li>Es una condición <strong>suficiente, NO necesaria</strong>. Si un grafo NO cumple Dirac, <em>aún podría</em> ser hamiltoniano (ej. un pentágono).</li>
            <li>Fuerza a que el grafo sea muy denso (muchas aristas).</li>
            <li>Si se cumple, el grafo automáticamente es conexo.</li>
        </ul>
        </div>
    )
}

function QuizDirac() {
    const preguntas = useMemo(() => shuffle(QUIZ_DIRAC).slice(0, 5), [])
    const [idx, setIdx] = useState(0)
    const [seleccion, setSeleccion] = useState(null)
    const [respondido, setRespondido] = useState(false)
    const [aciertos, setAciertos] = useState(0)

    const preg = preguntas[idx]

    if (idx >= preguntas.length) {
        return (
        <div className="euler-content animate-pop">
            <h1 className="content-title">¡Quiz Terminado!</h1>
            <div className="quiz-score-big" style={{color:'#8B5CF6'}}>{aciertos}<span> / 5</span></div>
            <button className="btn-primary" style={{background:'#6366F1'}} onClick={() => window.location.reload()}>↻ Reiniciar Módulo</button>
        </div>
        )
    }

    return (
        <div className="euler-content animate-pop">
        <p className="euler-sup" style={{color:'#6366F1'}}>II · Quiz (Pregunta {idx+1}/5)</p>
        <h1 className="content-title">{preg.q}</h1>
        <div className="quiz-opts">
            {preg.opts.map((opt, i) => {
            let cls = 'quiz-opt'
            if (respondido && i === preg.a) cls += ' correct'
            else if (respondido && i === seleccion) cls += ' wrong'
            return (
                <button key={i} className={cls} onClick={() => { if(respondido)return; setSeleccion(i); setRespondido(true); if(i===preg.a) setAciertos(a=>a+1) }}>
                <span className="opt-letter" style={{color:'#8B5CF6'}}>{String.fromCharCode(97+i)}.</span> <span className="opt-text">{opt}</span>
                </button>
            )
            })}
        </div>
        {respondido && <button className="btn-primary" style={{background:'#6366F1', marginTop:'1rem'}} onClick={() => { setIdx(i=>i+1); setRespondido(false); setSeleccion(null) }}>Siguiente →</button>}
        </div>
    )
}

function EjerciciosDirac() {
    const ejercicios = useMemo(() => shuffle(EJERCICIOS_DIRAC).slice(0, 5), [])
    const [idx, setIdx] = useState(0)
    const [seleccion, setSeleccion] = useState(null)
    const [respondido, setRespondido] = useState(false)
    const [aciertos, setAciertos] = useState(0)

    if (idx >= ejercicios.length) {
        return (
        <div className="euler-content animate-pop">
            <h1 className="content-title">¡Ejercicios Completados!</h1>
            <div className="quiz-score-big" style={{color:'#8B5CF6'}}>{aciertos}<span> / 5</span></div>
            <button className="btn-primary" style={{background:'#6366F1'}} onClick={() => window.location.reload()}>↻ Reiniciar Módulo</button>
        </div>
        )
    }

    const ej = ejercicios[idx]

    return (
        <div className="euler-content animate-pop">
        <p className="euler-sup" style={{color:'#6366F1'}}>III · Ejercicios ({idx+1}/5)</p>
        <h1 className="content-title">{ej.titulo}</h1>
        <div className="ej-layout">
            <div className="ej-graph" style={{ borderColor: 'rgba(99,102,241,0.3)' }}>
            <svg viewBox="0 0 240 240" className="ej-svg">
                {ej.aristas.map(([a,b], i) => {
                const A = ej.nodos.find(n=>n.id===a), B = ej.nodos.find(n=>n.id===b)
                return <line key={i} x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
                })}
                {ej.nodos.map(n => {
                const grado = ej.aristas.filter(([a,b])=>a===n.id||b===n.id).length
                return (
                    <g key={n.id}>
                    <circle cx={n.x} cy={n.y} r="15" fill="#1a1a2e" stroke="#8B5CF6" strokeWidth="2" />
                    <text x={n.x} y={n.y+4} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">{grado}</text>
                    </g>
                )
                })}
            </svg>
            <p style={{textAlign:'center', color:'gray', fontSize:'0.8rem'}}>El número indica el grado (deg)</p>
            </div>
            <div className="ej-panel">
            <div className="ej-question">¿Este grafo cumple la condición del Teorema de Dirac? (n={ej.nodos.length})</div>
            <div className="quiz-opts" style={{marginTop:'1rem'}}>
                {ej.opts.map((opt, i) => {
                let cls = 'quiz-opt'
                if (respondido && i === ej.a) cls += ' correct'
                else if (respondido && i === seleccion) cls += ' wrong'
                return (
                    <button key={i} className={cls} onClick={() => { if(respondido)return; setSeleccion(i); setRespondido(true); if(i===ej.a) setAciertos(a=>a+1) }}>
                    <span className="opt-text">{opt}</span>
                    </button>
                )
                })}
            </div>
            {respondido && <div className="ej-expl" style={{background:'rgba(139,92,246,0.1)', borderColor:'#8B5CF6'}}><strong>Explicación:</strong> {ej.expl}</div>}
            {respondido && <button className="btn-primary" style={{background:'#6366F1'}} onClick={() => { setIdx(i=>i+1); setRespondido(false); setSeleccion(null) }}>Siguiente →</button>}
            </div>
        </div>
        </div>
    )
}

// ==========================================
// SIMULADOR CON REACT FLOW
// ==========================================
const NodoDirac = ({ data }) => (
    <div style={{ background: '#1a1a2e', border: `2px solid ${data.color}`, borderRadius: '50%', width: 45, height: 45, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 'bold', boxShadow: `0 0 10px ${data.color}50` }}>
        <Handle type="source" position={Position.Top} id="top" style={{ background: data.color, width:6, height:6 }} />
        <Handle type="source" position={Position.Right} id="right" style={{ background: data.color, width:6, height:6 }} />
        <Handle type="source" position={Position.Bottom} id="bottom" style={{ background: data.color, width:6, height:6 }} />
        <Handle type="source" position={Position.Left} id="left" style={{ background: data.color, width:6, height:6 }} />
        {data.label}
    </div>
);

function SimulacionDirac() {
    const [nodes, setNodes] = useState([])
    const [edges, setEdges] = useState([])
    const nodeTypes = useMemo(() => ({ nodoDirac: NodoDirac }), [])

    const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), [])
    const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), [])
    const onConnect = useCallback((params) => setEdges((eds) => addEdge({ ...params, animated: false, style: { stroke: '#8B5CF6', strokeWidth: 2 } }, eds)), [])

    const agregarNodo = () => {
        const id = `V${nodes.length + 1}`
        setNodes(ns => [...ns, { id, type: 'nodoDirac', position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 }, data: { label: id, color: '#6366F1' } }])
    }

    // Análisis de Dirac
    const n = nodes.length
    const mitad = n / 2
    
    // Calcular grados
    const grados = {}
    nodes.forEach(no => grados[no.id] = 0)
    edges.forEach(e => { if(grados[e.source]!==undefined) grados[e.source]++; if(grados[e.target]!==undefined) grados[e.target]++ })
    
    const minGrado = n > 0 ? Math.min(...Object.values(grados)) : 0
    const cumple = n >= 3 && minGrado >= mitad

    // Pintar nodos que no cumplen de rojo/rosa
    const nodosPintados = nodes.map(no => ({
        ...no, 
        data: { ...no.data, color: (n>=3 && grados[no.id] < mitad) ? '#ec4899' : '#10B981' }
    }))

    return (
        <div className="euler-content animate-pop" style={{ maxWidth: '1000px' }}>
        <p className="euler-sup" style={{color:'#6366F1'}}>IV · Simulación (ReactFlow)</p>
        <h1 className="content-title">Evaluador de Dirac</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', marginTop: '1rem' }}>
            <div style={{ height: '500px', background: '#0f172a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
            <ReactFlow 
                nodes={nodosPintados} 
                edges={edges} 
                onNodesChange={onNodesChange} 
                onEdgesChange={onEdgesChange} 
                onConnect={onConnect} 
                nodeTypes={nodeTypes} 
                connectionMode={ConnectionMode.Loose} 
                fitView
                >
                <Background color="rgba(255,255,255,0.05)" gap={20} />
                
                {/* Cambio aquí: solo llamamos al componente sin estilos en línea */}
                <Controls /> 
            </ReactFlow>
            </div>

            <div>
            <button className="btn-primary" style={{ width: '100%', marginBottom: '1rem', background: '#6366F1' }} onClick={agregarNodo}>+ Agregar Vértice</button>
            <button className="btn-primary" style={{ width: '100%', marginBottom: '2rem', background: 'transparent', border: '1px solid #ec4899', color: '#ec4899' }} onClick={() => {setNodes([]); setEdges([])}}>🗑 Limpiar</button>

            <div className="content-box" style={{ borderColor: cumple ? '#10B981' : '#ec4899', margin: 0, background: 'rgba(0,0,0,0.2)' }}>
                <div className="box-label" style={{ color: cumple ? '#10B981' : '#ec4899' }}>ANÁLISIS EN VIVO</div>
                <p style={{ margin: '0.5rem 0' }}><strong>Nodos (n):</strong> {n}</p>
                <p style={{ margin: '0.5rem 0' }}><strong>Mitad (n/2):</strong> {mitad}</p>
                <p style={{ margin: '0.5rem 0' }}><strong>Grado Mínimo:</strong> {minGrado}</p>
                <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '1rem 0' }} />
                
                {n < 3 ? (
                <p style={{ color: '#F59E0B', fontWeight: 'bold' }}>Se necesitan al menos 3 nodos (n ≥ 3).</p>
                ) : cumple ? (
                <p style={{ color: '#10B981', fontWeight: 'bold', fontSize: '1.2rem' }}>✓ CUMPLE DIRAC</p>
                ) : (
                <p style={{ color: '#ec4899', fontWeight: 'bold', fontSize: '1.2rem' }}>✕ NO CUMPLE DIRAC</p>
                )}
                <p style={{ fontSize: '0.8rem', color: 'gray', marginTop: '1rem' }}>Los vértices en rosa no cumplen deg(v) ≥ n/2.</p>
            </div>
            </div>
        </div>
        </div>
    )
}