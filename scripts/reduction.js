let graph = null;
let useWeights = false;
let useOriginal = false;
let useR0 = false;
let useR1 = false;
let useR2 = false;
let useIter = false;
let graphFileContents = "";
let weightsFileContents = "";
let path = "";
loadFileContent()

const info_reduction = document.getElementById("span_info_red");

const counter_nb_vertices = document.getElementById("nb_vertices");
const counterR0 = document.getElementById("r0");
const counterR1 = document.getElementById("r1");
const counterR2 = document.getElementById("r2");
const counterIter = document.getElementById("iter");
const counterTotal = document.getElementById("total");
const counter_nb_vertices_red = document.getElementById("nb_vertices_red");

counter_nb_vertices.textContent = 0;
counterR0.textContent = 0;
counterR1.textContent = 0;
counterR2.textContent = 0;
counterIter.textContent = 0;
counterTotal.textContent = 0;
counter_nb_vertices_red.textContent = 0;

// when counterR0, counterR1, counterR2, counterIter are modified, counterTotal is modified too
const observer = new MutationObserver(mutations => {
    counterTotal.textContent = parseInt(counterR0.textContent) + parseInt(counterR1.textContent) + parseInt(counterR2.textContent);
});
observer.observe(counterR0, { attributes: true, childList: true, characterData: true });
observer.observe(counterR1, { attributes: true, childList: true, characterData: true });
observer.observe(counterR2, { attributes: true, childList: true, characterData: true });


function wait_for_play() {
    return new Promise((resolve) => {
        const checkbox = document.getElementById("cb-dont_stop");
        if (checkbox.checked) {
            resolve();
        }
        const bouton = document.getElementById("play");
        bouton.addEventListener("click", () => {
            resolve();
        });
    });
}

function loadFileContent() {
    const fileInput = document.getElementById('graph-select');
    // read the state of the input checkbox "cb-weights"
    const cbWeights = document.getElementById('cb-weights');
    // true if the checkbox is checked, false otherwise
    useWeights = cbWeights.checked;
    const cbOriginal = document.getElementById('cb-original');
    useOriginal = cbOriginal.checked;
    path = "https://raw.githubusercontent.com/Cyril-Grelier/gc_instances/main/"
    path += (useOriginal ? "original_graphs" : (useWeights ? "reduced_wvcp" : "reduced_gcp")) + "/"
    const selectedFile = path + fileInput.value + ".col";
    fetch(selectedFile)
        .then(response => {
            if (!response.ok) {
                throw new Error('Échec de la requête.');
            }
            return response.text();
        })
        .then(fileContents => {
            graphFileContents = fileContents;
        })
        .catch(error => {
            console.error('Une erreur s\'est produite :', error);
        });
    if (useWeights) {
        fetch(selectedFile + ".w")
            .then(response => {
                if (!response.ok) {
                    throw new Error('Échec de la requête.');
                }
                return response.text();
            })
            .then(fileContents => {
                weightsFileContents = fileContents;
            })
            .catch(error => {
                console.error('Une erreur s\'est produite :', error);
            });
    }
}

function loadGraph() {
    graph = null;
    const svg = document.getElementById("graph-container");
    // reset counters
    counterR0.textContent = 0;
    counterR1.textContent = 0;
    counterR2.textContent = 0;
    counterIter.textContent = 0;

    // Effacez tous les éléments enfants de l'élément SVG
    while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
    }
    let nbVertices = 0;
    let nbEdges = 0;
    const edgesList = [];

    for (const line_ of graphFileContents.split('\n')) {
        const line = line_.trim();
        if (line.startsWith("c")) {
            continue;
        }
        const parts = line.trim().split(' ');
        if (line.startsWith("p")) {
            nbVertices = parseInt(parts[2], 10);
            nbEdges = parseInt(parts[3], 10);
        } else if (line.startsWith("e")) {
            const vertex1_ = parseInt(parts[1]) - 1;
            const vertex2_ = parseInt(parts[2]) - 1;
            if (vertex1_ === vertex2_) {
                continue;
            }
            const vertex1 = Math.min(vertex1_, vertex2_);
            const vertex2 = Math.max(vertex1_, vertex2_);
            edgesList.push([vertex1, vertex2]);
        }
    }

    weights = [];
    if (useWeights) {
        const weightsLines = weightsFileContents.split('\n');
        // Lire les poids du fichier .w
        weights = weightsLines.map(line => parseInt(line));
    } else {
        weights = Array(nbVertices).fill(1);
    }

    graph = new Graph(nbVertices, nbEdges, edgesList, weights);
    createSVG();
    console.log(graph);
    counter_nb_vertices.textContent = graph.nbVertices;
    counter_nb_vertices_red.textContent = graph.nbVertices - graph.reducedVertices.length;
}

