import {Node, DirectedEdge, UndirectedEdge, Graph} from "../GraphClasses/Graph.mjs"

console.log("Chambea Kruskal")

var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

let selectedNode = null;
let isDragging = false;

let selectedEdge = null;
let isDrawingEdge = false;
let isEditing = false;

var graph = new Graph(ctx);

var mouse = {
    x: undefined,
    y: undefined,
    dx: undefined,
    dy: undefined
}

window.addEventListener("mousemove", (e) => {
    const last_x = mouse.x;
    const last_y = mouse.y;

    mouse.x = e.clientX - canvas.getBoundingClientRect().left;
    mouse.y = e.clientY - canvas.getBoundingClientRect().top;

    mouse.dx = mouse.x - last_x;
    mouse.dy = mouse.y - last_y;

    if (isDragging && selectedNode) {
    selectedNode.x = mouse.x;
    selectedNode.y = mouse.y;
    }
    else if (isDrawingEdge && selectedNode && selectedEdge) {
    selectedEdge.n1.x = mouse.x;
    selectedEdge.n1.y = mouse.y;

    let f = true;
    for(var nodo of graph.nodes){
        if(nodo.isInside(mouse.x, mouse.y)){
            if(nodo == selectedNode){
            selectedEdge.isSelfDirected = true;
            selectedEdge.relativeX = mouse.x - selectedEdge.n0.x;
            selectedEdge.relativeY = mouse.y - selectedEdge.n0.y;
            f = false;
            }
            break;
        }
    }

    if(f){
        selectedEdge.isSelfDirected = false;
    }
    }
});

canvas.addEventListener("mousedown", (e) => {

    if (isEditing) {
    if (selectedNode) {
        selectedNode.isSelected = false;
        nodeMenu.style.display = 'none';
    }
    

    if (selectedEdge){
    selectedEdge.isSelected = false;
    edgeMenu.style.display = 'none';
    }
    //selectedNode = null;
    //selectedEdge = null;
    isEditing = false;
    }//boton 0 click izquierdo

    else if (e.button == 0) {
    for (const node of graph.nodes) {
        if (node.isInside(mouse.x, mouse.y)) {
        selectedNode = node;
        isDrawingEdge = true;
        selectedEdge = new DirectedEdge(selectedNode, new Node(mouse.x, mouse.y), 0);
        break;
        }
    }

    if (!isDragging && !isDrawingEdge && !isEditing) {
        graph.addNode(mouse.x, mouse.y, 0);
        console.log("Nodo creado ejex", mouse.x, "ejeY", mouse.y);
    }
    }
    else if (e.button == 2) {
    for (var node of graph.nodes) {
        if (node.isInside(mouse.x, mouse.y)) {
        selectedNode = node;
        isDragging = true;
        break;
        }
    }
    }
});

canvas.addEventListener("mouseup", (e) => {

    if (isDrawingEdge) {
    for (const node of graph.nodes) {
        if (node.isInside(mouse.x, mouse.y)) {
        if (node != selectedNode) {
            graph.joinNodesWithEdge(selectedNode, node, selectedEdge);
            break;
        }
        else{
            selectedEdge.isSelfDirected = true;
            graph.joinNodesWithEdge(selectedNode, node, selectedEdge);
        }
        }
    }
    selectedNode = null;
    selectedEdge = null;
    isDrawingEdge = false;
    }

    else if (isDragging) {
    selectedNode.dx = mouse.dx;
    selectedNode.dy = mouse.dy;
    isDragging = false;

    selectedEdge = false;
    selectedNode.isSelected = true;
    isEditing = true;

    showNodeMenu(mouse.x + selectedNode.r + 10, mouse.y); //TODO
    }

    else if (!isDragging && !isDrawingEdge && !isEditing) {
    for (const edge of graph.edges) {
        if (edge.isInside(mouse.x, mouse.y)) {

        selectedNode = null;
        selectedEdge = edge;
        selectedEdge.isSelected = true;
        isEditing = true;

        showEdgeMenu(mouse.x, mouse.y); //TODO
        break;
        }
    }
    }
});


const nodeMenu = document.getElementById("node_cm");
const edgeMenu = document.getElementById("edge_cm");

const nodeNamePicker = document.getElementById("node_name_p");
const isSourcePicker = document.getElementById("is_source_p");
const nodeValPicker = document.getElementById("node_val_p");
const nodeColorPicker = document.getElementById("node_cp");
const nodeDeleteButton = document.getElementById("node_delete_b");

