# Aplicación educativa de grafos

Plataforma educativa interactiva sobre teoría de grafos: Camino de Euler, Camino de Hamilton y Algoritmo de Dijkstra. Construida con React + Vite, sin base de datos, desplegada en Vercel.

---

## Equipo

| Pantalla | Responsable | Archivo |
|---|---|---|
| Inicio | Denisse | `src/pages/Home.jsx` |
| Elige un tema | Denisse | `src/pages/Topics.jsx` |
| Camino de Euler | Vanesa | `src/pages/Euler.jsx` |
| Camino de Hamilton | Camacho / Armando | `src/pages/Hamilton.jsx` |
| Algoritmo de Dijkstra | Alan | `src/pages/Dijkstra.jsx` |

---

## Requisitos previos para trabajar en la plataforma

- [Node.js](https://nodejs.org/) v24 (LTS)
- npm (viene incluido con Node)
- Git

Verifica que los tienes instalados:

```bash
node -v
npm -v
git --version
```

---

## Instalación
```bash
# 1. clona el repositorio
# 2. metete a la carpeta 'grafos-app'
cd grafos-app

# 2. instala las dependencias
npm install

# 3. levanta el servidor local
npm run dev
```

Abre tu navegador en `http://localhost:5173` y ya estás.

---

## Estructura de carpetas

```
grafos-app/
├── public/               # imágenes y assets estáticos
├── src/
│   ├── assets/           # imagenes que se quieran poner
│   ├── pages/            # una archivo por pantalla
│   │   ├── Home.jsx
│   │   ├── Topics.jsx
│   │   ├── Euler.jsx
│   │   ├── Hamilton.jsx
│   │   └── Dijkstra.jsx
│   ├── components/       # componentes reutilizables
│   │   ├── Navbar.jsx
│   │   └── TopicCard.jsx
│   ├── styles/           # estilo y colores para las páginas, puro css
│   │   ├── Home.css
│   │   ├── Topics.css
│   │   ├── Euler.css
│   │   ├── Hamilton.css
│   │   └── Dijkstra.css
│   ├── App.jsx           # rutas principales (React Router)
│   └── main.jsx          # punto de entrada
├── index.html
├── package.json
└── vite.config.js
```

---

## Comandos útiles

| Comando | Descripción |
|---|---|
| `npm run dev` | Levanta el servidor local |
| `npm run build` | Genera la versión de producción en `/dist` |
| `npm run preview` | Previsualiza el build de producción localmente |

---

## Tecnologías usadas

- [React](https://react.dev/) — librería UI
- [Vite](https://vitejs.dev/) — bundler y servidor de desarrollo
- [React Router](https://reactrouter.com/) — navegación entre pantallas
- [Vercel](https://vercel.com/) — hosting y deploy continuo