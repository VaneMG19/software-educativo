import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Topics from './pages/Topics'
import HamiltonMenu from './pages/HamiltonMenu'
import HamiltonTeoria from './pages/HamiltonTeoria'
import Dirac from './pages/Dirac'
import Euler from './pages/Euler'

// App.jsx tiene las rutas y la lógica de la app

//? poner las demás páginas cuando las tengan listas
import DijkstraTeoria from './pages/DijkstraTeoria'
import DijkstraQuizzes from './pages/DijkstraQuizzes'
import DijkstraEjercicios from './pages/DijkstraEjercicios'
import DijkstraMenu from './pages/DijkstraMenu'
import Dijkstra from './pages/Dijkstra'
import Ore from './pages/Ore' // Importamos tu nueva pantalla de Ore

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/temas" element={<Topics />} />
                <Route path="/temas/hamilton" element={<HamiltonMenu />} />
                <Route path="/temas/hamilton/teoria" element={<HamiltonTeoria />} />
                <Route path="/temas/hamilton/dirac" element={<Dirac />} />

                <Route path="/temas/hamilton/ore" element={<Ore />} />
                
                <Route path="/euler" element={<Euler />} />

                {/*? aquí poner las rutas cuando las tengan listas
          ejemplo: */}

                {/* Subsecciones de Dijkstra */}
                <Route path="/dijkstra" element={<DijkstraMenu />} />
                <Route path="/temas/dijkstra/simulacion" element={<Dijkstra />} />
                <Route path="/temas/dijkstra/teoria" element={<DijkstraTeoria />} />
                <Route path="/temas/dijkstra/quizzes" element={<DijkstraQuizzes />} />
                <Route path="/temas/dijkstra/ejercicios" element={<DijkstraEjercicios />} />
            </Routes>
        </BrowserRouter>
    )
}
