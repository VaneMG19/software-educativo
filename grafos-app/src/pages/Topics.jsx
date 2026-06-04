import { useNavigate } from 'react-router-dom'
import '../styles/Topics.css'
import logoUV from '../assets/Logo_de_la_Universidad_Veracruzana.png'
import logoFIEE from '../assets/LogoFIEE.png'

import imgEuler from '../assets/euler.jpg'
import imgHamilton from '../assets/hamilton.png'
import imgDijkstra from '../assets/dijkstra.png'

const TOPICS = [
  {
    id: 'euler',
    title: 'Camino de Euler',
    emoji: '〰',
    description: 'Recorre todos los arcos de un grafo exactamente una vez. Aprende las condiciones de existencia y el algoritmo paso a paso.',
    color: '#0D9488',
    glow: 'rgba(13,148,136,0.35)',
    path: '/euler',
    image: imgEuler,
  },
  {
    id: 'hamilton',
    title: 'Camino de Hamilton',
    emoji: '🔷',
    description: 'Visita todos los vértices del grafo una sola vez. Incluye el Teorema de Dirac y el Teorema de Ore.',
    color: '#534AB7',
    glow: 'rgba(83,74,183,0.35)',
    path: '/hamilton',
    image: imgHamilton,
  },
  {
    id: 'dijkstra',
    title: 'Algoritmo de Dijkstra',
    emoji: '⚡',
    description: 'Encuentra el camino más corto entre dos nodos en un grafo ponderado. Visualiza el proceso en tiempo real.',
    color: '#F59E0B',
    glow: 'rgba(245,158,11,0.35)',
    path: '/dijkstra',
    image: imgDijkstra,
  },
]

export default function Topics() {
  const navigate = useNavigate()

  return (
    <div className="topics">

      {/* burbujas de fondo igual que Home */}
      <div className="bubble bubble-1" />
      <div className="bubble bubble-2" />
      <div className="bubble bubble-3" />
      <div className="bubble bubble-4" />

      {/* header con logos */}
      <header className="topics-header">
        <div className="logos">
          <img src={logoUV}   alt="Universidad Veracruzana" className="logo-img" />
          <div className="logo-divider" />
          <img src={logoFIEE} alt="FIEE" className="logo-img" />
        </div>
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Inicio
        </button>
      </header>

      {/* titulo */}
      <div className="topics-title animate-pop" style={{ animationDelay: '0s' }}>
        <p className="topics-sup">¿Qué quieres aprender hoy?</p>
        <h1>Elige un <span className="gradient-word">tema</span></h1>
      </div>

      {/* cards */}
      <section className="topics-grid">
        {TOPICS.map((topic, i) => (
          <div
            key={topic.id}
            className="topic-card animate-pop"
            style={{ '--c': topic.color, '--glow': topic.glow, animationDelay: `${0.1 + i * 0.12}s` }}
            onClick={() => navigate(topic.path)}
          >
            <div className="card-img-wrap">
                  <img src={topic.image} alt={topic.title} className="card-img" />
            </div>

            <div className="card-top">
              <span className="card-emoji">{topic.emoji}</span>
              <h2 className="card-title">{topic.title}</h2>
            </div>
            <p className="card-desc">{topic.description}</p>
          </div>
        ))}
      </section>

    </div>
  )
}