import {Node, UndirectedEdge, DirectedEdge, Graph, GraphController} from "../../GraphClasses/GraphController.mjs";

const criticalPathButton = document.getElementById("criticalPath_btn");
const matrixButton = document.getElementById("adj_Button");
const newNodeButton = document.getElementById("new_node_button");
const saveButton = document.getElementById("save_btn");
const loadButton = document.getElementById("load_btn");
var matrixContainer = document.getElementById("myDropdown");



class JohnsonEdge extends DirectedEdge{
  constructor(n0, n1, weight, id){
    super(n0, n1, weight, id);
    this.forwardLabel = "cucu";
    this.backwardLabel = "caca";
  }
  draw(ctx){
    super.draw(ctx);

    let normal_direction = this.direction;
    if(this.direction < Math.PI){ 
      normal_direction  = this.direction + (Math.PI/2);
    }
    else{
      normal_direction  = this.direction - (Math.PI/2);
    }
    const px = 20*Math.cos(normal_direction);
    const py = 20*Math.sin(normal_direction);
    
    const x = ((this.originX + this.targetX) / 2) + px;
    const y = ((this.originY + this.targetY) / 2) + py;
    
    ctx.beginPath();
    ctx.save();
    ctx.translate(x, y); 
    ctx.rotate(this.direction);
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, 20, 20);
    ctx.fillText(this.forwardLabel, 0,0);
    ctx.fillStyle = "orange";
    ctx.fillRect(-20, 0, 20, 20);
    ctx.fillText(this.backwardLabel,-20,0);
    
    ctx.restore();
    ctx.closePath();
  }

}

class JohnsonGraphController extends GraphController{
  constructor(){
    super();
  }

  createGraph(){
    this.graph = new Graph(this.ctx, true, false, JohnsonEdge);
    this.adj = this.graph.adj.container;    
    return this.graph;
  }
}


var controller = new JohnsonGraphController();
var graph = controller.createGraph(false);
var canvas = controller.getVisualFrame();
controller.resizeVisualFrame(window.innerWidth, window.innerHeight);

document.body.appendChild(canvas);
matrixContainer.appendChild(controller.getVisualMatrix());

controller.draw();

criticalPathButton.addEventListener("click", e =>{   
  graph = controller.graph;
  findCriticalPath();
});

matrixButton.addEventListener("click", e => {
  matrixContainer.style.display = (matrixContainer.style.display === "block") ? "none" : "block";
  matrixContainer.removeChild(matrixContainer.lastChild);
  matrixContainer.appendChild(controller.getVisualMatrix());
})

newNodeButton.addEventListener("click", e => {
  graph = controller.graph;
  graph.adj.agregarNodo();
});

saveButton.addEventListener("click", e =>{
  controller.downloadFile();
})

loadButton.addEventListener('click', e => { 
  controller.loadFile();
});





function findCriticalPath(){
  const criticalPath = this.johnsonCriticalPath(graph.getAdjMatrix());
  console.log(this.getAdjMatrix());
  console.log(criticalPath);
  for(const node of this.nodes){
    node.isCritical = false;
  }

  for(const i of criticalPath){
    this.nodes[i].isCritical = true;
  }
}

function johnsonCriticalPath(matrix) {
  console.log(matrix);
    const n = matrix.length;
    const dist = new Array(n).fill(0);

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (matrix[i][j] !== Infinity) {
                dist[j] = Math.max(dist[j], dist[i] + matrix[i][j]);
            }
        }
    }

    const criticalPath = [];
    let current = dist.indexOf(Math.max(...dist));

    while (current !== -1) {
        criticalPath.unshift(current);
        let prev = -1;
        for (let i = 0; i < n; i++) {
            if (matrix[i][current] !== Infinity && dist[current] === dist[i] + matrix[i][current]) {
                prev = i;
                break;
            }
        }
        current = prev;
    }

    return criticalPath;
}

