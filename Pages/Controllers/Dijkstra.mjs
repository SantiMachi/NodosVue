import {Node, UndirectedEdge, DirectedEdge, Graph, GraphController} from "../../GraphClasses/GraphController.mjs";
import { convertToPixels, extractFontSize } from "../../Utilities/TextUtils.mjs";
const shortestPathButton = document.getElementById("shortestPath_btn");
const matrixButton = document.getElementById("adj_Button");
const newNodeButton = document.getElementById("new_node_button");
const saveButton = document.getElementById("save_btn");
const loadButton = document.getElementById("load_btn");
var matrixContainer = document.getElementById("myDropdown");

class DijkstraNode extends Node{
  constructor(x, y, val, id, label = ""){
    super(x, y, val, label);
    this.isOrigin = false;
    this.isTarget = false;
    this.distance = null;
  }

  update(){
    super.update()
    if(this.isOrigin){
      this.label = "Inicio";
      this.fillColor = "#00e660";
    }
    else if(this.isTarget){
      this.label = "Final";
      this.fillColor = "#ff2a00";
    }
    else{
      this.fillColor = "black";
      this.label = "";
    }
  }

  draw(ctx){
    super.draw(ctx);

    const x = this.x;
    const y = this.y - this.r - 40;

    if(this.distance != null){
      ctx.font = this.font;
      ctx.fillStyle = this.labelColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText("Distancia: " + this.distance.toFixed(1), this.x, this.y - this.r - extractFontSize(this.font));
    }
  }
}

class DijkstraGraphController extends GraphController{
  constructor(){
    super();
    var o_button = document.createElement("div");
    o_button.innerHTML = `
    <div class="context_menu_item" id="node_origin_b">
      <label for="node_origin_b">Origen</label> 
    </div>
    `;

    var t_button = document.createElement("div");
    t_button.innerHTML = `
    <div class="context_menu_item" id="node_target_b">
      <label for="node_target_b">Destino</label> 
    </div>
    `;

    o_button.addEventListener("click", e => {
      if(origin != null){
      origin.isOrigin = false;
      origin.isTarget = false;
      }
      console.log(origin);  
      origin = this.selectedNode;
      origin.isOrigin = true;
      origin.isTarget = false;
    });

    t_button.addEventListener("click", e => {
      if(target != null){
      target.isOrigin = false;
      target.isTarget = false;
      }
      target = this.selectedNode;
      target.isOrigin = false;
      target.isTarget = true;
    });

    this.nodeMenu.visualElement.appendChild(o_button);
    this.nodeMenu.visualElement.appendChild(t_button);

  }

  createGraph(isDirected = true){
    this.graph = new Graph(this.ctx, true, true, DirectedEdge);
    this.adj = this.graph.adj.container;    
    return this.graph;
  }

  generateNode(x, y, val = 0, id = null){
    return new DijkstraNode(x, y, 0, null);
  }
}


var controller = new DijkstraGraphController();
var graph = controller.createGraph();
var origin = null;
var target = null;
var canvas = controller.getVisualFrame();
controller.resizeVisualFrame(window.innerWidth, window.innerHeight);

document.body.appendChild(canvas);
matrixContainer.appendChild(controller.getVisualMatrix());

controller.draw();

shortestPathButton.addEventListener("click", e =>{   
  graph = controller.graph;
  for(let node of graph.nodes){
    node.isCritical = false;
    node.distance = null;
  }
  for(let edge of graph.edges){
    edge.isAssigned = false;
  }

  findShortestPath();
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


function findShortestPath(){
  const calc = new Dijkstra(graph.getAdjMatrix());

  if(!origin || !target) {
    alert("Seleccione Origen y Destino");
    return;
  }
  const res = calc.dijkstra(origin.id-1);
  const dis = res.distancias[target.id-1];

  if(dis == Infinity) {
    alert("No hay camino disponible");
    return;
  }
  const ruta = res.rutas[target.id-1];
  //console.log();
  console.log("y", ruta);
  for(let j = 0; j < ruta.length; j++){
    let i = ruta[j];
    graph.nodes[i].isCritical = true;
    if(j < ruta.length-1){
      graph.adj.matrix[i][ruta[j+1]].isAssigned = true;
    }
  }

  graph.nodes[target.id-1].distance = dis;
  console.log(graph.nodes[target.id-1]);
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
        if(nodo == -1) break;
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
