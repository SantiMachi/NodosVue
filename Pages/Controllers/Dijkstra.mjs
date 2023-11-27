import {Node, UndirectedEdge, DirectedEdge, Graph, GraphController} from "../../GraphClasses/GraphController.mjs";

const adjMatrixButton = document.getElementById("adjMatrix_btn");
const dijkstraButton = document.getElementById("dijkstra_btn");
const assignmentButton = document.getElementById("assignment_btn");
const matrixButton = document.getElementById("adj_Button");
const newNodeButton = document.getElementById("new_button");
const saveButton = document.getElementById("save_btn");
const loadButton = document.getElementById("load_btn");
var matrixContainer = document.getElementById("myDropdown");

dijkstraButton.addEventListener("click", e =>{   
  findShortestPath();
});

criticalPathButton.addEventListener("click", e =>{   
graph.findCriticalPath();
});

assignmentButton.addEventListener("click", e =>{   
graph.findAssingment();
});

matrixButton.addEventListener("click", e => {
  toggleDropdown();
})

newNodeButton.addEventListener("click", e => {
  graph.adj.agregarNodo();
});

saveButton.addEventListener("click", e =>{
  controller.downloadFile();
})

loadButton.addEventListener('click', function() {
  controller.loadFile();
});


    // Función para alternar la visibilidad del menú desplegable
function toggleDropdown() {
  matrixContainer.style.display = (matrixContainer.style.display === "block") ? "none" : "block";
}


var controller = new GraphController();
var graph = controller.createGraph(false);
var canvas = controller.getVisualFrame();
controller.resizeVisualFrame(window.innerWidth, window.innerHeight);

document.body.appendChild(canvas);
matrixContainer.appendChild(graph.adj.container);

controller.draw();



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