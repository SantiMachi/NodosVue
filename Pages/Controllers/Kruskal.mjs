import {Node, UndirectedEdge, DirectedEdge, Graph, GraphController} from "../../GraphClasses/GraphController.mjs";
import { convertToPixels, extractFontSize } from "../../Utilities/TextUtils.mjs";
const shortestPathButton = document.getElementById("shortestPath_btn");
const longestPathButton = document.getElementById("longestPath_btn");
const matrixButton = document.getElementById("adj_Button");
const newNodeButton = document.getElementById("new_node_button");
const saveButton = document.getElementById("save_btn");
const loadButton = document.getElementById("load_btn");
var matrixContainer = document.getElementById("myDropdown");

class KruskalNode extends Node{
  constructor(x, y, val, id, label = ""){
    super(x, y, val, label);
    this.isOrigin = false;
    this.isTarget = false;
  }

  update(){
    super.update()
    if(this.isOrigin){
      this.label = "Inicio";
      this.fillColor = "#00e660";
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
      ctx.fillText("Costo Total: " + this.distance.toFixed(1), this.x, this.y - this.r - extractFontSize(this.font));
    }
  }
}

class KruskalGraphController extends GraphController{
  constructor(){
    super();
    var o_button = document.createElement("div");
    o_button.innerHTML = `
    <div class="context_menu_item" id="node_origin_b">
      <label for="node_origin_b">Origen</label> 
    </div>
    `;

    o_button.addEventListener("click", e => {
      if(origin){
      origin.isOrigin = false;
      }
      origin = this.selectedNode;
      origin.isOrigin = true;
    });

    this.nodeMenu.visualElement.appendChild(o_button);

  }

  generateNode(x, y, val = 0, id = null){
    return new KruskalNode(x, y, 0, null);
  }
}


var controller = new KruskalGraphController();
var graph = controller.createGraph(false);
var origin = null;
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

longestPathButton.addEventListener("click", e =>{   
  graph = controller.graph;
  for(let node of graph.nodes){
    node.isCritical = false;
    node.distance = null;
  }
  for(let edge of graph.edges){
    edge.isAssigned = false;
  }

  findLongestPath();
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

  if(!origin) {
    alert("Seleccione Origen");
    return;
  }
  let kruskal = new Kruskal(graph.getAdjMatrix(), true);

  //console.log(origin)
  //console.log(graph.getAdjMatrix());
  const result = kruskal.kruskal();
  console.log(result)
  var sum = 0;
  result.forEach(([node1, node2]) => {
      const edge = findEdgeBetweenNodes(graph.edges, graph.nodes[node1], graph.nodes[node2]);
      if (edge) {
          graph.nodes[node1].isCritical = true;
          graph.nodes[node2].isCritical = true;
          edge.isAssigned = true;
          sum += parseFloat(edge.weight) // Colorear los bordes que están en el árbol de expansión mínima
      }
  });

  origin.distance = sum;

}


function findLongestPath(){

  if(!origin) {
    alert("Seleccione Origen");
    return;
  }
  let kruskal = new Kruskal(graph.getAdjMatrix(), false);

  const result = kruskal.kruskal();
  var sum = 0;
  result.forEach(([node1, node2]) => {
      const edge = findEdgeBetweenNodes(graph.edges, graph.nodes[node1], graph.nodes[node2]);
      if (edge) {
          graph.nodes[node1].isCritical = true;
          graph.nodes[node2].isCritical = true;
          edge.isAssigned = true;
          sum += parseFloat(edge.weight) // Colorear los bordes que están en el árbol de expansión mínima
      }
  });

  origin.distance = sum;

}

function findEdgeBetweenNodes(edges, node1, node2) {
  return edges.find(edge =>
      (edge.n0 === node1 && edge.n1 === node2) ||
      (edge.n0 === node2 && edge.n1 === node1)
  );
}

class Kruskal {
  constructor(matrizAdyacencia, minimize = true) {
      this.matrizAdyacencia = matrizAdyacencia;
      this.n = matrizAdyacencia.length;
      this.conjuntos = new Array(this.n).fill().map((_, index) => [index]);
      this.minimize = minimize;
      this.aristas = this.generarAristas();
      this.aristasOrdenadas = this.ordenarAristas();
      this.arbolAbarcadorMinimo = [];
  }

  generarAristas() {
      const aristas = [];
      for (let i = 0; i < this.n; i++) {
          for (let j = i + 1; j < this.n; j++) {
              if (this.matrizAdyacencia[i][j] !== Infinity) {
                  aristas.push([i, j, this.matrizAdyacencia[i][j]]);
              }
          }
      }
      return aristas;
  }

  ordenarAristas() {
      if(this.minimize){
        console.log("Minimize");
        return this.aristas.sort((a, b) => a[2] - b[2]);
      }
      else{
        console.log("Maximize");
        return this.aristas.sort((a, b) => b[2] - a[2]);
      }
      
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