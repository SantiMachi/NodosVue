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

  
  //Algorimto de Asignacion
  
  minCostAssignment(costMatrix) {
    return this.costAssignment(costMatrix, false);
  }

  maxCostAssignment(Matrix) {
    console.log(Matrix)
    return this.costAssignment(Matrix, true);
  }

  costAssignment(costMatrix, isMax) {
    console.log(costMatrix);
    const n = costMatrix.length;
    const assigned = new Array(n).fill(false);
    const assignment = [];

    for (let i = 0; i < n; i++) {
      const row = costMatrix[i].slice();
      const extremaVal = isMax ? Math.max(...row) : Math.min(...row);

      if (extremaVal === (isMax ? -Infinity : Infinity)) {
        continue;
      }

      if (row.every((val) => val === extremaVal)) {
        for (let j = 0; j < n; j++) {
          assignment.push(isMax ? [j, i] : [i, j]);
        }
      } else {
        const extremaIndex = row.indexOf(extremaVal);
        assigned[i] = true;
        assignment.push(isMax ? [i, extremaIndex] : [extremaIndex, i]);
      }
    }

    while (assignment.length < n) {
      let extremaVal = isMax ? -Infinity : Infinity;
      let extremaI = -1;
      let extremaJ = -1;

      for (let i = 0; i < n; i++) {
        if (!assigned[i]) {
          for (let j = 0; j < costMatrix[i].length; j++) {
            if (
              !assigned[j] &&
              ((isMax && costMatrix[i][j] > extremaVal) || (!isMax && costMatrix[i][j] < extremaVal))
            ) {
              extremaVal = costMatrix[i][j];
              extremaI = i;
              extremaJ = j;
            }
          }
        }
      }

      assigned[extremaI] = true;
      assigned[extremaJ] = true;
      assignment.push(isMax ? [extremaI, extremaJ] : [extremaJ, extremaI]);
    }

    return assignment;
  }

  findAssingment(maximize = true) {
    for (var edge of this.edges) {
      edge.isAssigned = false;
    }

    const assignment = maximize ? this.maxCostAssignment(this.getCostMatrix()) : this.minCostAssignment(this.getCostMatrix());

  
    console.log("Assignment:");
    console.table(assignment); 

    for (const pair of assignment) {
      for (var edge of this.sources[pair[0]].edges) {
        if (edge.n1 == this.destinations[pair[1]]) {
          edge.isAssigned = true;
          break;
        }
      }
    }
    for(const edge of this.edges){
      console.log(edge.isAssigned);
    }
    // Perform additional actions with the assignment if needed.
  }

  // ... (otros métodos)
}