function randomLayout(graph, svgWidth, svgHeight) {
    for (let i = 0; i < graph.nbVertices; i++) {
        const x = Math.random() * svgWidth;
        const y = Math.random() * svgHeight;
        graph.vertexPositions[i] = { x, y };
    }
}

function circleLayout(graph, svgWidth, svgHeight) {
    const centerX = svgWidth / 2;
    const centerY = svgHeight / 2;

    for (let i = 0; i < graph.nbVertices; i++) {
        const angle = (i * (2 * Math.PI)) / graph.nbVertices;
        const x = centerX + 0.8 * centerX * Math.cos(angle);
        const y = centerY + 0.8 * centerY * Math.sin(angle);
        graph.vertexPositions[i] = { x, y };
    }
}

function fruchterman_reingoldLayout(graph, svgWidth, svgHeight) {
    // Nombre d'itérations
    const iterations = 1000;

    // Zone de dessin du graphe
    const width = svgWidth * 0.9;
    const height = svgHeight * 0.9;

    // Paramètres de l'algorithme
    const k = Math.sqrt((width * height) / graph.nbVertices);
    // const k = 1 / graph.nbVertices;
    let temperature = width / 50;

    // Fonction pour calculer la distance entre deux points
    function distance(pointA, pointB) {
        const dx = pointA.x - pointB.x;
        const dy = pointA.y - pointB.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Initialisation des positions aléatoires des nœuds
    graph.vertexPositions.forEach(node => {
        node.x = Math.random() * width;
        node.y = Math.random() * height;
    });

    // Algorithme de Fruchterman-Reingold
    for (let i = 0; i < iterations; i++) {
        // Calcul des forces répulsives
        graph.vertexPositions.forEach(node => {
            node.dx = 0;
            node.dy = 0;

            graph.vertexPositions.forEach(otherNode => {
                if (node !== otherNode) {
                    const d = distance(node, otherNode);
                    const repulsiveForce = (k * k / d) * 1;
                    const dx = (node.x - otherNode.x) / d;
                    const dy = (node.y - otherNode.y) / d;
                    node.dx += repulsiveForce * dx;
                    node.dy += repulsiveForce * dy;
                }
            });
        });

        // Calcul des forces attractives
        graph.edgesList.forEach(edge => {
            const source = graph.vertexPositions[edge[0]];
            const target = graph.vertexPositions[edge[1]];
            const d = distance(source, target);
            const attractiveForce = (d * d / k) * 1;
            const dx = (target.x - source.x) / d;
            const dy = (target.y - source.y) / d;
            source.dx += attractiveForce * dx;
            source.dy += attractiveForce * dy;
            target.dx -= attractiveForce * dx;
            target.dy -= attractiveForce * dy;
        });

        // Mise à jour des positions
        graph.vertexPositions.forEach(node => {
            const displacement = Math.sqrt(node.dx * node.dx + node.dy * node.dy);
            if (displacement !== 0) {
                const factor = Math.min(temperature, displacement) / displacement;
                node.x += node.dx * factor;
                node.y += node.dy * factor;
                node.x = Math.max(0, Math.min(width, node.x));
                node.y = Math.max(0, Math.min(height, node.y));
            }
        });

        // Refroidissement (diminution de la température)
        temperature *= (1 - i / iterations);
    }
}

function forceDirectedLayout(graph, svgWidth, svgHeight) {

    const iterations = 10000;  // Nombre d'itérations
    const coolingFactor = 0.95;  // Facteur de refroidissement
    const k = (1 / graph.nbVertices) * 0.9;  // Constante de répulsion
    let temperature = svgWidth / 100;

    for (let it = 0; it < iterations; it++) {
        // Calcul des forces répulsives et attractives
        // Reset des forces pour chaque nœud
        graph.vertexPositions.forEach(node => {
            node.x = Math.random() * svgWidth;
            node.y = Math.random() * svgHeight;
            node.fx = 0;
            node.fy = 0;
        });

        // Calcul des forces répulsives entre les nœuds (Loi de Coulomb)
        for (let i = 0; i < graph.vertexPositions.length; i++) {
            for (let j = 0; j < graph.vertexPositions.length; j++) {
                if (i !== j) {
                    const dx = graph.vertexPositions[i].x - graph.vertexPositions[j].x;
                    const dy = graph.vertexPositions[i].y - graph.vertexPositions[j].y;
                    const distance = Math.max(1, Math.sqrt(dx * dx + dy * dy));
                    const force = k * k / distance;  // Loi de Coulomb
                    graph.vertexPositions[i].fx += (dx / distance) * force;
                    graph.vertexPositions[i].fy += (dy / distance) * force;

                    // Forces de répulsion inverses (nécessaires pour éviter des positions éloignées)
                    graph.vertexPositions[j].fx -= (dx / distance) * force;
                    graph.vertexPositions[j].fy -= (dy / distance) * force;
                }
            }
        }

        graph.edgesList.forEach(link => {
            const source = graph.vertexPositions[link[0]];
            const target = graph.vertexPositions[link[1]];
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const distance = Math.max(1, Math.sqrt(dx * dx + dy * dy));
            const force = k * distance;
            source.fx += (dx / distance) * force;
            source.fy += (dy / distance) * force;
            target.fx -= (dx / distance) * force;
            target.fy -= (dy / distance) * force;
        });
        // Mise à jour des positions des nœuds
        graph.vertexPositions.forEach(node => {
            if (!node.fixed) {
                // Mise à jour des positions en fonction des forces (utilisez la physique newtonienne)
                node.x = Math.min(Math.max(0, node.x + node.fx), svgWidth);
                node.y = Math.min(Math.max(0, node.y + node.fy), svgHeight);
            }
        });

        // Refroidissement (diminution de la température)
        temperature *= coolingFactor;

    }
}

function createSVG() {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svgWidth = 600; // Largeur du SVG
    const svgHeight = 600; // Hauteur du SVG
    const circleRadius = 12; // Rayon des nœuds (cercles)

    const svg = document.getElementById('graph-container');
    svg.setAttribute('width', svgWidth);
    svg.setAttribute('height', svgHeight);


    // randomLayout(graph, svgWidth, svgHeight);
    circleLayout(graph, svgWidth, svgHeight);
    // fruchterman_reingoldLayout(graph, svgWidth, svgHeight);
    // forceDirectedLayout(graph, svgWidth, svgHeight);

    // for (let i = 0; i < graph.nbVertices; i++) {
    //     graph.vertexPositions[i].x += 20;
    //     graph.vertexPositions[i].y += 20;
    // }

    // Dessiner les arêtes (liens)
    for (let i = 0; i < graph.nbVertices; i++) {
        for (const neighbor of graph.neighborhood[i]) {
            if (i < neighbor) {
                const line = document.createElementNS(svgNS, 'line');
                const startPos = graph.vertexPositions[i];
                const endPos = graph.vertexPositions[neighbor];
                line.setAttribute('x1', startPos.x);
                line.setAttribute('y1', startPos.y);
                line.setAttribute('x2', endPos.x);
                line.setAttribute('y2', endPos.y);
                line.setAttribute('stroke', 'black');
                line.setAttribute('id', 'edge' + i + '-' + neighbor);
                line.setAttribute("z-index", "0");
                svg.appendChild(line);
            }
        }
    }


    for (let i = 0; i < graph.nbVertices; i++) {
        const circle = document.createElementNS(svgNS, 'circle');
        circle.setAttribute('cx', graph.vertexPositions[i].x);
        circle.setAttribute('cy', graph.vertexPositions[i].y);
        circle.setAttribute('r', circleRadius);
        circle.setAttribute('fill', 'lightblue');
        circle.setAttribute('id', 'node' + i);
        svg.appendChild(circle);
        const text = document.createElementNS(svgNS, "text");
        text.setAttribute('x', graph.vertexPositions[i].x);
        text.setAttribute('y', graph.vertexPositions[i].y);
        text.setAttribute("font-family", "Arial");
        text.setAttribute("font-size", "10");
        text.setAttribute("fill", "black");
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "middle");
        if (useWeights) {
            text.textContent = i + "-" + graph.weights[i];
        } else {
            text.textContent = i;
        }
        svg.appendChild(text);
    }

}