const edgeWeightPicker = document.getElementById("edge_weight_p");
const edgeColorPicker = document.getElementById("edge_cp");
const edgeDeleteButton = document.getElementById("edge_delete_b");

window.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});


//escuchar cambio nombre
nodeNamePicker.addEventListener("input", e => {
    selectedNode.label = e.target.value;
});

isSourcePicker.addEventListener("change", e => {
if(isSourcePicker.checked){
    selectedNode.isSource = true;
}
else{
    selectedNode.isSource = false;
}
});

nodeValPicker.addEventListener("input", e => {
    selectedNode.val = e.target.value;
});

nodeColorPicker.addEventListener("input", e => {
    console.log(e.target.value);
    selectedNode.setFillColor(e.target.value);
});


nodeDeleteButton.addEventListener("click", e => {
    graph.deleteNode(selectedNode);
    selectedNode = null;
    nodeMenu.style.display = 'none';
});



edgeWeightPicker.addEventListener("input", e => {
    selectedEdge.weight = e.target.value;
});

edgeColorPicker.addEventListener("input", e => {
    selectedEdge.setStrokeColor(e.target.value);
});

edgeDeleteButton.addEventListener("click", e => {
    graph.deleteEdge(selectedEdge);
    selectedEdge = null;
    edgeMenu.style.display = 'none';
});
function showNodeMenu(x, y) {

    if (x + nodeMenu.offsetWidth > window.innerWidth) {
    x = window.innerWidth - nodeMenu.offsetWidth;
    }
    if (y + edgeMenu.offsetHeight > window.innerHeight) {
    y = window.innerHeight - nodeMenu.offsetHeight;
    }

    nodeMenu.style.left = x;
    nodeMenu.style.top = y;
    nodeMenu.style.display = 'block';

    console.log("joderrr");
}

function showEdgeMenu(x, y) {

    if (x + edgeMenu.offsetWidth > window.innerWidth) {
    x = window.innerWidth - edgeMenu.offsetWidth;
    }
    if (y + edgeMenu.offsetHeight > window.innerHeight) {
    y = window.innerHeight - edgeMenu.offsetHeight;
    }

    edgeMenu.style.left = x;
    edgeMenu.style.top = y;
    edgeMenu.style.display = 'block';

}


