export function calcularDijkstra(grafo, nodoInicio) {
    const distancias = {};
    const previos = {};
    const noVisitados = new Set(Object.keys(grafo)); // Guarda todos los nodos inicialmente

    // 1. Inicialización
    for (let nodo in grafo) {
        distancias[nodo] = Infinity; // Empezamos asumiendo que todos están infinitamente lejos
        previos[nodo] = null;        // Aún no sabemos de dónde venimos
    }
    distancias[nodoInicio] = 0;      // La distancia al nodo de inicio es 0

    // 2. Bucle principal
    while (noVisitados.size > 0) {
        // Encontrar el nodo no visitado con la distancia más pequeña
        let nodoActual = null;
        for (let nodo of noVisitados) {
            if (nodoActual === null || distancias[nodo] < distancias[nodoActual]) {
                nodoActual = nodo;
            }
        }

        // Si el nodo más cercano está a una distancia infinita, están desconectados
        if (distancias[nodoActual] === Infinity) break;

        // Lo marcamos como visitado sacándolo del Set
        noVisitados.delete(nodoActual);

        // 3. Revisar los vecinos del nodo actual
        for (let vecino in grafo[nodoActual]) {
            let peso = grafo[nodoActual][vecino];
            let distanciaAlternativa = distancias[nodoActual] + peso;

            // Si encontramos un camino más corto, actualizamos los datos
            if (distanciaAlternativa < distancias[vecino]) {
                distancias[vecino] = distanciaAlternativa;
                previos[vecino] = nodoActual; // Guardamos cómo llegamos aquí
            }
        }
    }

    return { distancias, previos };
}

export function obtenerRuta(previos, nodoDestino) {
    const ruta = [];
    let nodoActual = nodoDestino;

    while (nodoActual !== null) {
        ruta.unshift(nodoActual); // Agregamos el nodo al principio del arreglo
        nodoActual = previos[nodoActual];
    }

    return ruta;
}

// Agrega esta función al final de tu archivo src/utils/dijkstra.js

export function dijkstraConHistorial(grafo, nodoInicio) {
    const distancias = {};
    const previos = {};
    const noVisitados = new Set(Object.keys(grafo));
    const historial = [];

    for (let nodo in grafo) {
        distancias[nodo] = Infinity;
        previos[nodo] = null;
    }
    distancias[nodoInicio] = 0;

    while (noVisitados.size > 0) {
        let nodoActual = null;
        for (let nodo of noVisitados) {
            if (nodoActual === null || distancias[nodo] < distancias[nodoActual]) {
                nodoActual = nodo;
            }
        }

        if (distancias[nodoActual] === Infinity) break;

        // --- NUEVO: Reconstruimos el camino hacia el nodo que estamos visitando ---
        let caminoHastaAqui = [];
        let temp = nodoActual;
        while (temp !== null) {
            caminoHastaAqui.unshift(temp);
            temp = previos[temp];
        }

        historial.push({
            tipo: 'VISITANDO_NODO',
            nodo: nodoActual,
            camino: caminoHastaAqui // Guardamos el camino más conveniente hasta este nodo
        });

        noVisitados.delete(nodoActual);

        for (let vecino in grafo[nodoActual]) {
            let peso = grafo[nodoActual][vecino];
            let distanciaAlternativa = distancias[nodoActual] + peso;

            historial.push({ tipo: 'EVALUANDO_ARISTA', desde: nodoActual, hacia: vecino });

            if (distanciaAlternativa < distancias[vecino]) {
                distancias[vecino] = distanciaAlternativa;
                previos[vecino] = nodoActual;

                historial.push({
                    tipo: 'ACTUALIZANDO_DISTANCIA',
                    desde: nodoActual,
                    hacia: vecino,
                    nuevaDistancia: distanciaAlternativa,
                    previosSnapshot: { ...previos } // Guardamos cómo va el "árbol" de caminos
                });
            }
        }
    }

    return { distancias, previos, historial };
}
