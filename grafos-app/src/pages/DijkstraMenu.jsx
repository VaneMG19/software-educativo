import { useNavigate } from "react-router-dom";
import "../styles/DijkstraMenu.css";
import logoUV from "../assets/Logo_de_la_Universidad_Veracruzana.png";
import logoFIEE from "../assets/LogoFIEE.png";

const DIJKSTRA_SUBTOPICS = [
    {
        id: "teoria",
        title: "Teoría Básica",
        emoji: "📖",
        description:
        "Aprende qué es el algoritmo de Dijkstra, cómo funciona matemáticamente y sus aplicaciones en el mundo real.",
        color: "#F59E0B", // Ámbar
        glow: "rgba(245,158,11,0.35)",
        path: "/temas/dijkstra/teoria",
    },
    {
        id: "quizzes",
        title: "Quizzes",
        emoji: "📝",
        description:
        "Pon a prueba tus conocimientos teóricos sobre el funcionamiento y características del algoritmo.",
        color: "#EAB308", // Amarillo oscuro
        glow: "rgba(234,179,8,0.35)",
        path: "/temas/dijkstra/quizzes",
    },
    {
        id: "ejercicios",
        title: "Ejercicios",
        emoji: "✍️",
        description:
        "Resuelve grafos paso a paso calculando distancias y encuentra el camino más corto de forma manual.",
        color: "#D97706", // Naranja
        glow: "rgba(217,119,6,0.35)",
        path: "/temas/dijkstra/ejercicios",
    },
    {
        id: "simulacion",
        title: "Simulación Interactiva",
        emoji: "⚡",
        description:
        "Crea grafos dinámicos, conecta nodos y visualiza cómo la computadora calcula la ruta óptima paso a paso.",
        color: "#F97316", // Naranja vibrante
        glow: "rgba(249,115,22,0.35)",
        path: "/temas/dijkstra/simulacion",
    }
];

export default function DijkstraMenu() {
    const navigate = useNavigate();

    return (
    <div className="dijkstra-menu">
        <div className="bubble bubble-dijkstra-1" />
        <div className="bubble bubble-dijkstra-2" />
        <div className="bubble bubble-dijkstra-3" />

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
            <p className="topics-sup">Rutas Óptimas</p>
            <h1>
                Algoritmo de <span className="gradient-word-dijkstra">Dijkstra</span>
            </h1>
        </div>

        {/* Grid de Subtemas */}
        <section className="topics-grid">
            {DIJKSTRA_SUBTOPICS.map((topic, i) => (
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
