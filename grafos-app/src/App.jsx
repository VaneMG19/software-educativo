import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Topics from './pages/Topics'
import HamiltonMenu from './pages/HamiltonMenu'

// App.jsx tiene las rutas y la lógica de la app

//? poner las demás páginas cuando las tengan listas
//? ejemplos:
//* import Euler from './pages/Euler'
//* import Dijkstra from './pages/Dijkstra'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/temas" element={<Topics />} />
        <Route path="/temas/hamilton" element={<HamiltonMenu/>} />

        {/*? aquí poner las rutas cuando las tengan listas 
          ejemplo: */}

        {/* <Route path="/euler" element={<Euler />} /> */}
        {/* <Route path="/dijkstra" element={<Dijkstra />} /> */}
      </Routes>
    </BrowserRouter>
  )
}