class Graph {
    constructor(nbVertices, nbEdges, edgesList, weights) {
        this.name = '';
        this.nbVertices = nbVertices;
        this.nbEdges = nbEdges;
        this.edgesList = edgesList;
        this.adjacencyMatrix = new Array(nbVertices);
        for (let i = 0; i < nbVertices; i++) {
            this.adjacencyMatrix[i] = new Array(nbVertices).fill(false);
        }
        this.neighborhood = Array(this.nbVertices).fill().map(() => []);
        this.weights = weights;
        this.reducedVertices = [];
        this.cliques = [];
        this.sortedVertices = [];
        this.heaviestVertexWeight = 0;

        this.vertexPositions = Array(this.nbVertices).fill({ x: 0, y: 0 });
        for (const [vertex1, vertex2] of this.edgesList) {
            if (!this.adjacencyMatrix[vertex1][vertex2]) {
                this.adjacencyMatrix[vertex1][vertex2] = true;
                this.adjacencyMatrix[vertex2][vertex1] = true;
                this.neighborhood[vertex1].push(vertex2);
                this.neighborhood[vertex2].push(vertex1);
            }
        }

        this.cliques = Array(this.nbVertices);//.fill().map(() => []);
        for (let i = 0; i < this.nbVertices; i++) {
            this.cliques[i] = this.computeCliqueVertex(i);
        }
        this.sortedVertices = [...Array(this.nbVertices).keys()];
        this.sortVertices();
        this.reducedVertices = [];
    }

