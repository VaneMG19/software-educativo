import {calcularDijkstra, obtenerRuta} from './dijkstra.js';
// --- PRUEBA DEL CÓDIGO ---

// Representamos los nodos y el "peso" (distancia) hacia sus vecinos
const grafo = {
    'A': { 'B': 4, 'C': 2 },
    'B': { 'A': 4, 'E': 3, 'C': 5 },
    'C': { 'A': 2, 'B': 5, 'D': 2, 'E': 4 },
    'D': { 'C': 2, 'E': 3 },
    'E': { 'B': 3, 'C': 4, 'D': 3 }
};

const inicio = 'A';
const destino = 'E';

const resultado = calcularDijkstra(grafo, inicio);
const caminoMasCorto = obtenerRuta(resultado.previos, destino);

console.log(`La distancia mínima de ${inicio} a ${destino} es: ${resultado.distancias[destino]}`);
console.log(`El camino a seguir es: ${caminoMasCorto.join(' -> ')}`);
