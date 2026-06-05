import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HamiltonMenu.css'; // Reutilizamos el CSS mágico del menú oscuro
import logoUV from '../assets/Logo_de_la_Universidad_Veracruzana.png';
import logoFIEE from '../assets/LogoFIEE.png';

const ORE_SUBTOPICS = [
    {
        id: "teoria",
        title: "Teoría",
        description: "Definiciones y explicación de la condición suficiente del Teorema de Ore.",
        color: "#8B5CF6", // Morado
        glow: "rgba(139,92,246,0.35)"
    },
    {
        id: "quiz",
        title: "Quiz",
        description: "Pon a prueba tus conocimientos sobre pares de vértices no adyacentes.",
        color: "#6366F1", // Indigo
        glow: "rgba(99,102,241,0.35)"
    },
    {
        id: "ejercicios",
        title: "Ejercicios",
        description: "Grafos para identificar a mano si garantizan un ciclo Hamiltoniano.",
        color: "#3B82F6", // Azul
        glow: "rgba(59,130,246,0.35)"
    },
    {
        id: "simulacion",
        title: "Simulación",
        description: "Dibuja tu propio grafo y evalúa el teorema de Ore en vivo.",
        color: "#10B981", // Verde
        glow: "rgba(16,185,129,0.35)"
    }
];

export default function Ore() {
    const navigate = useNavigate();
    // Controla si vemos el 'menu' o una sección específica ('teoria', 'quiz', etc.)
    const [vistaActiva, setVistaActiva] = useState('menu');

    // --- VISTA DE CONTENIDO (Cuando entras a Teoría, Quiz, etc.) ---
    if (vistaActiva !== 'menu') {
        return (
            <div className="hamilton-menu">
                <div className="bubble bubble-ham-1" />
                <div className="bubble bubble-ham-2" />
                
                <header className="topics-header">
                    <div className="logos">
                        <img src={logoUV} alt="UV" className="logo-img" />
                        <div className="logo-divider" />
                        <img src={logoFIEE} alt="FIEE" className="logo-img" />
                    </div>
                    {/* Botón para regresar al menú de los 4 recuadros de Ore */}
                    <button className="back-btn" onClick={() => setVistaActiva('menu')}>
                        ← Volver a Ore
                    </button>
                </header>

                <div className="topics-title animate-pop">
                    <h1>{vistaActiva.toUpperCase()}</h1>
                </div>

                {/* AQUÍ ES DONDE PONDRÁS TU CÓDIGO/NOTAS PARA CADA SECCIÓN */}
                <div style={{ color: 'white', maxWidth: '800px', margin: '2rem auto', textAlign: 'center', fontSize: '1.2rem' }}>
                    {vistaActiva === 'teoria' && (
                        <div>
                            <p>Sea G un grafo simple con n ≥ 3 vértices...</p>
                            <p>Si para cada par de vértices no adyacentes u y v: <strong>deg(u) + deg(v) ≥ n</strong></p>
                            {/* Inserta tu imagen aquí después */}
                        </div>
                    )}
                    {vistaActiva === 'quiz' && <p>Aquí programarás las preguntas del Quiz.</p>}
                    {vistaActiva === 'ejercicios' && <p>Aquí pondrás las imágenes de los grafos a resolver.</p>}
                    {vistaActiva === 'simulacion' && <p>Aquí irá el componente interactivo de los grafos.</p>}
                </div>
            </div>
        );
    }

    // --- VISTA PRINCIPAL (El menú de los 4 recuadros) ---
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
                {/* Botón que te saca totalmente de Ore y te regresa a la pantalla de Camacho/Armando */}
                <button className="back-btn" onClick={() => navigate("/temas/hamilton")}>
                    ← Volver a Hamilton
                </button>
            </header>

            <div className="topics-title animate-pop" style={{ animationDelay: "0s" }}>
                <p className="topics-sup">Camino de Hamilton</p>
                <h1>
                    Teorema de <span className="gradient-word-hamilton">Ore</span>
                </h1>
            </div>

            <section className="topics-grid">
                {ORE_SUBTOPICS.map((topic, i) => (
                    <div
                        key={topic.id}
                        className="topic-card animate-pop"
                        style={{
                            "--c": topic.color,
                            "--glow": topic.glow,
                            animationDelay: `${0.1 + i * 0.12}s`,
                        }}
                        onClick={() => setVistaActiva(topic.id)} /* Cambia la vista al hacer clic */
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