export function uploadFile(){
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
  
    fileInput.addEventListener('change', function(event) {
        const selectedFile = event.target.files[0];
        const reader = new FileReader();
  
        reader.onload = function(event) {
            try {
                var data = JSON.parse(event.target.result);
                graph = new Graph(ctx);

                for(const node_data of data.nodes){
                    var nnode = new Node(node_data.x, node_data.y, node_data.val, node_data.id);

                    nnode.isSelected = node_data.isSelected;
                    nnode.t = node_data.t;
                    nnode.label = node_data.label;
                    nnode.val = node_data.val;
                    nnode.valueColor = node_data.valueColor;
                    nnode.labelColor = node_data.labelColor;
                    nnode.font = node_data.font;
                    nnode.edges = node_data.edges;
                    nnode.isCritical = node_data.isCritical;
                    nnode.isSource = node_data.isSource;
                    graph.addNodeObject(nnode);
                }


                for(const edge_data of data.edges){

                    var nn0 = null;
                    var nn1 =  null;
                    for(var node of graph.nodes){
                        if(node.val == edge_data.n0.val){
                            nn0 = node;
                        }
                        
                        if(node.val == edge_data.n1.val){
                            nn1 = node;
                        }

                        if(nn0 && nn1) break;
                    }
                    var nedge = new DirectedEdge(nn0, nn1, edge_data.weight);
                    if(nn0 == nn1) nedge.isSelfDirected =  true;

                    nedge.id = edge_data.id;
                    nedge.isAssigned = edge_data.isAssigned;
                    nedge.arrowDirection = edge_data.direction;
                    nedge.arrowLength = 20;
                    nedge.headX = edge_data.targetX;
                    nedge.headY = edge_data.targetY;

                    graph.joinNodesWithEdge(nn0, nn1, nedge);
                }

                //graph.edges = data.edges;
                console.log('Loaded object:', data);
                console.log('Loaded object:', graph);
                // Use the 'graph' object here or trigger subsequent actions
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        };
  
        reader.readAsText(selectedFile);
    });
  }  
  
export function downloadFile() {
  
    var nodes = [];
    var edges = [];

    for(var node of graph.nodes){
        node.edges.splice(0, node.edges.length);
        nodes.push(node);
    }
    for(var edge of graph.edges){
        edges.push(edge);
    }
    const jsonString = JSON.stringify({
        nodes : nodes,
        edges : edges
    });
    const filename = 'Project1.json';
  
    // Create a blob with the data
    const blob = new Blob([jsonString], { type: 'application/json' });
  
    // Create a temporary URL for the file
    const url = window.URL.createObjectURL(blob);
  
    // Create a link and trigger a click to download the file
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  
    // Clean up
    window.URL.revokeObjectURL(url);
  }

function draw() {
    requestAnimationFrame(draw);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (selectedEdge) {
    selectedEdge.updatedDraw(ctx);
    }

    graph.update();
    //console.log(graph);
}

export function Treekruskal() {
    const kruskal = new Kruskal(graph.getAdjMatrix());

    // Restablecer los colores a su estado por defecto (negro)
    graph.edges.forEach(edge => {
        edge.defaultStrokeColor='black';
    });

    const result = kruskal.kruskal();

    result.forEach(([node1, node2]) => {
        const edge = findEdgeBetweenNodes(graph.edges, graph.nodes[node1], graph.nodes[node2]);
        if (edge) {
            edge.defaultStrokeColor = 'green'; // Colorear los bordes que están en el árbol de expansión mínima
        }
    });

    result.forEach(([node1, node2]) => {
        graph.nodes[node1].label = `Distancia[${kruskal.matrizAdyacencia[node1][node2]}]`;
        graph.nodes[node2].label = `Distancia[${kruskal.matrizAdyacencia[node1][node2]}]`;
    });
}

function findEdgeBetweenNodes(edges, node1, node2) {
    return edges.find(edge =>
        (edge.n0 === node1 && edge.n1 === node2) ||
        (edge.n0 === node2 && edge.n1 === node1)
    );
}

function findEdgeByNodes(node1, node2) {
    for (let i = 0; i < Edge.length; i++) {
        const edge = Edge[i];
        if (
            (edge.n0.id === node1 && edge.n1.id === node2) ||
            (edge.n0.id === node2 && edge.n1.id === node1)
        ) {
            return edge; 
        }
    }
    return null; 
}
//propiedad 

class Kruskal {
    constructor(matrizAdyacencia) {
        this.matrizAdyacencia = matrizAdyacencia;
        this.n = matrizAdyacencia.length;
        this.conjuntos = new Array(this.n).fill().map((_, index) => [index]);
        this.aristas = this.generarAristas();
        this.aristasOrdenadas = this.ordenarAristas();
        this.arbolAbarcadorMinimo = [];
    }

    generarAristas() {
        const aristas = [];
        for (let i = 0; i < this.n; i++) {
            for (let j = i + 1; j < this.n; j++) {
                if (this.matrizAdyacencia[i][j] !== -1) {
                    aristas.push([i, j, this.matrizAdyacencia[i][j]]);
                }
            }
        }
        return aristas;
    }

    ordenarAristas() {
        return this.aristas.sort((a, b) => a[2] - b[2]);
    }

    encontrar(conjunto, nodo) {
        for (let i = 0; i < conjunto.length; i++) {
            if (conjunto[i].includes(nodo)) {
                return i;
            }
        }
        return -1;
    }

    unirConjuntos(conjunto1, conjunto2) {
        return conjunto1.concat(conjunto2);
    }

    kruskal() {
        let aristasAgregadas = 0;

        for (let arista of this.aristasOrdenadas) {
            const [nodo1, nodo2, peso] = arista;
            const conjuntoNodo1 = this.encontrar(this.conjuntos, nodo1);
            const conjuntoNodo2 = this.encontrar(this.conjuntos, nodo2);

            if (conjuntoNodo1 !== conjuntoNodo2) {
                this.arbolAbarcadorMinimo.push([nodo1, nodo2, peso]);
                this.conjuntos[conjuntoNodo1] = this.unirConjuntos(this.conjuntos[conjuntoNodo1], this.conjuntos[conjuntoNodo2]);
                this.conjuntos.splice(conjuntoNodo2, 1);
                aristasAgregadas++;
            }

            if (aristasAgregadas === this.n - 1) {
                break;
            }
        }
        return this.arbolAbarcadorMinimo;
    }
}



draw();

export{graph};