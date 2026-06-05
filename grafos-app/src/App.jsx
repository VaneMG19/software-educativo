import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Topics from './pages/Topics'
import HamiltonMenu from './pages/HamiltonMenu'
import Euler from './pages/Euler'

// App.jsx tiene las rutas y la lógica de la app

//? poner las demás páginas cuando las tengan listas
import Dijkstra from './pages/Dijkstra'
import Ore from './pages/Ore' // Importamos tu nueva pantalla de Ore

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/temas" element={<Topics />} />
                <Route path="/temas/hamilton" element={<HamiltonMenu />} />
                <Route path="/temas/hamilton/ore" element={<Ore />} />
                
                <Route path="/euler" element={<Euler />} />

                {/*? aquí poner las rutas cuando las tengan listas
          ejemplo: */}

                <Route path="/dijkstra" element={<Dijkstra />} />
            </Routes>
        </BrowserRouter>
    )
}