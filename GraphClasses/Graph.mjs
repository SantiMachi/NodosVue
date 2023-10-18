import { UndirectedEdge, DirectedEdge, Node } from "./Edge.mjs";
export { UndirectedEdge, DirectedEdge, Node } 
export class Graph {
    constructor() {
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

    joinNodes1(n0, n1, edge) {
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

      this.updateData();
    }

    deleteEdge(edge) {
      if (this.edges.includes(edge)) {
        const i = this.edges.indexOf(edge);
        this.edges.splice(i, 1);
      }

      this.updateData();
    }

    update() {
      for (const edge of this.edges) {
        edge.updatedDraw();
      }

      for (const node of this.nodes) {
        node.updatedDraw();
      }
    }
  
    getAdjMatrix(){
      var matrix = [];
      const n = this.nodes.length;
      for (let i = 0; i < n; i++) {
        const row = [];
        for (let j = 0; j < n; j++) {
          row.push(-1);
        }
        matrix.push(row);
      }

      for(const edge of this.edges){
        let oi = this.nodes.indexOf(edge.n0); 
        let di = this.nodes.indexOf(edge.n1); 
        matrix[oi][di] = edge.weight;
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
          this.sources.push(i);
        }
        else{
          this.destinations.push(i);
        }
      }

      var matrix = [];
      const ni = this.sources.length;
      const nj = this.destinations.length;
      for (let i = 0; i < ni; i++) {
        const row = [];
        for (let j = 0; j < nj; j++) {
          row.push(0);
        }
        matrix.push(row);
      }

      for(const edge of this.edges){ 
      if(edge.n0.isSource && !edge.n1.isSource){
        let oi = this.sources.indexOf(edge.n0); 
        let di = this.destinations.indexOf(edge.n1);
        matrix[oi][di] = edge.weight;
      }
    }

    for (let i = 0; i < ni; i++) {
        const row = [];
        for (let j = 0; j < nj; j++) {
          console.log(matrix[i][j]);
        }
        console.log("\n");
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


findCriticalPath(adjMatrix) {
const numNodes = adjMatrix.length;
const earliestStart = new Array(numNodes).fill(0);
const latestStart = new Array(numNodes).fill(Infinity);
const stack = [];
const criticalPath = [];

// Calculate earliest start times
for (let i = 0; i < numNodes; i++) {
  for (let j = 0; j < numNodes; j++) {
    if (adjMatrix[i][j] > 0) {
      earliestStart[j] = Math.max(earliestStart[j], earliestStart[i] + adjMatrix[i][j]);
    }
  }
}

// Calculate latest start times
for (let i = numNodes - 1; i >= 0; i--) {
  latestStart[i] = earliestStart[numNodes - 1];
  for (let j = 0; j < numNodes; j++) {
    if (adjMatrix[i][j] > 0) {
      latestStart[i] = Math.min(latestStart[i], latestStart[j] - adjMatrix[i][j]);
    }
  }
  if (earliestStart[i] === latestStart[i]) {
    criticalPath.push(i);
  }
}

for(node of this.nodes){
  node.fillColor = "black";
}

criticalPath.reverse(); // Reverse to get the path in the correct order
for(const i of criticalPath){
      this.nodes[i].fillColor = "red";
    }
    return criticalPath;
}

clearArrays(...arrays) {
for (const arr of arrays) {
  arr.fill(false);  
}
}

solveAssignmentProblem(adjacencyMatrix) {
const numRows = adjacencyMatrix.length;
const numCols = adjacencyMatrix[0].length;

// Step 1: Subtract the minimum value from each row
for (let i = 0; i < numRows; i++) {
  const row = adjacencyMatrix[i];
  const minVal = Math.min(...row);
  for (let j = 0; j < numCols; j++) {
    adjacencyMatrix[i][j] -= minVal;
  }
}

// Step 2: Subtract the minimum value from each column
for (let j = 0; j < numCols; j++) {
  const col = adjacencyMatrix.map(row => row[j]);
  const minVal = Math.min(...col);
  for (let i = 0; i < numRows; i++) {
    adjacencyMatrix[i][j] -= minVal;
  }
}

// Step 3: Cover the zeros with the minimum number of lines
const rowCovered = new Array(numRows).fill(false);
const colCovered = new Array(numCols).fill(false);
const lines = Math.min(numRows, numCols);

for (let step = 1; step <= 3; step++) {
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      if (adjacencyMatrix[i][j] === 0 && !rowCovered[i] && !colCovered[j]) {
        rowCovered[i] = true;
        colCovered[j] = true;
      }
    }
  }
  this.clearArrays(rowCovered, colCovered);
}

// Step 4: Find the minimum uncovered value
let minUncovered = Infinity;
for (let i = 0; i < numRows; i++) {
  for (let j = 0; j < numCols; j++) {
    if (!rowCovered[i] && !colCovered[j] && adjacencyMatrix[i][j] < minUncovered) {
      minUncovered = adjacencyMatrix[i][j];
    }
  }
}

// Step 5: Modify the matrix
for (let i = 0; i < numRows; i++) {
  for (let j = 0; j < numCols; j++) {
    if (rowCovered[i] && colCovered[j]) {
      adjacencyMatrix[i][j] += minUncovered;
    } else if (!rowCovered[i] && !colCovered[j]) {
      adjacencyMatrix[i][j] -= minUncovered;
    }
  }
}

// Step 6: Repeat until an optimal assignment is found
const assignment = new Array(numRows).fill(-1);
for (let i = 0; i < numRows; i++) {
  for (let j = 0; j < numCols; j++) {
    if (adjacencyMatrix[i][j] === 0 && assignment[i] === -1) {
      assignment[i] = j;
    }
  }
}

// Calculate the maximum value of the assignment
let maxAssignmentValue = 0;
for (let i = 0; i < numRows; i++) {
  if (assignment[i] !== -1) {
    maxAssignmentValue += adjacencyMatrix[i][assignment[i]];
  }
}

console.log("Monto maximizado", maxAssignmentValue);
return maxAssignmentValue;
}



}
