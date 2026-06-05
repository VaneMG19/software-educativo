import { useNavigate } from 'react-router-dom'
import '../styles/Euler.css' // Reutilizamos las clases de contenido de Euler
import logoUV from '../assets/Logo_de_la_Universidad_Veracruzana.png'
import logoFIEE from '../assets/LogoFIEE.png'

export default function HamiltonTeoria() {
    const navigate = useNavigate()

    return (
        <div className="euler" style={{ background: 'linear-gradient(135deg, #0f0c29, #1a1a2e, #231b4d)' }}>
            {/* Burbujas en tonos morados */}
            <div className="bubble bubble-1" style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)' }} />
            <div className="bubble bubble-2" style={{ background: 'radial-gradient(circle, #3B82F6, transparent)' }} />

            <header className="euler-header">
                <div className="logos">
                    <img src={logoUV} alt="UV" className="logo-img" />
                    <div className="logo-divider" />
                    <img src={logoFIEE} alt="FIEE" className="logo-img" />
                </div>
                <button className="back-btn" onClick={() => navigate('/temas/hamilton')}>
                    ← Menú Hamilton
                </button>
            </header>

            <div className="euler-content animate-pop">
                <p className="euler-sup">Conceptos Básicos</p>
                <h1 className="content-title">Camino y Ciclo de <span style={{color: '#8B5CF6'}}>Hamilton</span></h1>

                <p className="content-p">
                Mientras que Euler se preocupaba por recorrer todas las aristas, el matemático irlandés 
                <strong> William Rowan Hamilton</strong> planteó un problema diferente: 
                ¿Es posible visitar todas las ubicaciones (vértices) exactamente una vez?
                </p>

                <div className="content-box" style={{ borderColor: 'rgba(139,92,246,0.5)' }}>
                    <div className="box-label" style={{ color: '#8B5CF6' }}>Definiciones clave</div>
                    <ul>
                        <li><strong style={{color:'#8B5CF6'}}>Camino Hamiltoniano:</strong> Un recorrido en un grafo que visita <strong>cada vértice exactamente una vez</strong>.</li>
                        <li><strong style={{color:'#8B5CF6'}}>Ciclo Hamiltoniano:</strong> Un camino hamiltoniano que además es un ciclo (empieza y termina en el mismo vértice).</li>
                        <li><strong style={{color:'#8B5CF6'}}>Grafo Hamiltoniano:</strong> Todo grafo que contiene al menos un ciclo hamiltoniano.</li>
                    </ul>
                </div>

                <h2 className="content-h2"><span className="content-section-num" style={{color:'#8B5CF6'}}>§1</span> La gran diferencia con Euler</h2>
                <p className="content-p">
                Saber si un grafo es Euleriano es fácil: solo miramos si los grados son pares (complejidad <em>P</em>). 
                Sin embargo, determinar si un grafo es Hamiltoniano es un problema <strong>NP-Completo</strong>. 
                No existe (hasta hoy) una fórmula rápida que funcione para todos los grafos.
                </p>

                <h2 className="content-h2"><span className="content-section-num" style={{color:'#8B5CF6'}}>§2</span> Condiciones Suficientes</h2>
                <p className="content-p">
                    Debido a la dificultad de encontrar una regla universal, los matemáticos desarrollaron 
                    <strong> condiciones suficientes</strong>. Esto significa que si un grafo cumple ciertas reglas de cantidad 
                    de aristas o grados, <em>garantizamos</em> que es Hamiltoniano. Las dos más famosas son el 
                    <strong> Teorema de Dirac</strong> y el <strong> Teorema de Ore</strong>.
                </p>
            </div>
        </div>
    )
}