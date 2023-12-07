import {Node, UndirectedEdge, DirectedEdge, Graph, GraphController} from "../../GraphClasses/GraphController.mjs";
import { convertToPixels, extractFontSize } from "../../Utilities/TextUtils.mjs";
import {Ball, drawRoundedRect } from "../../GraphClasses/Node.mjs";

const criticalPathButton = document.getElementById("criticalPath_btn");
const competButton = document.getElementById("compet_btn")
const adjMatrixButton = document.getElementById("adjMatrix_btn");
const dijkstraButton = document.getElementById("dijkstra_btn");
const assignmentButton = document.getElementById("assignment_btn");
const matrixButton = document.getElementById("adj_Button");
const newNodeButton = document.getElementById("new_button");
const saveButton = document.getElementById("save_btn");
const loadButton = document.getElementById("load_btn");
var matrixContainer = document.getElementById("myDropdown");


class Slider extends Ball{
  constructor(x, y){
    super(x, y);
  }

}

class SlideBar{
  constructor(ctx, x, y, length, width = 10, horizontal  =  true){
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.length = length;
    this.width = width;
    this.horizontal = horizontal;

    if(this.horizontal){
      this.slider = new Slider(this.x + this.length/2, this.y + this.width/2);
    }
    else{
      this.slider = new Slider(this.x  + this.width/2, this.y + this.length/2);
    }

    this.slider.R = this.width/2 + 2;
    this.slider.r = this.width/2 + 2;
    //console.log(this.slider.R);
  }

  updateSliderPosition(x, y){
    if(this.horizontal){
      this.slider.x = Math.min(this.x + this.length, x);
      this.slider.x = Math.max(this.x, this.slider.x);
    }
    else{
      this.slider.y = Math.min(this.y + this.length, y);
      this.slider.y = Math.max(this.y, this.slider.y);
    }
  }

  getValue(){
    if(this.horizontal) return (this.slider.x - this.x)/this.length;
    else return (this.slider.y - this.y)/this.length;
  }

  isInside(x, y){
    return this.slider.isInside(x, y);
  }

  draw(ctx){
    ctx.fillStyle = "black";
    ctx.globalAlpha = 0.5;
    if(this.horizontal){
      drawRoundedRect(ctx, this.x, this.y, this.length, this.width, this.width/2);
    }
    else{
      drawRoundedRect(ctx, this.x, this.y, this.width, this.length, this.width/2);
    }
    ctx.globalAlpha = 1;    

    this.slider.draw(this.ctx);
  }
}


class CompetNode extends Node{
  constructor(x, y, val, id, label = ""){
    super(x, y, "", id, label);
    
    this.posx = null;
    this.posy = null;
  }

  inertialMove(x1, y1) {
    this.dx = 0;
    this.dy = 0;

    this.x = x1;
    this.y = y1;
    //console.log("Estoy en el inertial move");
  }

  impulse(dx, dy){
    this.dx = 0;
    this.dy = 0;
  }

  draw(ctx){
    super.draw(ctx);

    const x = this.x;
    const y = this.y - this.R - 40;

    ctx.beginPath();
    ctx.save();
    ctx.translate(x, y);

    let pos = "x: " + this.posx.toFixed(1) +"   y: " + this.posy.toFixed(1);
    let width = ctx.measureText(pos).width + 30;
    let height = extractFontSize(this.font);

    ctx.font = this.font;
    ctx.strokeStyle = "black";
    ctx.lineWidth = "2";
    
    ctx.fillStyle = "black";
    ctx.fillRect(-width/2, 0, width, (5/4)*height);
    
    ctx.fillStyle = "white";
    ctx.fillText(pos, 0, (5/8)*height);
    
    ctx.restore();
    ctx.closePath();
    }

}

class CompetEdge extends UndirectedEdge {
  constructor(n0, n1, weight, id) {
    super(n0, n1, weight, id);
  }
  draw(ctx) {

    ctx.strokeStyle = this.strokeColor;
    ctx.lineWidth = 4;

    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(this.n0.x, this.n0.y);
    ctx.lineTo(this.n1.x, this.n1.y);
    ctx.stroke();
  }

}

