import {Node, DirectedEdge, UndirectedEdge, Graph} from "../GraphClasses/Graph.mjs"

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

    if(isDragging){
        selectedNode.dryMove(mouse.x, mouse.y);
    }
});

canvas.addEventListener("mousedown", (e) => {

    if (isEditing) {
    if (selectedNode) {
        selectedNode.isSelected = false;
        nodeMenu.style.display = 'none';
    }
    isEditing = false;
    }//boton 0 click izquierdo

    else if (e.button == 0) {

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

if (isDragging) {
    selectedNode.inertialMove(mouse.x+mouse.dx, mouse.y+mouse.dy);
    isDragging = false;

    selectedEdge = false;
    selectedNode.isSelected = true;
    isEditing = true;

    showNodeMenu(mouse.x + selectedNode.r + 10, mouse.y); //TODO
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

    //console.log("joderrr");
}

function getAngle(a, b){
    return Math.atan2(a.y, a.x) - Math.atan2(b.y, b.x); 
}


graph.nodes.sort(getAngle);

function draw() {
    requestAnimationFrame(draw);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (selectedEdge) {
    selectedEdge.updatedDraw(ctx);
    }

    graph.update();
}

draw();