    computeCliqueVertex(vertex) {
        const currentClique = [vertex];
        let candidates = new Set(this.neighborhood[vertex]);
        while (candidates.size > 0) {
            let bestVertex = -1;
            let bestBenefit = -1;
            for (const neighbor of candidates) {
                const communNeighbors = [...candidates].filter(n => this.neighborhood[neighbor].includes(n));
                const potentialWeight = communNeighbors.reduce((acc, n) => acc + this.weights[n], 0);
                const benefit = this.weights[neighbor] + (potentialWeight / 2);
                if (benefit > bestBenefit) {
                    bestBenefit = benefit;
                    bestVertex = neighbor;
                }
            }
            currentClique.push(bestVertex);

            candidates.delete(bestVertex);
            candidates = new Set([...candidates].filter(n => this.neighborhood[bestVertex].includes(n)));

        }
        currentClique.sort((a, b) => {
            const weightDiff = this.weights[b] - this.weights[a];
            const degreeDiff = this.neighborhood[b].length - this.neighborhood[a].length;
            const indexDiff = b - a;
            if (weightDiff === 0 && degreeDiff === 0) {
                return indexDiff;
            }
            return weightDiff !== 0 ? weightDiff : degreeDiff;
        });

        return currentClique;
    }

    sortVertices() {
        this.sortedVertices.sort((a, b) => {
            const weightDiff = this.weights[b] - this.weights[a];
            const degreeDiff = this.neighborhood[b].length - this.neighborhood[a].length;
            const neighborWeightSumA = this.neighborhood[a].reduce((acc, n) => acc + this.weights[n], 0);
            const neighborWeightSumB = this.neighborhood[b].reduce((acc, n) => acc + this.weights[n], 0);
            return (weightDiff !== 0 ? weightDiff : degreeDiff) || (neighborWeightSumB - neighborWeightSumA);
        });
    }

    deleteVertex(vertex) {
        this.recomputeClique = [...this.neighborhood[vertex]];
        for (const neighbor of this.neighborhood[vertex]) {
            this.neighborhood[neighbor] = this.neighborhood[neighbor].filter(n => n !== vertex);
        }
        this.neighborhood[vertex] = [];
        this.reducedVertices.push(vertex);
        counter_nb_vertices_red.textContent = this.nbVertices - this.reducedVertices.length;
        this.cliques[vertex] = [];
        for (const neighbor of this.recomputeClique) {
            if (this.cliques[neighbor].includes(vertex)) {
                this.cliques[neighbor] = this.computeCliqueVertex(neighbor);
            }
        }
    }
}

