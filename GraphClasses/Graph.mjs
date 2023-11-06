import { UndirectedEdge, DirectedEdge, Node } from "./Edge.mjs";
export { UndirectedEdge, DirectedEdge, Node } 
export class Graph {
    constructor(ctx) {
      this.ctx = ctx;
      this.n = 0;
      this.nodes = [];
      this.edges = [];
      this.sources = [];
      this.destinations = [];
    }

    getStringGraph() {
      var ans = [];
      for (const edge of this.edges) {
        ans.push(edge.n0.val.toString());
        ans.push(edge.weight.toString());
        ans.push(edge.n1.val.toString());
      }
      localStorage.setItem('dataed', JSON.stringify(ans));
      return ans;
    }

    getStringNodes() {
      var values = [];
      for (const node of this.nodes) {
        values.push(node.val.toString());
      }
      localStorage.setItem('array1', JSON.stringify(values));
      return values;
    }

    updateData() {
      this.getStringNodes();
      this.getStringGraph();
    }


    addNodeObject(node) {
      this.n++;
      this.nodes.push(node);
      node.val = this.n;

      this.updateData();

    }
    addNode(x, y) {
      this.n++;
      const val = this.n;
      this.nodes.push(new Node(x, y, val));

      this.updateData();

    }
    

    //create edge
    joinNodes(n0, n1) {
      if (!this.nodes.includes(n0)) {
        this.nodes.push(n0);
      }
      if (!this.nodes.includes(n1)) {
        this.nodes.push(n1);
      }

      newEdge = new UndirectedEdge(n0, n1);
      this.edges.push(newEdge);
      n0.edges.push(newEdge);
      n1.edges.push(newEdge);

      this.updateData();
    }

    joinNodesWithEdge(n0, n1, edge) {
      if (!this.nodes.includes(n0)) {
        this.nodes.push(n0);
      }
      if (!this.nodes.includes(n1)) {
        this.nodes.push(n1);
      }

      edge.n0 = n0;
      edge.n1 = n1;
      if (!this.edges.includes(edge)) {
        this.edges.push(edge);
      }

      n0.edges.push(edge);
      n1.edges.push(edge);

      this.updateData();
    }
    

    deleteNode(n0) {
      if (this.nodes.includes(n0)) {
        for (const edge of n0.edges) {
          const i = this.edges.indexOf(edge);
          this.edges.splice(i, 1);
        }
      }

      const i = this.nodes.indexOf(n0);
      this.nodes.splice(i, 1);

      this.updateIndexation();
      this.updateData();
    }

    deleteEdge(edge) {
      if (this.edges.includes(edge)) {
        const i = this.edges.indexOf(edge);
        this.edges.splice(i, 1);
      }

      this.updateData();
    }

  updateIndexation(){
    this.n = 0;
    for(var node of this.nodes){
      this.n++;
      node.val = this.n;
    }
  }

  update() {

    //console.log("contex>", this.ctx);
    for (const edge of this.edges) {
      edge.updatedDraw(this.ctx);
    }

    for (const node of this.nodes) {
      node.updatedDraw(this.ctx);
    }
  }
  
  getAdjMatrix(){
    var matrix = [];
    const n = this.nodes.length;
    for (let i = 0; i < n; i++) {
      const row = [];
      for (let j = 0; j < n; j++) {
        row.push(Infinity);
      }
      matrix.push(row);
    }

    for(const edge of this.edges){
      let oi = this.nodes.indexOf(edge.n0); 
      let di = this.nodes.indexOf(edge.n1); 
      matrix[oi][di] = parseFloat(edge.weight);
    }

    const jsonString = JSON.stringify(matrix);
    localStorage.setItem("adjMatrix", jsonString);
    return matrix;
  }

  getCostMatrix(){
      this.sources = [];
      this.destinations = [];
      const n = this.nodes.length;
      for (let i = 0; i < n; i++) {
        if(this.nodes[i].isSource){
          this.sources.push(this.nodes[i]);
        }
        else{
          this.destinations.push(this.nodes[i]);
        }
      }

      var matrix = [];
      const ni = this.sources.length;
      const nj = this.destinations.length;
    
    for (let i = 0; i < ni; i++) {
      const row = [];
      for (let j = 0; j < nj; j++) {
        row.push(Infinity);
      }
      matrix.push(row);
    }

    for(const edge of this.edges){ 
      if(edge.n0.isSource && !edge.n1.isSource){
        let oi = this.sources.indexOf(edge.n0); 
        let di = this.destinations.indexOf(edge.n1);
       // console.log("oi ", oi);
        //console.log("di", di);
        matrix[oi][di] = parseFloat(edge.weight);
      }
    }
    return matrix;
  }

  getEdgeWeight(nodeA, nodeB) {
    for (const edge of this.edges) {
      if (
        (edge.n0 === nodeA && edge.n1 === nodeB) ||
        (edge.n0 === nodeB && edge.n1 === nodeA)
      ) {
        return edge.weight;
      }
    }
    return 0;
  }

  getNodeByLabel(label) {
    return this.nodes.find(node => node.label === label);
  }


  hasDisconnectedNodes(matrix) {
      for (let i = 0; i < matrix.length; i++) {
          if (matrix[i].every(value => value === -1) && matrix.every(row => row[i] === -1)) {
              return true;
          }
      }
      return false;
  }

