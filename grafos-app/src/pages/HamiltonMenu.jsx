import { useNavigate } from "react-router-dom";
import "../styles/HamiltonMenu.css";
import logoUV from "../assets/Logo_de_la_Universidad_Veracruzana.png";
import logoFIEE from "../assets/LogoFIEE.png";

const HAMILTON_SUBTOPICS = [
    {
        id: "intro",
        title: "Conceptos Básicos",
        emoji: "📖",
        description:
        "Aprende la definición formal de camino y ciclo hamiltoniano, y sus diferencias clave con los grafos eulerianos.",
        color: "#8B5CF6", // Morado claro
        glow: "rgba(139,92,246,0.35)",
        path: "/temas/hamilton/teoria",
    },
    {
        id: "dirac",
        title: "Teorema de Dirac",
        emoji: "📐",
        description:
        "Descubre esta condición suficiente: si cada vértice tiene un grado mayor o igual a n/2, el grafo es hamiltoniano.",
        color: "#6366F1", // Indigo
        glow: "rgba(99,102,241,0.35)",
        path: "/temas/hamilton/dirac",
    },
    {
        id: "ore",
        title: "Teorema de Ore",
        emoji: "🔗",
        description:
        "Explora la extensión de Dirac basada en la suma de los grados de pares de vértices no adyacentes.",
        color: "#3B82F6", // Azul
        glow: "rgba(59,130,246,0.35)",
        path: "/temas/hamilton/ore",
    },
    {
    id: "simulacion",
    title: "Simulador Interactivo",
    emoji: "🎮",
    description: "Dibuja grafos personalizados y pon a prueba los teoremas de Dirac y Ore en tiempo real.",
    color: "#10B981", // Esmeralda (para denotar acción/juego)
    glow: "rgba(16,185,129,0.35)",
    path: "/temas/hamilton/simulador",
    },
];

export default function HamiltonMenu() {
    const navigate = useNavigate();

    return (
    <div className="hamilton-menu">
        <div className="bubble bubble-ham-1" />
        <div className="bubble bubble-ham-2" />
        <div className="bubble bubble-ham-3" />

        {/* Header */}
        <header className="topics-header">
            <div className="logos">
                <img
                    src={logoUV}
                    alt="Universidad Veracruzana"
                    className="logo-img"
                />
                <div className="logo-divider" />
                <img src={logoFIEE} alt="FIEE" className="logo-img" />
                </div>
            <button className="back-btn" onClick={() => navigate("/temas")}>
                ← Volver a Temas
            </button>
        </header>

    {/* Título */}
    <div
        className="topics-title animate-pop"
        style={{ animationDelay: "0s" }}
    >
        <p className="topics-sup">Camino de Hamilton</p>
        <h1>
            Selecciona un <span className="gradient-word-hamilton">Subtema</span>
        </h1>
    </div>

    {/* Grid de Subtemas */}
        <section className="topics-grid">
            {HAMILTON_SUBTOPICS.map((topic, i) => (
            <div
                key={topic.id}
                className="topic-card animate-pop"
                style={{
                "--c": topic.color,
                "--glow": topic.glow,
                animationDelay: `${0.1 + i * 0.12}s`,
                }}
                onClick={() => navigate(topic.path)}
            >
                <div className="card-top">
                <span className="card-emoji">{topic.emoji}</span>
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