class CompetGraphController extends GraphController {
  constructor() {
    super();

    this.x_field = document.createElement("div");
    this.x_field.innerHTML = `
    <div class="context_menu_item" id="node_x_b">
        <label for="node_val_p">x</label>
        <input type="number" step="0.1" id="node_x_p">
    </div>
    `;

    this.y_field = document.createElement("div");
    this.y_field.innerHTML = `
    <div class="context_menu_item" id="node_y_b">
        <label for="node_val_p">y</label>
        <input type="number" step="0.1" id="node_y_p">
    </div>
    `;

    this.x_field.addEventListener("input", e => {
      this.selectedNode.posx = parseFloat(e.target.value);
    });

    this.y_field.addEventListener("input", e => {
      this.selectedNode.posy = parseFloat(e.target.value);
    });

    this.nodeMenu.visualElement.appendChild(this.x_field);
    this.nodeMenu.visualElement.appendChild(this.y_field);

    this.y_data_field = document.getElementById("node_y_p");
    this.x_data_field = document.getElementById("node_x_p");

    this.selectedSlider = null;

    this.scopex = 0;
    this.scopey = 0;
    this.scale = 1;

    this.ppu = 20;

    this.zslider = new SlideBar(this.ctx, 800, 800, 100, 20, true);

    this.canvas.addEventListener("mousemove", e => {

      if(this.selectedSlider != null){
        this.selectedSlider.updateSliderPosition(this.mouse.x, this.mouse.y);
      }
    })

    this.canvas.addEventListener("mousedown", e => {
      if(this.zslider.isInside(this.mouse.x, this.mouse.y)) this.selectedSlider = this.zslider;
      
      if(this.selectedSlider != null) e.stopPropagation();
    }, true);

    this.canvas.addEventListener("mouseup", e => {
      this.selectedSlider = null;
    })

    this.getZoom();

  }

  getZoom(){
    this.scale = 10*(this.zslider.getValue() + 1/1000); 
  }

  attachListeners(){
    window.addEventListener("contextmenu", (e) => {
        e.preventDefault();
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
              else{
                this.scopex -= this.mouse.dx/(this.ppu/this.scale) ;
                this.scopey += this.mouse.dy/(this.ppu/this.scale)  ;
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
              this.pointerState = 4;
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
                this.lastx = null;
                this.lasty = null;
                this.pointerState = 0;
            }
        }
    });

}

  drawGrid(){
    let x = this.scopex;
    let y = this.scopey;
    
    let fl = Math.ceil(x);
    let bl = Math.floor(x);

    let xo = 400;
    let yo = 400;

    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 1;
    let pos = xo + (bl-x)*(this.ppu/this.scale);

   // console.log((bl-x));

    while(pos > 60){
      this.ctx.beginPath();
      this.ctx.moveTo(pos, 30 );
      this.ctx.lineTo(pos, 800);
      this.ctx.stroke();
      this.ctx.closePath();

      pos -= (this.ppu/this.scale);
    }

    pos = xo + (fl-x)*(this.ppu/this.scale);
    
    while(pos < 800){
      this.ctx.beginPath();
      this.ctx.moveTo(pos, 30);
      this.ctx.lineTo(pos, 800);
      this.ctx.stroke();
      this.ctx.closePath();

      pos += (this.ppu/this.scale);
    }

    fl = Math.ceil(y);
    bl = Math.floor(y);

    pos = yo - (bl-y)*(this.ppu/this.scale);

   //console.log(this.vslider.getValue());

    while(pos < 800){
      this.ctx.beginPath();
      this.ctx.moveTo(30, pos);
      this.ctx.lineTo(800, pos);
      this.ctx.stroke();
      this.ctx.closePath();

      pos += (this.ppu/this.scale);
    }

    pos = yo - (fl-y)*(this.ppu/this.scale);
    
    while(pos > 60){
      this.ctx.beginPath();
      this.ctx.moveTo(30, pos);
      this.ctx.lineTo(800, pos);
      this.ctx.stroke();
      this.ctx.closePath();

      pos -= (this.ppu/this.scale);
    }
  }

  showNodeMenu(node){
    if(!this.graph) return;
    this.nodeMenu.nodeNamePicker.value = node.label;
    this.nodeMenu.isSourcePicker.checked = node.isSource;
    this.nodeMenu.nodeValPicker.value = node.val;
    this.nodeMenu.nodeColorPicker.value = node.fillColor;
    this.x_data_field.value = Math.round(node.posx*100)/100;
    this.y_data_field.value = Math.round(node.posy*100)/100;

    let x = node.x + node.R;
    let y = node.y - node.R;
    
    if (x + this.nodeMenu.visualElement.offsetWidth > this.canvas.width) {
    x = this.canvas.width - this.nodeMenu.offsetWidth;
    }
    if (y + this.nodeMenu.visualElement.offsetHeight > window.innerHeight) {
    y = this.canvas.height - this.nodeMenu.offsetHeight;
    }

    let xr = (node.posx - this.scopex)*(this.ppu/this.scale) + 400;
    let yr = -(node.posy - this.scopey)*(this.ppu/this.scale) + 400;

    if(xr > 60 || xr < 800 
      || yr > 60 || yr < 800){
        node.x = xr;
        node.y = yr;

        this.nodeMenu.display(node.x, node.y);
      }
    
  }

  createGraph(isDirected = false) {
    this.graph = new Graph(this.ctx, false, false, CompetEdge);
    this.adj = this.graph.adj.container;
    return this.graph;
  }

  generateEdge(n0, n1){
    return new CompetEdge(n0, n1, "", this.graph.conections+1);
  }

  generateNode(x, y, val = 0, id = null){
    let nnode = new CompetNode(x, y, "", this.graph.n+1);
    nnode.posx = (x - 400)*(this.scale/this.ppu) + this.scopex;
    nnode.posy = -(y - 400)*(this.scale/this.ppu) + this.scopey;
    nnode.R = this.ppu/4;
    return nnode;
  }

  draw(){

    requestAnimationFrame(this.draw.bind(this));
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.zslider.draw(this.ctx);

    this.getZoom();
    this.drawGrid();
    for(let node of this.graph.nodes){
      let xr = (node.posx - this.scopex)*(this.ppu/this.scale) + 400;
      let yr = -(node.posy - this.scopey)*(this.ppu/this.scale) + 400;
      let r = node.R/this.scale;
      
      node.x = xr;
      node.y = yr;
      node.r = r;
      
      if(xr > 60 && xr < 800 
        && yr > 60 && yr < 800){
          node.draw(this.ctx);
        }
    }

    if(this.selectedEdge != null) this.selectedEdge.updatedDraw(this.ctx);
    
    for(let edge of this.graph.edges){
      edge.updatedDraw(this.ctx);
    }
  }
}


