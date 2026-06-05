import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Topics from './pages/Topics'
import Euler from './pages/Euler'
import Dijkstra from './pages/Dijkstra'

// App.jsx tiene las rutas y la lógica de la app

//? poner las demás páginas cuando las tengan listas
//* import Hamilton from './pages/Hamilton'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/temas" element={<Topics />} />
                <Route path="/euler" element={<Euler />} />
                <Route path="/dijkstra" element={<Dijkstra />} />

                {/*? aquí poner las rutas cuando las tengan listas
          ejemplo: */}

                {/* <Route path="/hamilton" element={<Hamilton />} /> */}
            </Routes>
        </BrowserRouter>
    )
}