  johnsonCriticalPath(matrix) {
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

  findCriticalPath(){
    const criticalPath = this.johnsonCriticalPath(this.getAdjMatrix());
    console.log(this.getAdjMatrix());
    console.log(criticalPath);
    for(const node of this.nodes){
      node.isCritical = false;
    }

    for(const i of criticalPath){
      this.nodes[i].isCritical = true;
    }
  }

minCostAssignment(costMatrix) {
    const n = costMatrix.length; // Número de nodos de origen y destino
    const assigned = new Array(n).fill(false); // Arreglo para rastrear nodos asignados
    const assignment = []; // Arreglo para almacenar las asignaciones

    // Paso 1: Asignar nodos basados en filas de menor costo.
    for (let i = 0; i < n; i++) {
        // Copiamos la fila actual de la matriz de costos.
        const row = costMatrix[i].slice();

        // Encontramos el costo mínimo en la fila.
        let minVal = Math.min(...row);

        // Si el costo mínimo es "Infinity," esto significa que no hay conexiones directas.
        if (minVal === Infinity) {
            continue; // Ignoramos esta fila y pasamos a la siguiente.
        }

        // Encontramos el índice del nodo de destino con el costo mínimo.
        let minIndex = row.indexOf(minVal);

        // Marcar el nodo de origen como asignado.
        assigned[i] = true;

        // Registrar la asignación en el formato [nodo de origen, nodo de destino].
        assignment.push([i, minIndex]);
    }

    // Paso 2: Continuar con el algoritmo de asignación de costo mínimo.
    while (assignment.length < n) {
        // Inicializamos variables para rastrear el costo mínimo y los índices de los nodos.
        let minVal = Infinity;
        let minI = -1;
        let minJ = -1;

        // Recorremos la matriz de costos y buscamos los nodos no asignados.
        for (let i = 0; i < n; i++) {
            if (!assigned[i]) { // Si el nodo de origen no está asignado.
                for (let j = 0; j < costMatrix[i].length; j++) {
                    if (!assigned[j] && costMatrix[i][j] < minVal) { // Si el nodo de destino no está asignado y el costo es menor.
                        minVal = costMatrix[i][j];
                        minI = i; // Nodo de origen con costo mínimo.
                        minJ = j; // Nodo de destino con costo mínimo.
                    }
                }
            }
        }

        // Marcar ambos nodos (de origen y destino) como asignados.
        assigned[minI] = true;
        assigned[minJ] = true;

        // Registrar la asignación en el formato [nodo de origen, nodo de destino].
        assignment.push([minI, minJ]);
    }

    return assignment; // Devolver la asignación óptima.
}

maxCostAssignment(costMatrix) {
    const n = costMatrix.length; // Número de nodos de origen y destino
    const assigned = new Array(n).fill(false); // Arreglo para rastrear nodos asignados
    const assignment = []; // Arreglo para almacenar las asignaciones

    // Paso 1: Asignar nodos basados en filas de mayor costo.
    for (let i = 0; i < n; i++) {
        // Copiamos la fila actual de la matriz de costos.
        const row = costMatrix[i].slice();

        // Encontramos el costo máximo en la fila.
        let maxVal = Math.max(...row);

        // Si el costo máximo es "-Infinity," esto significa que no hay conexiones directas.
        if (maxVal === -Infinity) {
            continue; // Ignoramos esta fila y pasamos a la siguiente.
        }

        // Encontramos el índice del nodo de destino con el costo máximo.
        let maxIndex = row.indexOf(maxVal);

        // Marcar el nodo de origen como asignado.
        assigned[i] = true;

        // Registrar la asignación en el formato [nodo de origen, nodo de destino].
        assignment.push([i, maxIndex]);
    }

    // Paso 2: Continuar con el algoritmo de asignación de costo máximo.
    while (assignment.length < n) {
        // Inicializamos variables para rastrear el costo máximo y los índices de los nodos.
        let maxVal = -Infinity;
        let maxI = -1;
        let maxJ = -1;

        // Recorremos la matriz de costos y buscamos los nodos no asignados.
        for (let i = 0; i < n; i++) {
            if (!assigned[i]) { // Si el nodo de origen no está asignado.
                for (let j = 0; j < costMatrix[i].length; j++) {
                    if (!assigned[j] && costMatrix[i][j] > maxVal) { // Si el nodo de destino no está asignado y el costo es mayor.
                        maxVal = costMatrix[i][j];
                        maxI = i; // Nodo de origen con costo máximo.
                        maxJ = j; // Nodo de destino con costo máximo.
                    }
                }
            }
        }

        // Marcar ambos nodos (de origen y destino) como asignados.
        assigned[maxI] = true;
        assigned[maxJ] = true;

        // Registrar la asignación en el formato [nodo de origen, nodo de destino].
        assignment.push([maxI, maxJ]);
    }

    return assignment; // Devolver la asignación óptima de costo máximo.
}

findAssingment(maximize = true){
  let assignment = [];
  console.log(this.getCostMatrix());
  if(maximize){
    assignment = this.maxCostAssignment(this.getCostMatrix());
  }
  else{
    assignment = this.minCostAssignment(this.getCostMatrix());
  }

  console.log(assignment);
  for(const pair of assignment){
    for(var edge of this.sources[pair[0]].edges){
      console.log(edge.strokeColor);
      if(edge.n1 === this.destinations[pair[1]]){
        //console.log("tusi");
        edge.strokeColor = "blue";
        //break;
      }
    }
  }

  for(const edge of this.edges){
    console.log(edge.strokeColor);
  }
}




}
