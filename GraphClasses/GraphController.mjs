import {Node, DirectedEdge, UndirectedEdge, Graph} from "./Graph.mjs"
export {Node, DirectedEdge, UndirectedEdge, Graph}
export class GraphController{
    constructor(){
        this.canvas = document.createElement("canvas");
        this.canvas.style.borderStyle = "solid"; 
        this.canvas.style.borderColor = "black";
        this.canvas.style.borderWidth = "3px";
        this.resizeVisualFrame(window.innerWidth, window.innerHeight);
        this.ctx = this.canvas.getContext("2d");
        this.viewPortWidth = this.canvas.width;
        this.viewPortHeight = this.canvas.height;
        this.graph = null;
        this.adj = null;
        this.selectedNode = null;
        this.selectedEdge = null;
        this.pointerState = 0; // 0.idle 1.creating_node 2.creating_edge 3.editing 4.dragging

        this.fileInput = document.createElement('input');
        this.fileInput.type = "file";
        this.fileInput.id = "fileInput";
        this.fileInput.style.display = "none";
        document.body.appendChild(this.fileInput);

        this.mouse = {
            x: undefined,
            y: undefined,
            dx: undefined,
            dy: undefined
        }

        this.attachListeners();
        this.initMenus();
    }


    createGraph(isDirected = false){
        this.graph = new Graph(this.ctx, isDirected);
        this.adj = this.graph.adj.container;    
        return this.graph;
    }

    resizeVisualFrame(width, height){
        this.canvas.width = width;
        this.canvas.height = height;
        this.viewPortWidth = width;
        this.viewPortHeight = height;
    }

