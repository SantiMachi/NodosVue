import { UndirectedEdge, DirectedEdge, Node } from "./Edge.mjs";
export { UndirectedEdge, DirectedEdge, Node } 


class AdjacencyMatrix{
      constructor(graph = null){
        this.matrix = [];
        this.nodeNames = [];
        this.graph = null;
        this.n = 0;
        this.container = document.createElement('div');
        this.container.innerHTML = '';
        
        let link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/GraphClasses/AdjMatrixStyles.css";
        document.head.appendChild(link);

        if(graph != null) this.update(graph);
        
      }

      isFloat(str) {
        // Regular expression to match a floating-point number
        const floatRegex = /^[-+]?[0-9]*\.?[0-9]+$/;
      
        // Check if the string matches the pattern
        return floatRegex.test(str);
      }

      renderData() {
        this.container.innerHTML = '';

        const table = document.createElement('table');
        table.classList.add(".matrix_table");

        // Encabezado con nombres de nodos
        const headerRow = document.createElement('tr');
        headerRow.appendChild(document.createElement('th')); // Celda vacía en la esquina superior izquierda

        for (let i = 0; i < this.nodeNames.length; i++) {
            const th = document.createElement('th');
            th.textContent = this.nodeNames[i];
            headerRow.appendChild(th);
        }

        table.appendChild(headerRow);
        // Cuerpo de la matriz
        for (let i = 0; i < this.n; i++) {
            const row = document.createElement('tr');

            // Primer celda con nombre de nodo
            const nodeNameCell = document.createElement('td');
            nodeNameCell.textContent = this.nodeNames[i];
            row.appendChild(nodeNameCell);

            for (let j = 0; j < this.n; j++) {
                const cell = document.createElement('td');
                if(this.get(i,j) == Infinity) cell.textContent = "x";
                else cell.textContent = this.get(i,j).toString();
                cell.addEventListener('click', () => this.editarCelda(i, j));
                row.appendChild(cell);
            }

            // Botón para eliminar el nodo
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', () => this.eliminarNodo(i));

            // Contenedor para el botón "Eliminar"
            const deleteButtonContainer = document.createElement('div');
            deleteButtonContainer.classList.add('delete-button-container');
            deleteButtonContainer.appendChild(deleteButton);

            // Agregar el contenedor al final de la fila
            row.appendChild(deleteButtonContainer);

            table.appendChild(row);
        }

        this.container.appendChild(table);  
      }


      agregarNodo() {
        const newNodeName = prompt('Ingrese el nombre del nuevo nodo:');
        if (newNodeName) {
            this.graph.addNode(40, 40, newNodeName);
        }
      }

      editarCelda(fila, columna) {
        const nuevoValor = prompt(`Ingrese el nuevo valor para la celda [${this.nodeNames[fila]}, ${this.nodeNames[columna]}]:`);
        if(nuevoValor == "" || nuevoValor == null || nuevoValor == "inf" || !this.isFloat(nuevoValor)){
          if(this.matrix[fila][columna] != Infinity){
            this.graph.deleteEdge(this.matrix[fila][columna]);
            return;
          }
        }
        
        this.set(fila, columna, parseFloat(nuevoValor));
    }

    eliminarNodo(index) {
      this.graph.deleteNode(this.graph.nodes[index]);
    }

    obtenerMatriz() {
      console.log('Matriz de Adyacencia:', matrix);
      console.log('Nombres de Nodos:', nodeNames);
    }


      update(agraph = this.graph){
        this.graph = agraph;
        this.n = this.graph.n;
        this.matrix = [];
        this.nodeNames = [];

        for(var node of this.graph.nodes){
          if(node.label == ""){
            let i = this.graph.nodes
            this.nodeNames.push(node.id.toString());
          } 
          else this.nodeNames.push(node.label);
        }
        this.n = agraph.n;
        for(let i = 0; i < this.n; i++){
          this.matrix.push([]);
          for(let j = 0; j < this.n; j++){
            this.matrix[i].push(Infinity);
          }
        }
        for(var edge of agraph.edges){
          let u = agraph.nodes.indexOf(edge.n0);
          let v = agraph.nodes.indexOf(edge.n1);

          if(this.graph.isDirected){
            this.matrix[u][v] = edge;
          }
          else{
            this.matrix[u][v] = edge;
            this.matrix[v][u] = edge;
          }
        }

        this.renderData();
      }

