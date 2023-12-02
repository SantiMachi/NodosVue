import {Node, UndirectedEdge, DirectedEdge, Graph, GraphController} from "../../GraphClasses/GraphController.mjs";
import { convertToPixels, extractFontSize } from "../../Utilities/TextUtils.mjs";
const shortestPathButton = document.getElementById("shortestPath_btn");
const longestPathButton = document.getElementById("longestPath_btn");
const matrixButton = document.getElementById("adj_Button");
const newNodeButton = document.getElementById("new_node_button");
const saveButton = document.getElementById("save_btn");
const loadButton = document.getElementById("load_btn");
var matrixContainer = document.getElementById("myDropdown");
const resButton = document.getElementById("res");


class KruskalGraphController extends GraphController{
  constructor(){
    super();
  }

  generateNode(x, y, val = 0, id = null){
    return new Node(x, y, 0, null);
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

  resButton.innerHTML = "Resultado: " + findShortestPath();
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

  resButton.innerHTML = "Resultado: " + findLongestPath();
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

  let kruskal = new Kruskal(graph.getAdjMatrix(), true);

  const result = kruskal.kruskal();
  console.log(result)
  var sum = 0;
  result.forEach(([node1, node2]) => {
      const edge = findEdgeBetweenNodes(graph.edges, graph.nodes[node1], graph.nodes[node2]);
      if (edge) {
          graph.nodes[node1].isCritical = true;
          graph.nodes[node2].isCritical = true;
          edge.isAssigned = true;
          sum += parseFloat(edge.weight) 
      }
  });

  return sum;

}


function findLongestPath(){

  let kruskal = new Kruskal(graph.getAdjMatrix(), false);

  const result = kruskal.kruskal();
  var sum = 0;
  result.forEach(([node1, node2]) => {
      const edge = findEdgeBetweenNodes(graph.edges, graph.nodes[node1], graph.nodes[node2]);
      if (edge) {
          graph.nodes[node1].isCritical = true;
          graph.nodes[node2].isCritical = true;
          edge.isAssigned = true;
          sum += parseFloat(edge.weight)
      }
  });

  return sum;

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