    attachListeners(){
        window.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        });

        window.addEventListener("resize", (e) => {
            this.resizeVisualFrame(window.innerWidth, window.innerHeight);
        });

        window.addEventListener("mousemove", (e) => {
            const last_x = this.mouse.x;
            const last_y = this.mouse.y;

            this.mouse.x = e.clientX - this.canvas.getBoundingClientRect().left;
            this.mouse.y = e.clientY - this.canvas.getBoundingClientRect().top;

            this.mouse.dx = this.mouse.x - last_x;
            this.mouse.dy = this.mouse.y - last_y;

            if(this.mouse.x < 0 || this.mouse.x > this.viewPortWidth
            || this.mouse.y < 0 || this.mouse.y > this.viewPortHeight || !this.graph){
                if(this.pointerState == 2){
                    this.selectedNode = null;
                    this.selectedEdge = null;
                    this.pointerState = 0;
                }
                else if(this.pointerState == 4){
                    this.selectedNode = null;
                    this.selectedEdge = null;
                    this.pointerState = 0;
                }
                return;
            }
            
            if(this.pointerState){
                if(this.pointerState == 2){
                    this.selectedEdge.n1.dryMove(this.mouse.x, this.mouse.y);

                    let f = false;
                    for(var node of this.graph.nodes){
                        if(node.isInside(this.mouse.x, this.mouse.y)){
                            if(node == this.selectedNode){
                                this.selectedEdge.isSelfDirected = true;
                                this.selectedEdge.relativeX = this.mouse.x - this.selectedEdge.n0.x;
                                this.selectedEdge.relativeY = this.mouse.y - this.selectedEdge.n0.y;
                                f = true;
                            }
                        }
                    }

                    if(!f) this.selectedEdge.isSelfDirected = false;
                }
                else if(this.pointerState == 4){
                    if(this.selectedNode){
                        this.selectedNode.dryMove(this.mouse.x, this.mouse.y);
                    }
                }
            }
            
        })

        this.canvas.addEventListener("mousedown", (e) =>{
            if(!this.graph) return;
            
            if(this.pointerState == 0){
                let snode = null;
                let sedge = null;
                for(let i = this.graph.n-1; i >= 0; i--){
                    let node = this.graph.nodes[i];
                    if(node.isInside(this.mouse.x, this.mouse.y)){
                        snode = node;
                        break;
                    }
                }

                for(let i = this.graph.conections-1; i >=0 ; i--){
                    let edge = this.graph.edges[i];
                    if(edge.isInside(this.mouse.x, this.mouse.y)){
                        sedge = edge;
                        break;
                    }
                }


                if(e.button == 0){
                    if(!snode && !sedge){
                        let nnode = this.generateNode(this.mouse.x, this.mouse.y);
                        this.graph.addNodeObject(nnode);
                        this.selectedNode = this.graph.nodes[this.graph.n-1];
                        this.pointerState = 1;
                    }
                    else if(snode){
                        this.selectedNode = snode;
                        let dummyNode = this.generateNode(this.mouse.x, this.mouse.y);
                        this.selectedEdge = this.generateEdge(this.selectedNode, dummyNode);

                        if(this.selectedEdge != null){
                            this.pointerState = 2;
                        }
                        else{
                            this.selectedNode = null;
                            this.selectedEdge = null;
                            this.pointerState = 0;
                        }
                    }
                }
                else if(e.button == 2){
                    if(snode){
                        this.selectedNode = snode;
                        this.selectedEdge = null;
                        this.pointerState = 4;
                    }
                    else if(sedge){
                        this.selectedEdge = sedge;
                        this.selectedNode= null;
                        this.pointerState = 4;
                    }
                    else{
                        this.selectedEdge = null;
                        this.selectedNode = null;
                        this.pointerState = 0;
                    }
                }
                else if(this.pointerState == 3){
                    ///Completar condicion de cierre;
                    if(this.selectedNode){
                        this.selectedNode.isSelected = false;
                        this.closeNodeMenu();
                        this.selectedNode = null;
                    }
                    
                    if(this.selectedEdge){
                        this.selectedEdge.isSelected = false;
                        this.closeEdgeMenu();
                        this.selectedEdge = null;
                    }
                    this.pointerState = 0;
                }
            }
            else if(this.pointerState == 2){
                this.selectedNode = null;
                this.selectedEdge = null;
                this.pointerState = 0;
            }
            else if(this.pointerState == 4){
                this.selectedNode = null;
                this.selectedEdge = null;
                this.pointerState = 0;
            }
        })

        this.canvas.addEventListener("mouseup", (e) => {
            if(!this.graph) return;
            //Completar condicion de cierre;

            let snode = null;
            let sedge = null;
            for(let i = this.graph.n-1; i >= 0; i--){
                let node = this.graph.nodes[i];
                if(node.isInside(this.mouse.x, this.mouse.y)){
                    snode = node;
                    break;
                }
            }

            for(let i = this.graph.conections-1; i >=0 ; i--){
                let edge = this.graph.edges[i];
                if(edge.isInside(this.mouse.x, this.mouse.y)){
                    sedge = edge;
                    break;
                }
            }

            if(this.pointerState == 1){
                if(e.button == 0){
                    this.showNodeMenu(this.selectedNode);
                    this.pointerState = 3;
                }
            }
            else if(this.pointerState == 2){
                if(e.button == 0){
                    if(snode){
                        this.graph.joinNodesWithEdge(this.selectedNode, snode, this.selectedEdge);
                        if(snode == this.selectedNode){
                            this.selectedEdge.isSelfDirected = true;   
                        }
                    }
                    
                    this.selectedNode = null;
                    this.selectedEdge = null;
                    this.pointerState = 0;
                }      
            }
            else if(this.pointerState == 3){
                ///Completar condicion de cierre;
                if(this.selectedNode){
                    this.selectedNode.isSelected = false;
                    this.selectedNode.impulse(
                        (this.mouse.x - this.selectedNode.x)/50,
                        (this.mouse.y - this.selectedNode.y)/50);
                    this.closeNodeMenu();
                    this.selectedNode = null;
                }
                
                if(this.selectedEdge){
                    this.selectedEdge.isSelected = false;
                    this.closeEdgeMenu();
                    this.selectedEdge = null;
                }
                this.pointerState = 0;
            }
            else if(this.pointerState == 4){
                if(e.button == 2){
                    if(snode && snode==this.selectedNode){
                        this.showNodeMenu(this.selectedNode);
                        this.selectedNode.impulse(this.mouse.dx/10,this.mouse.dy/10);
                        this.selectedNode.isSelected = true;
                        this.pointerState = 3;
                    }
                    else if(sedge && sedge==this.selectedEdge){
                        this.showEdgeMenu(this.selectedEdge);
                        this.selectedEdge.isSelected = true;
                        this.pointerState = 3;
                    }
                    else{
                        this.selectedNode = null;
                        this.selectedEdge = null;
                        this.pointerState = 0;
                    }
                }
            }
        });
    
    }

    initMenus(){
        this.nodeMenu = {
            visualElement : document.createElement("div"),

            initialice(){
                this.visualElement.style.display = "none";
                this.visualElement.innerHTML = `
                <div class="context_menu_item" id="node_name_b">
                    <label for="node_name_p">Nombre</label>
                    <input type="text" id="node_name_p">
                </div>

                <div class="context_menu_item" id="is_source_b">
                    <label for="is_source_p">Nodo fuente:</label>
                    <input type="checkbox" id="is_source_p">
                </div>

                <div class="context_menu_item" id="node_val_b">
                    <label for="node_val_p">Valor</label>
                    <input type="number" step="0.1" id="node_val_p">
                </div>

                <div class="context_menu_item">
                    <label for="node_cp">Color</label>
                    <input type="color" id="node_cp" name="colorPicker">
                </div>
            
                <div class="context_menu_item" id="node_delete_b">
                    <label for="node_delete_b">Eliminar</label>
                </div> `;

                document.body.appendChild(this.visualElement);
                this.nodeNamePicker = document.getElementById("node_name_p");
                this.isSourcePicker = document.getElementById("is_source_p");
                this.nodeValPicker = document.getElementById("node_val_p");
                this.nodeColorPicker = document.getElementById("node_cp");
                this.nodeDeleteButton = document.getElementById("node_delete_b");

                this.visualElement.classList.add("context_menu");
                this.visualElement.id = "node_cm";
            },
            display(x, y){
                this.visualElement.style.top = y + "px";
                this.visualElement.style.left = x + "px";
                this.visualElement.style.display = 'block';
            },

            hide(){
                this.visualElement.style.display = 'none';
            }
        }

        this.edgeMenu = {
            visualElement : document.createElement("div"),
            initialice(){
                this.visualElement.style.display = "none";
                this.visualElement.innerHTML = `
                <div class="context_menu_item" id="edge_weight_b">
                    <label for="colorPicker">Peso</label>
                    <input type="number" step="0.1" id="edge_weight_p" name="colorPicker">
                </div>
                <div class="context_menu_item">
                    <label for="colorPicker">Color</label>
                    <input type="color" id="edge_cp" name="colorPicker">
                </div>

                <div class="context_menu_item" id="edge_delete_b">
                    <label for="edge_delete_b">Eliminar</label>
                </div>
                `
                document.body.appendChild(this.visualElement);
                this.edgeWeightPicker = document.getElementById("edge_weight_p");
                this.edgeColorPicker = document.getElementById("edge_cp");
                this.edgeDeleteButton = document.getElementById("edge_delete_b");

                this.visualElement.classList.add("context_menu");
                this.visualElement.id = "edge_cm";
            },

            display(x, y){
                this.visualElement.style.top = y + "px";
                this.visualElement.style.left = x + "px";
                this.visualElement.style.display = 'block';
            },

            hide(){
                this.visualElement.style.display = 'none';
            }
        }

        let link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/GraphClasses/ContexMenuStyles.css"
        document.head.appendChild(link);

        this.nodeMenu.initialice();
        this.edgeMenu.initialice();
        
        this.nodeMenu.nodeNamePicker.addEventListener("input", e => {
            if(!this.graph) return;
            this.selectedNode.label = e.target.value;
            this.graph.updateData();
        });
        
        this.nodeMenu.isSourcePicker.addEventListener("change", e => {
            if(!this.graph) return;
            if(isSourcePicker.checked){
                this.selectedNode.isSource = true;
            }
            else{
                this.selectedNode.isSource = false;
            }
        });
        
        this.nodeMenu.nodeValPicker.addEventListener("input", e => {
            if(!this.graph) return;
            this.selectedNode.val = e.target.value;
        });
        
        this.nodeMenu.nodeColorPicker.addEventListener("input", e => {
            if(!this.graph) return;
            this.selectedNode.setFillColor(e.target.value);
        });
        
        this.nodeMenu.nodeDeleteButton.addEventListener("click", e => {
            if(!this.graph) return;
            this.graph.deleteNode(this.selectedNode);
            this.selectedNode = null;
            this.pointerState = 0;
            this.closeNodeMenu();
        });
        
        
        
        this.edgeMenu.edgeWeightPicker.addEventListener("input", e => {
            if(!this.graph) return;
            this.selectedEdge.weight = parseFloat(e.target.value);
            this.graph.updateData();
        });
        
        this.edgeMenu.edgeColorPicker.addEventListener("input", e => {
            if(!this.graph) return;
            this.selectedEdge.setStrokeColor(e.target.value);
        });
        
        this.edgeMenu.edgeDeleteButton.addEventListener("click", e => {
            if(!this.graph) return;
            this.graph.deleteEdge(this. selectedEdge);
            this.selectedEdge = null;
            this.pointerState = 0;
            this.closeEdgeMenu();
        });
    }

    showNodeMenu(node){
        if(!this.graph) return;
        this.nodeMenu.nodeNamePicker.value = node.label;
        this.nodeMenu.isSourcePicker.checked = node.isSource;
        this.nodeMenu.nodeValPicker.value = node.val;
        this.nodeMenu.nodeColorPicker.value = node.fillColor;

        let x = node.x + node.R;
        let y = node.y - node.R;
        
        if (x + this.nodeMenu.visualElement.offsetWidth > this.canvas.width) {
        x = this.canvas.width - this.nodeMenu.offsetWidth;
        }
        if (y + this.nodeMenu.visualElement.offsetHeight > window.innerHeight) {
        y = this.canvas.height - this.nodeMenu.offsetHeight;
        }
    
        this.nodeMenu.display(x, y);
    }

    closeNodeMenu(){
        if(!this.graph) return;
        this.nodeMenu.hide();
    }
    
    showEdgeMenu(edge){
        if(!this.graph) return;
        this.edgeMenu.edgeWeightPicker.value = edge.weight;
        this.edgeMenu.edgeColorPicker.value = edge.strokeColor;

        let x = (edge.n0.x + edge.n1.x)/2 + 20;
        let y = (edge.n0.y + edge.n1.y)/2;

        if (x + this.edgeMenu.visualElement.offsetWidth > window.innerWidth) {
        x = this.canvas.width - this.edgeMenu.offsetWidth;
        }
        if (y + this.edgeMenu.visualElement.offsetHeight > window.innerHeight) {
        y = this.canvas.height - this.edgeMenu.offsetHeight;
        }
    
        this.edgeMenu.display(x, y);
    }


    closeEdgeMenu(){
        if(!this.graph) return;
        this.edgeMenu.hide();
    }

    generateEdge(n0, n1){
        if(!this.graph) return;

        return new this.graph.edgeType(n0, n1, 0, null);
    }

    generateNode(x, y, val = 0, id = null){
        return new Node(x, y, val, id, "");
    }

    getVisualFrame(){
        return this.canvas;
    }

    getVisualMatrix(){
        return this.adj;
    }
      
    downloadFile() {
      
        var lnodes = [];
        var ledges = [];
    
        for(var node of this.graph.nodes){
            node.edges.splice(0, node.edges.length);
            lnodes.push(node);
        }
        for(var edge of this.graph.edges){
            ledges.push(edge);
        }
        const jsonString = JSON.stringify({
            isDirected : this.graph.isDirected,
            nodes : lnodes,
            edges : ledges
        });
        const filename = 'Project1.json';
      
        // Create a blob with the data
        const blob = new Blob([jsonString], { type: 'application/json' });
      
        // Create a temporary URL for the file
        const url = window.URL.createObjectURL(blob);
      
        // Create a link and trigger a click to download the file
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
      
        // Clean up
        window.URL.revokeObjectURL(url);
    }
    
                
    


    loadFile(){
        this.fileInput.click();
        let self = this;
        this.fileInput.addEventListener('change', function(event) {
            const selectedFile = event.target.files[0];
            const reader = new FileReader();
      
            reader.onload = function(event) {
                try {
                    var data = JSON.parse(event.target.result);
                    self.createGraph(data.isDirected);
                    for(const node_data of data.nodes){
                        var nnode = self.generateNode(node_data.x, node_data.y, node_data.val, node_data.id);
    
                        nnode.isSelected = node_data.isSelected;
                        nnode.t = node_data.t;
                        nnode.label = node_data.label;
                        nnode.val = node_data.val;
                        nnode.valueColor = node_data.valueColor;
                        nnode.labelColor = node_data.labelColor;
                        nnode.font = node_data.font;
                        nnode.edges = node_data.edges;
                        nnode.isCritical = node_data.isCritical;
                        nnode.isSource = node_data.isSource;
                        self.graph.addNodeObject(nnode);
                    }
    
    
                    for(const edge_data of data.edges){
    
                        var nn0 = self.graph.nodes[edge_data.n0.id-1];
                        var nn1 = self.graph.nodes[edge_data.n1.id-1];

                        var nedge;
                        nedge = new self.graph.edgeType(nn0, nn1, parseFloat(edge_data.weight), self.graph.conections+1);
                        
    
                        if(nn0 == nn1) nedge.isSelfDirected =  true;
    
                        nedge.id = edge_data.id;
                        nedge.isAssigned = edge_data.isAssigned;
                        nedge.arrowDirection = edge_data.direction;
                        nedge.arrowLength = 20;
                        nedge.headX = edge_data.targetX;
                        nedge.headY = edge_data.targetY;
    
                        self.graph.joinNodesWithEdge(nn0, nn1, nedge);
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            };
      
            reader.readAsText(selectedFile);
        });
        return self.graph;
    }  

    draw () {
        requestAnimationFrame(this.draw.bind(this));
    
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if(this.graph){
            if (this.selectedEdge) {
                this.selectedEdge.updatedDraw(this.ctx);
            }
            
            this.graph.update();
        } 
    }
}