      erase(i, j){
        this.graph.deleteEdge(this.matrix[i][j]);
      }
      set(i, j, val){
        if(i < 0 || i >= this.n || j < 0 || j >= this.n) return Infinity;
        else{
          if(this.matrix[i][j] == Infinity){
            let u = this.graph.nodes[i];
            let v = this.graph.nodes[j];
            
            this.graph.joinNodes(u, v, val);
          }
          else{
            var edge = this.matrix[i][j] == Infinity;
            edge.weight = val;

            this.graph.updateData();
          }
        }
      }
      get(i, j){
        if(i < 0 || i >= this.n || j < 0 || j >= this.n) return Infinity;
        else{
          if(this.matrix[i][j] == Infinity) return Infinity;
          else return this.matrix[i][j].weight;
        }
      }
}


export class Graph {
    constructor(ctx, isDirected = false, isBidirectional = false, edgeType = UndirectedEdge) {
      this.ctx = ctx;
      this.n = 0;
      this.conections = 0;
      this.nodes = [];
      this.edges = [];
      this.sources = [];
      this.destinations = [];
      this.isDirected = isDirected;
      this.isBidirectional = isBidirectional;
      this.edgeType = edgeType;
      this.adj = new AdjacencyMatrix(this);
      
    }

    updateData() {
      this.updateIndexation();
      this.adj.update();
    }


    addNodeObject(node) {
      this.n++;
      this.nodes.push(node);
      node.id = this.n;
      this.updateData();
    }
    addNode(x, y, name = "") {
      this.n++;
      this.nodes.push(new Node(x, y, 0, this.n, name));

      this.updateData();
    }
    

    //create edge
    joinNodes(n0, n1, val = 0) {
      if (!this.nodes.includes(n0)) {
        this.addNodeObject(n0);
      }
      if (!this.nodes.includes(n1)) {
        this.addNodeObject(n1);
      }
      
      let u = this.nodes.indexOf(n0);
      let v = this.nodes.indexOf(n1);
      
      if(this.isBidirectional){
        if(this.adj.get(u, v) != Infinity){
          return;
        }
      }
      else{
        if(this.adj.get(u, v) != Infinity || this.adj.get(v, u) != Infinity){
          return;
        }
      }
      

      var newEdge;
      if(this.adj.get(u, v) == Infinity){
        
        newEdge = new this.edgeType(n0, n1, val,  this.conections+1);
        
        this.edges.push(newEdge);
        n0.edges.push(newEdge);
        n1.edges.push(newEdge);

        if(n0 == n1){
          newEdge.isSelfDirected = true;
        }
      }
      

      this.updateData();
    }

    joinNodesWithEdge(n0, n1, edge) {
      if(edge.constructor != this.edgeType) return;
      
      if (!this.nodes.includes(n0)) {
        this.addNodeObject(n0);
      }
      if (!this.nodes.includes(n1)) {
        this.addNodeObject(n1);
      }

      edge.n0 = n0;
      edge.n1 = n1;
      let u = this.nodes.indexOf(n0);
      let v = this.nodes.indexOf(n1);

      if(this.isBidirectional){
        if(this.adj.get(u, v) != Infinity){
          return;
        }
      }
      else{
        if(this.adj.get(u, v) != Infinity || this.adj.get(v, u) != Infinity){
          return;
        }
      }

      this.edges.push(edge);
      n0.edges.push(edge);
      n1.edges.push(edge);
      if(n0 == n1){
        edge.isSelfDirected = true;
      }

      this.updateData();
    }

    deleteNode(n0) {
      if (this.nodes.includes(n0)) {
        var i;
        var c = 0;
        
        for (const edge of n0.edges) {
          i = this.edges.indexOf(edge);
          this.edges.splice(i, 1);

          if(n0 != edge.n0 || n1 != edge.n1){
            if(n0 == edge.n0){
              i = edge.n1.edges.indexOf(edge);
              edge.n1.edges.splice(edge);
            }
            else{
              i = edge.n0.edges.indexOf(edge);
              edge.n0.edges.splice(edge);
            }
          }
        }

        i = this.nodes.indexOf(n0);
        this.nodes.splice(i, 1);
      }

      

      this.updateData();
    }

    deleteEdge(edge) {
      if (this.edges.includes(edge)) {
        var i = this.edges.indexOf(edge);
        this.edges.splice(i, 1);

        i = edge.n0.edges.indexOf(edge);
        edge.n0.edges.splice(i, 1);

        i = edge.n1.edges.indexOf(edge);
        edge.n1.edges.splice(i, 1);
      }

      this.updateData();
    }

  updateIndexation(){
    this.n = 0;
    for(var node of this.nodes){
      this.n++;
      //if(node.val == "" || node.val == null) 
      node.id = this.n;
    }

    this.conections = 0;
    for(var edge of this.edges){
      this.conections++;
      edge.id = this.conections;
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
    for(let row of this.adj.matrix){
      var nrow = []
      for(let cel of row){
        if(cel == Infinity) nrow.push(Infinity);
        else nrow.push(cel.weight);
      }
      matrix.push(nrow);
    }
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
}