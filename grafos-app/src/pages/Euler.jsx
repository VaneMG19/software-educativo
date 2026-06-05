import { useState, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Euler.css'
import logoUV from '../assets/Logo_de_la_Universidad_Veracruzana.png'
import logoFIEE from '../assets/LogoFIEE.png'

/* =====================================================================
   CAMINO DE EULER — Sección 3 (Vanesa)
   Matemáticas Discretas II · 2026
   ===================================================================== */

// ─── 20 preguntas del quiz (se barajan al inicio en 4 rondas de 5) ───
const QUIZ = [
  { q: '¿Qué es un camino de Euler en un grafo?', opts: [
    'Un recorrido que pasa por cada vértice exactamente una vez',
    'Un recorrido que pasa por cada arista exactamente una vez',
    'El camino más corto entre dos vértices',
    'Cualquier recorrido cerrado en el grafo',
  ], a: 1 },
  { q: '¿Qué es un circuito de Euler?', opts: [
    'Cualquier ciclo dentro de un grafo',
    'Un camino que visita todos los vértices y vuelve al inicio',
    'Un camino euleriano que empieza y termina en el mismo vértice',
    'Un camino sin vértices repetidos',
  ], a: 2 },
  { q: '¿Quién resolvió el problema de los puentes de Königsberg?', opts: [
    'Carl Friedrich Gauss', 'Leonhard Euler', 'William Hamilton', 'Isaac Newton'
  ], a: 1 },
  { q: '¿Cuál es la condición para que un grafo conexo tenga circuito euleriano?', opts: [
    'Que todos los vértices tengan grado par',
    'Que todos los vértices tengan grado impar',
    'Que sea bipartito',
    'Que tenga al menos 3 vértices',
  ], a: 0 },
  { q: '¿Cuántos vértices de grado impar puede tener un grafo con camino euleriano (que no sea circuito)?', opts: [
    'Cero', 'Exactamente 2', 'Exactamente 4', 'Cualquier número par'
  ], a: 1 },
  { q: 'En el problema histórico de Königsberg, ¿cuántos puentes había?', opts: [
    '5', '6', '7', '8'
  ], a: 2 },
  { q: '¿Qué representa el "grado" de un vértice en un grafo no dirigido?', opts: [
    'Su importancia o peso',
    'El número de aristas que inciden en él',
    'La distancia al vértice más lejano',
    'El número de caminos que pasan por él',
  ], a: 1 },
  { q: 'Si un grafo conexo tiene exactamente 2 vértices de grado impar, ¿qué podemos afirmar?', opts: [
    'Tiene circuito euleriano',
    'Tiene camino euleriano pero no circuito',
    'No tiene ningún recorrido euleriano',
    'Es necesariamente un árbol',
  ], a: 1 },
  { q: 'La suma de los grados de todos los vértices de un grafo con m aristas es:', opts: [
    'm', '2m', 'm/2', 'm²'
  ], a: 1 },
  { q: '¿Un camino de Euler puede repetir vértices?', opts: [
    'No, nunca',
    'Sí, puede pasar por el mismo vértice varias veces',
    'Solo si el grafo es dirigido',
    'Solo si es un circuito cerrado',
  ], a: 1 },
  { q: '¿Un camino de Euler puede repetir aristas?', opts: [
    'Sí, todas las que sean necesarias',
    'No, cada arista se recorre exactamente una vez',
    'Solo aristas con peso bajo',
    'Sí, pero máximo dos veces cada una',
  ], a: 1 },
  { q: 'En cualquier grafo, ¿cuántos vértices de grado impar puede haber?', opts: [
    'Siempre un número par',
    'Siempre un número impar',
    'Siempre cero',
    'Depende del número total de vértices',
  ], a: 0 },
  { q: 'En un grafo dirigido, ¿qué se requiere para que haya circuito euleriano?', opts: [
    'Que sea acíclico',
    'Que cada vértice tenga grado de entrada igual al de salida',
    'Que tenga exactamente un vértice fuente',
    'Que sea bipartito',
  ], a: 1 },
  { q: 'Un grafo conexo con vértices de grados {2, 2, 3, 3}:', opts: [
    'Tiene circuito de Euler',
    'Tiene camino de Euler pero no circuito',
    'No tiene ningún recorrido euleriano',
    'No puede existir',
  ], a: 1 },
  { q: '¿Qué hace el algoritmo de Fleury?', opts: [
    'Colorea grafos planares',
    'Encuentra un camino o circuito euleriano',
    'Construye árboles de expansión mínima',
    'Detecta ciclos hamiltonianos',
  ], a: 1 },
  { q: '¿Es posible que un grafo tenga exactamente 3 vértices de grado impar?', opts: [
    'Sí, en grafos pequeños',
    'No, por el lema del apretón de manos',
    'Solo en grafos dirigidos',
    'Solo en grafos no conexos',
  ], a: 1 },
  { q: 'En un circuito euleriano, el vértice inicial y final son:', opts: [
    'Vértices adyacentes',
    'El mismo vértice',
    'Vértices de máximo grado',
    'No tienen relación específica',
  ], a: 1 },
  { q: 'El grafo K₄ (completo de 4 vértices) tiene:', opts: [
    'Circuito euleriano',
    'Camino euleriano pero no circuito',
    'Ningún recorrido euleriano (4 vértices de grado 3)',
    'Es un árbol',
  ], a: 2 },
  { q: 'Un ciclo Cₙ (con n ≥ 3):', opts: [
    'Siempre tiene circuito euleriano',
    'Solo tiene camino euleriano',
    'No tiene recorrido euleriano',
    'Depende de la paridad de n',
  ], a: 0 },
  { q: 'Para que un grafo conexo tenga algún recorrido euleriano se necesita:', opts: [
    'Que tenga 0 o 2 vértices de grado impar',
    'Que todos los vértices tengan el mismo grado',
    'Que tenga al menos 4 vértices',
    'Que sea bipartito',
  ], a: 0 },
]

// ─── 5 ejercicios con grafos pequeños ───
const EJERCICIOS = [
  {
    titulo: 'Triángulo simple',
    nodos: [{id:'A',x:120,y:60},{id:'B',x:60,y:170},{id:'C',x:180,y:170}],
    aristas: [['A','B'],['B','C'],['A','C']],
    pista: 'Cuenta el grado de cada vértice.',
    opts: ['Circuito euleriano', 'Solo camino euleriano', 'Ninguno'],
    a: 0,
    expl: 'Todos los vértices tienen grado 2 (par). Por tanto, existe circuito euleriano.',
  },
  {
    titulo: 'Cuadrado conectado',
    nodos: [{id:'A',x:40,y:120},{id:'B',x:120,y:60},{id:'C',x:120,y:180},{id:'D',x:200,y:120}],
    aristas: [['A','B'],['A','C'],['B','D'],['C','D']],
    pista: 'Revisa cuántos vértices tienen grado impar.',
    opts: ['Circuito euleriano', 'Solo camino euleriano', 'Ninguno'],
    a: 0,
    expl: 'Grados: A=2, B=2, C=2, D=2. Todos pares → existe circuito euleriano.',
  },
  {
    titulo: 'Grafo K₄',
    nodos: [{id:'A',x:60,y:60},{id:'B',x:180,y:60},{id:'C',x:60,y:180},{id:'D',x:180,y:180}],
    aristas: [['A','B'],['A','C'],['A','D'],['B','C'],['B','D'],['C','D']],
    pista: 'En K₄ cada vértice se conecta con los otros tres.',
    opts: ['Circuito euleriano', 'Solo camino euleriano', 'Ninguno'],
    a: 2,
    expl: 'Cada vértice de K₄ tiene grado 3. Hay 4 vértices de grado impar → no hay recorrido euleriano.',
  },
  {
    titulo: 'Cuadrado con una diagonal',
    nodos: [{id:'A',x:60,y:60},{id:'B',x:180,y:60},{id:'C',x:180,y:180},{id:'D',x:60,y:180}],
    aristas: [['A','B'],['B','C'],['C','D'],['D','A'],['A','C']],
    pista: '¿Cuántos vértices tienen grado impar?',
    opts: ['Circuito euleriano', 'Solo camino euleriano', 'Ninguno'],
    a: 1,
    expl: 'Grados: A=3, B=2, C=3, D=2. Hay exactamente 2 impares → camino euleriano (de A a C o viceversa).',
  },
  {
    titulo: 'Mariposa',
    nodos: [{id:'A',x:40,y:60},{id:'B',x:40,y:180},{id:'C',x:130,y:120},{id:'D',x:220,y:60},{id:'E',x:220,y:180}],
    aristas: [['A','B'],['A','C'],['B','C'],['C','D'],['C','E'],['D','E']],
    pista: 'El vértice central conecta los dos triángulos.',
    opts: ['Circuito euleriano', 'Solo camino euleriano', 'Ninguno'],
    a: 0,
    expl: 'Grados: A=2, B=2, C=4, D=2, E=2. Todos pares → existe circuito euleriano.',
  },
]

// ─── helpers ───
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function analizarEuler(nodes, edges) {
  if (nodes.length === 0) return { tipo: 'vacio', titulo: 'Lienzo vacío', texto: 'Toca el lienzo para crear vértices.' }
  if (edges.length === 0) return { tipo: 'vacio', titulo: 'Sin aristas', texto: 'Conecta vértices para analizar el grafo.' }

  const adj = {}
  nodes.forEach(n => adj[n.id] = [])
  edges.forEach(e => { adj[e.a].push(e.b); adj[e.b].push(e.a) })

  const conAristas = nodes.filter(n => adj[n.id].length > 0)
  const visit = new Set([conAristas[0].id])
  const queue = [conAristas[0].id]
  while (queue.length) {
    const cur = queue.shift()
    adj[cur].forEach(nb => { if (!visit.has(nb)) { visit.add(nb); queue.push(nb) } })
  }
  if (visit.size !== conAristas.length) {
    return { tipo: 'no-conexo', titulo: 'Grafo no conexo', texto: 'El subgrafo con aristas no es conexo: no existe camino euleriano.', grados: Object.fromEntries(nodes.map(n => [n.id, adj[n.id].length])) }
  }

  const grados = {}
  nodes.forEach(n => grados[n.id] = adj[n.id].length)
  const impares = nodes.filter(n => grados[n.id] % 2 === 1)

  if (impares.length === 0) {
    return { tipo: 'circuito', titulo: '¡Circuito euleriano!', texto: 'Todos los vértices tienen grado par. Existe un recorrido cerrado que usa cada arista exactamente una vez.', grados, impares }
  }
  if (impares.length === 2) {
    return { tipo: 'camino', titulo: '¡Camino euleriano!', texto: `Hay exactamente 2 vértices de grado impar (${impares.map(n=>n.label).join(' y ')}). El recorrido debe empezar en uno y terminar en el otro.`, grados, impares }
  }
  return { tipo: 'ninguno', titulo: 'Sin recorrido euleriano', texto: `Hay ${impares.length} vértices de grado impar. Para que exista camino euleriano debe haber 0 o 2.`, grados, impares }
}

// =====================================================================
// COMPONENTE PRINCIPAL
// =====================================================================
export default function Euler() {
  const navigate = useNavigate()
  const [vista, setVista] = useState('menu')

  return (
    <div className="euler">
      {/* burbujas de fondo (mismo patrón que Home/Topics) */}
      <div className="bubble bubble-1" />
      <div className="bubble bubble-2" />
      <div className="bubble bubble-3" />
      <div className="bubble bubble-4" />

      {/* header */}
      <header className="euler-header">
        <div className="logos">
          <img src={logoUV} alt="Universidad Veracruzana" className="logo-img" />
          <div className="logo-divider" />
          <img src={logoFIEE} alt="FIEE" className="logo-img" />
        </div>
        <button
          className="back-btn"
          onClick={() => vista === 'menu' ? navigate('/temas') : setVista('menu')}
        >
          ← {vista === 'menu' ? 'Temas' : 'Camino de Euler'}
        </button>
      </header>

      {vista === 'menu' && <Menu ir={setVista} />}
      {vista === 'teoria' && <Teoria />}
      {vista === 'quiz' && <Quiz />}
      {vista === 'ejercicios' && <Ejercicios />}
      {vista === 'simulacion' && <Simulacion />}
    </div>
  )
}

// =====================================================================
// MENÚ DE EULER
// =====================================================================
function Menu({ ir }) {
  const items = [
    { key:'teoria',     emoji:'📖', label:'Teoría',     desc:'Definiciones, teorema de Euler y los puentes de Königsberg.' },
    { key:'quiz',       emoji:'❓', label:'Quiz',       desc:'20 preguntas en 4 rondas de 5, sin repetir.' },
    { key:'ejercicios', emoji:'✏️', label:'Ejercicios', desc:'5 grafos para identificar si tienen camino o circuito.' },
    { key:'simulacion', emoji:'✨', label:'Simulación', desc:'Dibuja tu propio grafo y analízalo en vivo.' },
  ]

  return (
    <>
      <div className="euler-title animate-pop" style={{ animationDelay: '0s' }}>
        <p className="euler-sup">Sección 3 · Matemáticas Discretas II</p>
        <h1>Camino de <span className="gradient-word">Euler</span></h1>
        <p className="euler-sub">
          Un recorrido que atraviesa cada arista del grafo exactamente una vez —
          la pregunta que en 1736 inauguró la teoría de grafos.
        </p>
      </div>

      <section className="euler-grid">
        {items.map((it, i) => (
          <div
            key={it.key}
            className="euler-card animate-pop"
            style={{ animationDelay: `${0.15 + i * 0.1}s` }}
            onClick={() => ir(it.key)}
          >
            <div className="card-top">
              <span className="card-emoji">{it.emoji}</span>
              <h2 className="card-title">{it.label}</h2>
            </div>
            <p className="card-desc">{it.desc}</p>
            <div className="card-arrow">→</div>
          </div>
        ))}
      </section>
    </>
  )
}

// =====================================================================
// TEORÍA
// =====================================================================
function Teoria() {
  return (
    <div className="euler-content animate-pop">
      <p className="euler-sup">I · Teoría</p>
      <h1 className="content-title">Fundamentos</h1>

      <p className="content-p">
        Un <strong>camino de Euler</strong> en un grafo no dirigido es un recorrido que utiliza
        <strong> cada arista exactamente una vez</strong>. Si además empieza y termina en el mismo vértice,
        se llama <strong>circuito de Euler</strong>.
      </p>

      <div className="content-box">
        <div className="box-label">Definiciones clave</div>
        <ul>
          <li><em>Grado</em> de un vértice: número de aristas que inciden en él.</li>
          <li><em>Camino euleriano</em>: usa todas las aristas sin repetir, con vértices inicial y final distintos.</li>
          <li><em>Circuito euleriano</em>: usa todas las aristas sin repetir, con vértices inicial y final iguales.</li>
        </ul>
      </div>

      <h2 className="content-h2"><span className="content-section-num">§1</span> Teorema de Euler</h2>
      <p className="content-p">Sea <em>G</em> un grafo conexo. Entonces:</p>
      <div className="content-box">
        <div className="box-label">Condiciones</div>
        <p><strong>Circuito euleriano</strong> ⟺ todos los vértices tienen grado <strong>par</strong>.</p>
        <p style={{ marginTop: '0.6rem' }}>
          <strong>Camino euleriano (no circuito)</strong> ⟺ existen exactamente <strong>2 vértices</strong> de grado impar.
          El recorrido debe empezar en uno y terminar en el otro.
        </p>
      </div>

      <h2 className="content-h2"><span className="content-section-num">§2</span> Lema del apretón de manos</h2>
      <p className="content-p">
        En cualquier grafo, la suma de los grados de los vértices es igual a <strong>2m</strong>,
        donde <em>m</em> es el número de aristas. Como consecuencia, el número de vértices con grado impar
        siempre es <strong>par</strong>.
      </p>

      <h2 className="content-h2"><span className="content-section-num">§3</span> Los puentes de Königsberg</h2>
      <p className="content-p">
        En 1736, Leonhard Euler analizó el problema de la ciudad prusiana de Königsberg, atravesada por el río Pregel
        con cuatro zonas de tierra unidas por siete puentes. La pregunta era: ¿se puede dar un paseo cruzando cada puente
        exactamente una vez? Euler modeló la ciudad como un grafo y demostró que <strong>no</strong>: los cuatro nodos tenían grado impar.
      </p>

      <div className="content-figure">
        <svg viewBox="0 0 460 240" className="figure-svg">
          <path d="M 0 90 Q 230 70 460 90 L 460 150 Q 230 170 0 150 Z" fill="rgba(13,148,136,0.08)" />
          {[
            { x:100, y:50, l:'A' },
            { x:230, y:120, l:'B' },
            { x:360, y:50, l:'C' },
            { x:230, y:190, l:'D' },
          ].map((n) => (
            <g key={n.l}>
              <circle cx={n.x} cy={n.y} r="22" fill="#fff" stroke="#0D9488" strokeWidth="2" />
              <text x={n.x} y={n.y + 6} textAnchor="middle" fontFamily="Segoe UI" fontWeight="700" fontSize="17" fill="#0D9488">{n.l}</text>
            </g>
          ))}
          <path d="M 115 60 Q 170 30 215 110" fill="none" stroke="#5DCAA5" strokeWidth="2.2" />
          <path d="M 110 65 Q 160 105 215 115" fill="none" stroke="#5DCAA5" strokeWidth="2.2" />
          <path d="M 245 115 Q 300 105 345 65" fill="none" stroke="#5DCAA5" strokeWidth="2.2" />
          <path d="M 250 110 Q 290 30 350 60" fill="none" stroke="#5DCAA5" strokeWidth="2.2" />
          <path d="M 100 70 Q 130 210 215 185" fill="none" stroke="#5DCAA5" strokeWidth="2.2" />
          <path d="M 360 70 Q 330 210 250 185" fill="none" stroke="#5DCAA5" strokeWidth="2.2" />
          <path d="M 230 140 L 230 170" fill="none" stroke="#5DCAA5" strokeWidth="2.2" />
          <text x="230" y="225" textAnchor="middle" fontFamily="Segoe UI" fontSize="11" fill="rgba(255,255,255,0.55)">
            grados: A=3, B=5, C=3, D=3 — todos impares
          </text>
        </svg>
      </div>

      <h2 className="content-h2"><span className="content-section-num">§4</span> Ejemplo resuelto</h2>
      <p className="content-p">
        Considera el cuadrado <em>ABCD</em> con una diagonal <em>AC</em>. Los grados son:
        A=3, B=2, C=3, D=2. Hay <strong>dos</strong> vértices de grado impar (A y C),
        por lo tanto existe un camino euleriano que debe empezar en A y terminar en C (o viceversa).
        Por ejemplo: <code className="content-code">A → B → C → D → A → C</code>.
      </p>
    </div>
  )
}

// =====================================================================
// QUIZ
// =====================================================================
function Quiz() {
  const ordenInicial = useMemo(() => shuffle(QUIZ.map((_, i) => i)), [])
  const [orden, setOrden] = useState(ordenInicial)
  const [idx, setIdx] = useState(0)
  const [seleccion, setSeleccion] = useState(null)
  const [respondido, setRespondido] = useState(false)
  const [aciertos, setAciertos] = useState(0)
  const [historialRonda, setHistorialRonda] = useState([])
  const [terminado, setTerminado] = useState(false)

  const ronda = Math.floor(idx / 5) + 1
  const posEnRonda = idx % 5
  const preguntaActual = QUIZ[orden[idx]]

  function elegir(i) {
    if (respondido) return
    setSeleccion(i)
    setRespondido(true)
    if (i === preguntaActual.a) setAciertos(a => a + 1)
  }

  function siguiente() {
    if (idx === 19) { setTerminado(true); return }
    if (posEnRonda === 4) {
      const aciertosRonda = aciertos - historialRonda.reduce((s,n)=>s+n,0)
      setHistorialRonda(h => [...h, aciertosRonda])
    }
    setIdx(i => i + 1)
    setSeleccion(null)
    setRespondido(false)
  }

  function reiniciar() {
    setOrden(shuffle(QUIZ.map((_, i) => i)))
    setIdx(0); setSeleccion(null); setRespondido(false)
    setAciertos(0); setHistorialRonda([]); setTerminado(false)
  }

  if (terminado) {
    const ultimaRonda = aciertos - historialRonda.reduce((s,n)=>s+n,0)
    const todas = [...historialRonda, ultimaRonda]
    return (
      <div className="euler-content animate-pop">
        <p className="euler-sup">II · Quiz</p>
        <h1 className="content-title">Resultados</h1>
        <div className="quiz-score-big">
          {aciertos}<span> / 20</span>
        </div>
        <p className="content-p">
          {aciertos >= 17 ? '¡Excelente dominio del tema!' :
           aciertos >= 13 ? 'Buen trabajo, repasa la teoría para mejorar.' :
           aciertos >= 8 ? 'Vas por buen camino, refuerza las condiciones.' :
           'Conviene revisar la teoría antes de continuar.'}
        </p>
        <div className="quiz-rounds">
          {todas.map((n, i) => (
            <div className="quiz-round" key={i}>
              <div className="round-label">RONDA {i+1}</div>
              <div className="round-score">{n}<span>/5</span></div>
            </div>
          ))}
        </div>
        <button className="btn-primary" onClick={reiniciar}>↻ Volver a intentar</button>
      </div>
    )
  }

  return (
    <div className="euler-content animate-pop">
      <p className="euler-sup">II · Quiz · Ronda {ronda} de 4</p>
      <h1 className="content-title">Pregunta {idx + 1}</h1>

      <div className="quiz-progress">
        {Array.from({ length: 20 }).map((_, i) => {
          const activo = i === idx
          const hecho = i < idx
          const finRonda = (i + 1) % 5 === 0
          return (
            <div
              key={i}
              className={`progress-tick ${activo ? 'active' : ''} ${hecho ? 'done' : ''}`}
              style={{ marginRight: finRonda && i !== 19 ? '12px' : 0 }}
            />
          )
        })}
      </div>

      <div className="quiz-question">{preguntaActual.q}</div>

      <div className="quiz-opts">
        {preguntaActual.opts.map((opt, i) => {
          const esCorrecta = i === preguntaActual.a
          const esSel = i === seleccion
          let cls = 'quiz-opt'
          if (respondido) {
            if (esCorrecta) cls += ' correct'
            else if (esSel) cls += ' wrong'
          }
          return (
            <button key={i} className={cls} onClick={() => elegir(i)} disabled={respondido}>
              <span className="opt-letter">{String.fromCharCode(97 + i)}.</span>
              <span className="opt-text">{opt}</span>
              {respondido && esCorrecta && <span className="opt-icon">✓</span>}
              {respondido && esSel && !esCorrecta && <span className="opt-icon">✕</span>}
            </button>
          )
        })}
      </div>

      {respondido && (
        <div className="quiz-feedback">
          <span className="feedback-text">
            {seleccion === preguntaActual.a ? '✓ Correcto.' : `Respuesta correcta: ${String.fromCharCode(97 + preguntaActual.a)}.`}
          </span>
          <button className="btn-primary" onClick={siguiente}>
            {idx === 19 ? 'Ver resultados' : posEnRonda === 4 ? 'Cerrar ronda →' : 'Siguiente →'}
          </button>
        </div>
      )}

      <div className="quiz-counter">
        ACIERTOS: {aciertos} / {idx + (respondido ? 1 : 0)}
      </div>
    </div>
  )
}

// =====================================================================
// EJERCICIOS
// =====================================================================
function Ejercicios() {
  const [i, setI] = useState(0)
  const [seleccion, setSeleccion] = useState(null)
  const [respondido, setRespondido] = useState(false)
  const [aciertos, setAciertos] = useState(0)
  const [terminado, setTerminado] = useState(false)

  const ej = EJERCICIOS[i]

  function elegir(idx) {
    if (respondido) return
    setSeleccion(idx)
    setRespondido(true)
    if (idx === ej.a) setAciertos(a => a + 1)
  }
  function siguiente() {
    if (i === EJERCICIOS.length - 1) { setTerminado(true); return }
    setI(i + 1); setSeleccion(null); setRespondido(false)
  }
  function reiniciar() {
    setI(0); setSeleccion(null); setRespondido(false); setAciertos(0); setTerminado(false)
  }

  if (terminado) {
    return (
      <div className="euler-content animate-pop">
        <p className="euler-sup">III · Ejercicios</p>
        <h1 className="content-title">¡Completados!</h1>
        <div className="quiz-score-big">{aciertos}<span> / 5</span></div>
        <p className="content-p">
          {aciertos === 5 ? 'Dominas la identificación de recorridos eulerianos.' :
           aciertos >= 3 ? 'Bien, repasa los casos en los que fallaste.' :
           'Vale la pena volver a la teoría antes de intentar otra vez.'}
        </p>
        <button className="btn-primary" onClick={reiniciar}>↻ Volver a hacerlos</button>
      </div>
    )
  }

  return (
    <div className="euler-content animate-pop">
      <p className="euler-sup">III · Ejercicios · {i+1}/5</p>
      <h1 className="content-title">{ej.titulo}</h1>

      <div className="ej-layout">
        <div className="ej-graph">
          <GrafoSVG nodos={ej.nodos} aristas={ej.aristas} resaltarImpares={respondido} />
        </div>

        <div className="ej-panel">
          <div className="ej-question">¿Qué tipo de recorrido euleriano admite este grafo?</div>
          <div className="ej-hint">Pista: {ej.pista}</div>

          <div className="quiz-opts">
            {ej.opts.map((opt, idx) => {
              const esCorrecta = idx === ej.a
              const esSel = idx === seleccion
              let cls = 'quiz-opt'
              if (respondido) {
                if (esCorrecta) cls += ' correct'
                else if (esSel) cls += ' wrong'
              }
              return (
                <button key={idx} className={cls} onClick={() => elegir(idx)} disabled={respondido}>
                  <span className="opt-letter">{String.fromCharCode(97 + idx)}.</span>
                  <span className="opt-text">{opt}</span>
                  {respondido && esCorrecta && <span className="opt-icon">✓</span>}
                  {respondido && esSel && !esCorrecta && <span className="opt-icon">✕</span>}
                </button>
              )
            })}
          </div>

          {respondido && (
            <div className="ej-expl">
              <strong>Explicación.</strong> {ej.expl}
            </div>
          )}

          {respondido && (
            <button className="btn-primary" onClick={siguiente}>
              {i === EJERCICIOS.length - 1 ? 'Ver resultado final →' : 'Siguiente →'}
            </button>
          )}
        </div>
      </div>

      <div className="quiz-counter">
        ACIERTOS: {aciertos} / {i + (respondido ? 1 : 0)}
      </div>
    </div>
  )
}

function GrafoSVG({ nodos, aristas, resaltarImpares }) {
  const grados = {}
  nodos.forEach(n => grados[n.id] = 0)
  aristas.forEach(([a,b]) => { grados[a]++; grados[b]++ })
  const posById = Object.fromEntries(nodos.map(n => [n.id, n]))

  return (
    <svg viewBox="0 0 240 240" className="ej-svg">
      <defs>
        <pattern id="gridEj" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="240" height="240" fill="url(#gridEj)" />
      {aristas.map(([a,b], i) => {
        const A = posById[a], B = posById[b]
        return <line key={i} x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="rgba(255,255,255,0.55)" strokeWidth="2" />
      })}
      {nodos.map(n => {
        const impar = grados[n.id] % 2 === 1
        const colorBorde = resaltarImpares && impar ? '#ec4899' : '#0D9488'
        return (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r="17" fill="#fff" stroke={colorBorde} strokeWidth={resaltarImpares && impar ? 2.5 : 2} />
            <text x={n.x} y={n.y + 5} textAnchor="middle" fontFamily="Segoe UI" fontWeight="700" fontSize="14" fill={colorBorde}>{n.id}</text>
            <text x={n.x + 18} y={n.y - 14} fontFamily="Segoe UI" fontSize="10" fill="rgba(255,255,255,0.55)" fontWeight="600">{grados[n.id]}</text>
          </g>
        )
      })}
    </svg>
  )
}

// =====================================================================
// SIMULACIÓN
// =====================================================================
function Simulacion() {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [modo, setModo] = useState('agregar')
  const [seleccionado, setSeleccionado] = useState(null)
  const svgRef = useRef(null)

  const analisis = useMemo(() => analizarEuler(nodes, edges), [nodes, edges])

  function siguienteLetra() {
    const usadas = new Set(nodes.map(n => n.label))
    for (let i = 0; i < 26; i++) {
      const l = String.fromCharCode(65 + i)
      if (!usadas.has(l)) return l
    }
    return 'X' + nodes.length
  }

  function coordsLocales(evt) {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const pt = svg.createSVGPoint()
    pt.x = evt.clientX; pt.y = evt.clientY
    const ctm = svg.getScreenCTM().inverse()
    const loc = pt.matrixTransform(ctm)
    return { x: loc.x, y: loc.y }
  }

  function clickLienzo(evt) {
    if (modo !== 'agregar') return
    const { x, y } = coordsLocales(evt)
    if (nodes.some(n => Math.hypot(n.x - x, n.y - y) < 35)) return
    const id = 'n' + Date.now() + Math.random().toString(36).slice(2,6)
    setNodes(ns => [...ns, { id, x, y, label: siguienteLetra() }])
  }

  function clickNodo(node, evt) {
    evt.stopPropagation()
    if (modo === 'borrar') {
      setNodes(ns => ns.filter(n => n.id !== node.id))
      setEdges(es => es.filter(e => e.a !== node.id && e.b !== node.id))
      return
    }
    if (modo === 'conectar') {
      if (!seleccionado) { setSeleccionado(node.id); return }
      if (seleccionado === node.id) { setSeleccionado(null); return }
      const ya = edges.some(e => (e.a===seleccionado && e.b===node.id) || (e.a===node.id && e.b===seleccionado))
      if (!ya) setEdges(es => [...es, { a: seleccionado, b: node.id }])
      setSeleccionado(null)
    }
  }

  function limpiar() {
    setNodes([]); setEdges([]); setSeleccionado(null)
  }

  return (
    <div className="euler-content animate-pop">
      <p className="euler-sup">IV · Simulación</p>
      <h1 className="content-title">Lienzo de grafos</h1>

      <div className="sim-toolbar">
        <button className={`tool-btn ${modo==='agregar'?'active':''}`} onClick={()=>{setModo('agregar');setSeleccionado(null)}}>
          ➕ Añadir vértice
        </button>
        <button className={`tool-btn ${modo==='conectar'?'active':''}`} onClick={()=>{setModo('conectar');setSeleccionado(null)}}>
          🔗 Conectar
        </button>
        <button className={`tool-btn ${modo==='borrar'?'active':''}`} onClick={()=>{setModo('borrar');setSeleccionado(null)}}>
          🧽 Borrar
        </button>
        <button className="tool-btn tool-danger" onClick={limpiar}>
          🗑 Limpiar todo
        </button>
      </div>

      <p className="sim-hint">
        {modo === 'agregar' && 'Toca el lienzo para crear un vértice.'}
        {modo === 'conectar' && (seleccionado ? 'Ahora toca otro vértice para crear la arista.' : 'Toca un vértice para empezar a conectar.')}
        {modo === 'borrar' && 'Toca un vértice para eliminarlo (también sus aristas).'}
      </p>

      <div className="sim-layout">
        <svg
          ref={svgRef}
          viewBox="0 0 600 420"
          onClick={clickLienzo}
          className={`sim-canvas mode-${modo}`}
        >
          <defs>
            <pattern id="gridSim" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="600" height="420" fill="url(#gridSim)" />

          {edges.map((e, i) => {
            const A = nodes.find(n => n.id === e.a)
            const B = nodes.find(n => n.id === e.b)
            if (!A || !B) return null
            return <line key={i} x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="rgba(255,255,255,0.6)" strokeWidth="2.2" />
          })}

          {nodes.map(n => {
            const grado = edges.filter(e => e.a === n.id || e.b === n.id).length
            const impar = grado % 2 === 1
            const sel = seleccionado === n.id
            const stroke = sel ? '#F59E0B' : (impar && analisis.tipo !== 'vacio') ? '#ec4899' : '#0D9488'
            return (
              <g key={n.id} onClick={(e) => clickNodo(n, e)} className="sim-node">
                <circle cx={n.x} cy={n.y} r="22" fill="#fff" stroke={stroke} strokeWidth={sel ? 3.5 : 2.2} />
                <text x={n.x} y={n.y + 6} textAnchor="middle" fontFamily="Segoe UI" fontWeight="700" fontSize="17" fill={stroke}>
                  {n.label}
                </text>
                <text x={n.x + 22} y={n.y - 18} fontFamily="Segoe UI" fontSize="11" fill="rgba(255,255,255,0.65)" fontWeight="600">
                  {grado}
                </text>
              </g>
            )
          })}
        </svg>

        <div className="sim-panel">
          <div className="panel-label">ANÁLISIS EN VIVO</div>
          <div className={`panel-card panel-${analisis.tipo}`}>
            <div className="panel-title">{analisis.titulo}</div>
            <p className="panel-text">{analisis.texto}</p>

            {analisis.grados && Object.keys(analisis.grados).length > 0 && (
              <>
                <div className="panel-sep" />
                <div className="panel-sublabel">GRADOS</div>
                <div className="panel-chips">
                  {nodes.map(n => {
                    const g = analisis.grados[n.id] ?? 0
                    const impar = g % 2 === 1
                    return (
                      <span key={n.id} className={`chip ${impar ? 'chip-odd' : ''}`}>
                        {n.label}:{g}
                      </span>
                    )
                  })}
                </div>
              </>
            )}
          </div>

          <div className="panel-stats">
            <div><span>Vértices</span><strong>{nodes.length}</strong></div>
            <div><span>Aristas</span><strong>{edges.length}</strong></div>
          </div>
        </div>
      </div>
    </div>
  )
}
