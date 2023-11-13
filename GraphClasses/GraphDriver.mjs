import {Node, DirectedEdge, UndirectedEdge, Graph} from "./Graph.mjs"

console.log("chambea")

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



export function findShortestPath(){
    const calc = new Dijkstra(graph.getAdjMatrix());

    if(!selectedNode) return;
    
    //console.log();
    selectedNode.isCritical = true;
    let o = graph.nodes.indexOf(selectedNode); 
    const res = calc.dijkstra(o);
    const dist = res.distancias;

    for(let i = 0; i < dist.length; i++){
        if(i == o) graph.nodes[i].label = "Origen";
        else graph.nodes[i].label = "Distancia[" + dist[i] + "]";
    }

}

class Dijkstra{
    constructor(matrizAdyacencia) {
        this.matrizAdyacencia = matrizAdyacencia;
        this.n = matrizAdyacencia.length;
        this.distancias = new Array(this.n).fill(Infinity);
        this.visitados = new Array(this.n).fill(false);
        this.rutas = new Array(this.n).fill([]);
    }

    dijkstra(nodoInicial) {
        this.distancias[nodoInicial] = 0;
        this.rutas[nodoInicial] = [nodoInicial];

        for (let i = 0; i < this.n; i++) {
        let nodo = this.nodoConDistanciaMinimaNoVisitado();
        this.visitados[nodo] = true;

        for (let j = 0; j < this.n; j++) {
            if (!this.visitados[j] && this.matrizAdyacencia[nodo][j] !== Infinity) {
            const costoAlternativo = this.distancias[nodo] + this.matrizAdyacencia[nodo][j];
            if (costoAlternativo < this.distancias[j]) {
                this.distancias[j] = costoAlternativo;
                this.rutas[j] = this.rutas[nodo].concat(j);
            }
            }
        }
        }

        return {
        distancias: this.distancias,
        rutas: this.rutas,
        };
    }

    nodoConDistanciaMinimaNoVisitado() {
        let distanciaMinima = Infinity;
        let nodoMin = -1;

        for (let i = 0; i < this.n; i++) {
        if (!this.visitados[i] && this.distancias[i] < distanciaMinima) {
            distanciaMinima = this.distancias[i];
            nodoMin = i;
        }
        }

        return nodoMin;
    }
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


draw();

export{graph};