var controller = new CompetGraphController();
var graph = controller.createGraph();
var canvas = controller.getVisualFrame();
var centroid = null;

controller.resizeVisualFrame(window.innerWidth, window.innerHeight);

document.body.appendChild(canvas);
matrixContainer.appendChild(controller.getVisualMatrix());

controller.draw();


competButton.addEventListener("click", e => {
  compet();
});


matrixButton.addEventListener("click", e => {
  matrixContainer.style.display = (matrixContainer.style.display === "block") ? "none" : "block";
  matrixContainer.removeChild(matrixContainer.lastChild);
  matrixContainer.appendChild(controller.getVisualMatrix());
});

newNodeButton.addEventListener("click", e => {
  graph = controller.graph;
  graph.adj.agregarNodo();
});

saveButton.addEventListener("click", e => {
  controller.downloadFile();
});

loadButton.addEventListener('click', e => {
  controller.loadFile();
});


function compet() {
    var points=[];
    graph.nodes.forEach((node, index) => {
      let point = []
      point.push(node.posx);
      point.push(node.posy)
      points.push(point);
    });

   
    
    function getMidpoint(points) {
      // Ensure that the input array is not empty
      if (points.length === 0) {
        return null; // or handle this case as appropriate for your use case
      }
    
      // Initialize sum variables for x and y coordinates
      let sumX = 0;
      let sumY = 0;
    
      // Iterate through each point and accumulate the coordinates
      for (let i = 0; i < points.length; i++) {
        sumX += points[i][0];
        sumY += points[i][1];
      }
    
      // Calculate the average coordinates
      const avgX = sumX / points.length;
      const avgY = sumY / points.length;
    
      // Return the midpoint as an object with x and y properties
      return [avgX, avgY];
    }

    let result = getMidpoint(points);
    
    console.log("x: ", result[0]);
    console.log("y: ", result[1]);

    //if(centroid != null) graph.deleteNode(centroid);
    centroid = new CompetNode(result[0], result[1],"", "", "")
    centroid.label = "centroide;"
    centroid.posx = (x - 400)*(this.scale/this.ppu) + this.scopex;
    centroid.posy = -(y - 400)*(this.scale/this.ppu) + this.scopey;
    centroid.R = this.ppu/4;
    graph.addNodeObject(centroid)
    
    

    for(let node of graph.nodes){
      if(node != centroid){
        graph.joinNodesWithEdge(node, centroid, new CompetEdge(node, centroid, 0, 0));
      }
    }

    


  }