async function reduction_commun_neighbors(vertex) {
    if (graph.neighborhood[vertex].length === 0) {
        return false;
    }

    const neighbors = graph.neighborhood[vertex].map(n => new Set(graph.neighborhood[n]));

    let inter = neighbors[0];
    for (let i = 1; i < neighbors.length; i++) {
        // inter equal intersection of inter and neighbors[i]
        inter = new Set([...inter].filter(element => neighbors[i].has(element)));
    }
    inter.delete(vertex);


    for (const n_vertex of inter) {
        if (graph.weights[n_vertex] >= graph.weights[vertex]) {


            const circle = document.getElementById('node' + vertex);
            circle.setAttribute('fill', 'red');

            for (edge of graph.edgesList) {
                if (graph.reducedVertices.includes(edge[0]) || graph.reducedVertices.includes(edge[1])) {
                    continue;
                }
                if (
                    (edge[0] === vertex && graph.neighborhood[n_vertex].includes(edge[1])) ||
                    (edge[1] === vertex && graph.neighborhood[n_vertex].includes(edge[0])) ||
                    (edge[0] === n_vertex && graph.neighborhood[vertex].includes(edge[1])) ||
                    (edge[1] === n_vertex && graph.neighborhood[vertex].includes(edge[0]))
                ) {
                    const line = document.getElementById('edge' + (edge[0] > edge[1] ? edge[1] : edge[0]) + '-' + (edge[0] > edge[1] ? edge[0] : edge[1]));
                    line.setAttribute('stroke', 'red');
                    line.setAttribute("class", "path");
                }
            }

            const circle2 = document.getElementById('node' + n_vertex);
            circle2.setAttribute('fill', 'red');

            info_reduction.textContent = "R2 : delete vertex " + vertex + " with the vertex " + n_vertex;

            await wait_for_play();
            info_reduction.textContent = "";


            counterR2.textContent = parseInt(counterR2.textContent) + 1;

            for (edge of graph.edgesList) {
                if (graph.reducedVertices.includes(edge[0]) || graph.reducedVertices.includes(edge[1])) {
                    continue;
                }
                if (
                    (edge[0] === vertex && graph.neighborhood[n_vertex].includes(edge[1])) ||
                    (edge[1] === vertex && graph.neighborhood[n_vertex].includes(edge[0])) ||
                    (edge[0] === n_vertex && graph.neighborhood[vertex].includes(edge[1])) ||
                    (edge[1] === n_vertex && graph.neighborhood[vertex].includes(edge[0]))
                ) {
                    const line = document.getElementById('edge' + (edge[0] > edge[1] ? edge[1] : edge[0]) + '-' + (edge[0] > edge[1] ? edge[0] : edge[1]));
                    line.setAttribute('stroke', 'black');
                    line.removeAttribute("class");
                }
            }

            circle2.setAttribute('fill', 'lightblue');


            for (const neighbor of graph.neighborhood[vertex]) {
                const line = document.getElementById('edge' + (vertex > neighbor ? neighbor : vertex) + '-' + (vertex > neighbor ? vertex : neighbor));
                line.setAttribute('stroke', 'lightgrey');
                line.setAttribute('stroke-dasharray', '2,2')
            }
            circle.setAttribute('opacity', '0.25');

            await wait_for_play();
            return true;
        }
    }

    return false;
}


