import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Home.css'
import logoUV from '../assets/Logo_de_la_Universidad_Veracruzana.png'
import logoFIEE from '../assets/LogoFIEE.png'

export default function Home() {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowModal(true), 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="home">

      {/* burbujas de fondo igual q el home ajsdasd*/}
      <div className="bubble bubble-1" />
      <div className="bubble bubble-2" />
      <div className="bubble bubble-3" />
      <div className="bubble bubble-4" />

      {/* header */}
      <header className="home-header">
        <div className="logos">
          <img src={logoUV}   alt="Universidad Veracruzana" className="logo-img" />
          <div className="logo-divider" />
          <img src={logoFIEE} alt="FIEE" className="logo-img" />
        </div>
        <span className="year-chip">2026</span>
      </header>

      {/* hero */}
      <main className="home-hero">
        <div className="hero-tag animate-pop" style={{ animationDelay: '0s' }}>
          Matemáticas discretas
        </div>
        <h1 className="hero-title animate-pop" style={{ animationDelay: '0.12s' }}>
          Teoría de<span className="gradient-word"> Grafos</span>
        </h1>
        <p className="hero-sub animate-pop" style={{ animationDelay: '0.24s' }}>
          Aprende caminos de Euler, Hamilton y Dijkstra con
          teoría visual, simulaciones y ejercicios interactivos.
        </p>
        <button
          className="btn-start animate-pop"
          style={{ animationDelay: '0.36s' }}
          onClick={() => navigate('/temas')}
        >
          ¡Empezar ahora! →
        </button>
        <div className="mini-cards animate-pop" style={{ animationDelay: '0.5s' }}>
          <div className="mini-card" style={{ '--c': '#0D9488' }}><span>〰️</span><span>Euler</span></div>
          <div className="mini-card" style={{ '--c': '#534AB7' }}><span>🔷</span><span>Hamilton</span></div>
          <div className="mini-card" style={{ '--c': '#F59E0B' }}><span>⚡</span><span>Dijkstra</span></div>
        </div>
      </main>

      <footer className="home-footer">
        <p>Creado por Denisse Xocuis · Vanesa Morales· Alan Schleske · Jose Camacho · Armando Pichal</p>
      </footer>

      {/* ──  bienvenida ── */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>

            <div className="modal-header">
              <div className="modal-logos">
                <img src={logoUV}   alt="UV"   className="modal-logo" />
                <img src={logoFIEE} alt="FIEE" className="modal-logo" />
              </div>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <p className="modal-tag">¡Bienvenido!</p>
              <h2 className="modal-title">
                Plataforma Educativa<br />
                <span className="gradient-word">Teoría de Grafos</span>
              </h2>
              <p className="modal-text">
                En esta plataforma aprenderás los conceptos fundamentales de la
                teoría de grafos de forma visual e interactiva.
              </p>

              <div className="modal-features">
                <div className="modal-feature">
                  <span className="feature-icon" style={{ background: 'rgba(13,148,136,0.2)', color: '#0D9488' }}>〰</span>
                  <div>
                    <strong>Camino de Euler</strong>
                    <p>Recorre todos los arcos sin repetir ninguno</p>
                  </div>
                </div>
                <div className="modal-feature">
                  <span className="feature-icon" style={{ background: 'rgba(83,74,183,0.2)', color: '#534AB7' }}>🔷</span>
                  <div>
                    <strong>Camino de Hamilton</strong>
                    <p>Visita cada vértice exactamente una vez</p>
                  </div>
                </div>
                <div className="modal-feature">
                  <span className="feature-icon" style={{ background: 'rgba(245,158,11,0.2)', color: '#F59E0B' }}>⚡</span>
                  <div>
                    <strong>Algoritmo de Dijkstra</strong>
                    <p>Encuentra el camino más corto entre nodos</p>
                  </div>
                </div>
              </div>

              <p className="modal-note">
                Cada tema incluye teoría, imágenes, quiz, ejercicios y simulación interactiva.
              </p>
            </div>

            <div className="modal-footer">
              <button className="modal-btn" onClick={() => setShowModal(false)}>
                ¡Entendido, vamos! →
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}