async function reduction_cliques(vertex) {
    const vertex_weight = graph.weights[vertex];
    const neighbors = new Set(graph.neighborhood[vertex]);

    for (const clique of graph.cliques) {
        if (clique.includes(vertex)) {
            continue;
        }

        let d = graph.neighborhood[vertex].length + 1;

        if (useR1) {
            for (let i = clique.length - 1; i >= 0; i--) {
                const c_vertex = clique[i];
                if (neighbors.has(c_vertex) && clique.length - i >= d) {
                    d--;
                }
            }
        }

        if (clique.length < d) {
            continue;
        }

        if (vertex_weight <= graph.weights[clique[d - 1]]) {

            let colors = ["red", "yellow", "green", "blue", "purple", "pink", "brown"];

            for (let i = 0; i < clique.length; i++) {
                const circle = document.getElementById('node' + clique[i]);
                circle.setAttribute('fill', colors[i]);
            }

            for (edge of graph.edgesList) {
                if (graph.reducedVertices.includes(edge[0]) || graph.reducedVertices.includes(edge[1])) {
                    continue;
                }
                if (
                    (edge[0] === vertex && clique.includes(edge[1])) ||
                    (edge[1] === vertex && clique.includes(edge[0]))
                ) {
                    const line = document.getElementById('edge' + (edge[0] > edge[1] ? edge[1] : edge[0]) + '-' + (edge[0] > edge[1] ? edge[0] : edge[1]));
                    line.setAttribute('stroke', 'red');
                    line.setAttribute("class", "path");
                } else if (clique.includes(edge[0]) && clique.includes(edge[1])) {
                    const line = document.getElementById('edge' + (edge[0] > edge[1] ? edge[1] : edge[0]) + '-' + (edge[0] > edge[1] ? edge[0] : edge[1]));
                    line.setAttribute('stroke', 'orange');
                    line.setAttribute("class", "path");
                } else if (edge[0] === vertex || edge[1] === vertex) {
                    const line = document.getElementById('edge' + (edge[0] > edge[1] ? edge[1] : edge[0]) + '-' + (edge[0] > edge[1] ? edge[0] : edge[1]));
                    line.setAttribute('stroke', 'orange');
                    line.setAttribute('stroke-dasharray', '2,2')

                }
            }


            const circle = document.getElementById('node' + vertex);
            colorIndex = 0;

            function changeColor() {
                circle.setAttribute("fill", colors[colorIndex]);
                colorIndex = (colorIndex + 1) % d;
            }

            let intervalID = setInterval(changeColor, 500);

            if (d < graph.neighborhood[vertex].length + 1) {
                info_reduction.textContent = "R1 : delete vertex " + vertex + " with the clique " + clique;
            } else {
                info_reduction.textContent = "R0 : delete vertex " + vertex + " with the clique " + clique;
            }

            await wait_for_play();

            info_reduction.textContent = "";
            if (d < graph.neighborhood[vertex].length + 1) {
                counterR1.textContent = parseInt(counterR1.textContent) + 1;
            } else {
                counterR0.textContent = parseInt(counterR0.textContent) + 1;
            }

            clearInterval(intervalID);

            for (edge of graph.edgesList) {
                if (graph.reducedVertices.includes(edge[0]) || graph.reducedVertices.includes(edge[1])) {
                    continue;
                }
                if (clique.includes(edge[0]) && clique.includes(edge[1])) {
                    const line = document.getElementById('edge' + (edge[0] > edge[1] ? edge[1] : edge[0]) + '-' + (edge[0] > edge[1] ? edge[0] : edge[1]));
                    line.setAttribute('stroke', 'black');
                    line.removeAttribute("class", "path");
                } else if (edge[0] === vertex || edge[1] === vertex) {
                    const line = document.getElementById('edge' + (edge[0] > edge[1] ? edge[1] : edge[0]) + '-' + (edge[0] > edge[1] ? edge[0] : edge[1]));
                    line.setAttribute('stroke', 'black');
                    line.removeAttribute("class", "path");
                    line.setAttribute('stroke-dasharray', '2,2');
                }
            }


            for (const neighbor of graph.neighborhood[vertex]) {
                const line = document.getElementById('edge' + (vertex > neighbor ? neighbor : vertex) + '-' + (vertex > neighbor ? vertex : neighbor));
                line.setAttribute('stroke', 'lightgrey');
                line.setAttribute('stroke-dasharray', '2,2')
            }

            circle.setAttribute('fill', 'orange');
            circle.setAttribute('opacity', '0.25');


            for (let i = 0; i < clique.length; i++) {
                const circle = document.getElementById('node' + clique[i]);
                circle.setAttribute('fill', "lightblue");
            }

            await wait_for_play();
            return true;
        }
    }

    return false;
}


async function reduction() {
    // reset counters
    counterR0.textContent = 0;
    counterR1.textContent = 0;
    counterR2.textContent = 0;
    counterIter.textContent = 0;

    useR0 = document.getElementById('cb-r0').checked;
    useR1 = document.getElementById('cb-r1').checked;
    useR2 = document.getElementById('cb-r2').checked;
    useIter = document.getElementById('cb-iter').checked;

    let did_reduction = true;
    let nb_turns = 0;
    let nb_r1 = 0;
    let nb_r2 = 0;

    while (did_reduction) {
        nb_turns++;

        counterIter.textContent = parseInt(counterIter.textContent) + 1;
        did_reduction = false;
        graph.sortVertices();
        for (const vertex of graph.sortedVertices) {

            if (graph.reducedVertices.includes(vertex)) {
                continue;
            }

            if (useR2 && await reduction_commun_neighbors(vertex)) {
                console.log("reduction_commun_neighbors : ", vertex);
                nb_r1++;
                did_reduction = true;
                graph.deleteVertex(vertex);


            } else if ((useR0 || useR1) && await reduction_cliques(vertex)) {
                console.log("reduction_cliques : ", vertex);
                nb_r2++;
                did_reduction = true;
                graph.deleteVertex(vertex);
            }

        }

        if (!useIter) {
            break;
        }
    }

    console.log('nb vertices: ', graph.nbVertices, 'nb edges: ', graph.nbEdges, 'nb turns: ', nb_turns, 'nb r1: ', nb_r1, 'nb r2: ', nb_r2, 'nb r1 + nb r2: ', nb_r1 + nb_r2);
}
