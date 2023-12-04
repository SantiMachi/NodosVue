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
    super(null, null, "", id, label);
    this.posx = x;
    this.posy = y;
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
      this.selectedNode.x = parseFloat(e.target.value);
    });

    this.y_field.addEventListener("input", e => {
      this.selectedNode.y = parseFloat(e.target.value);
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

    this.hslider = new SlideBar(this.ctx, 30, 30, 800, 20, true);
    this.vslider = new SlideBar(this.ctx, 900, 30, 800, 20, false);
    this.zslider = new SlideBar(this.ctx, 800, 800, 100, 20, true);

    this.canvas.addEventListener("mousemove", e => {

      if(this.selectedSlider != null){
        this.selectedSlider.updateSliderPosition(this.mouse.x, this.mouse.y);
      }
    })

    this.canvas.addEventListener("mousedown", e => {
      if(this.hslider.isInside(this.mouse.x, this.mouse.y))this.selectedSlider = this.hslider;
      else if(this.vslider.isInside(this.mouse.x, this.mouse.y)) this.selectedSlider = this.vslider;
      else if(this.zslider.isInside(this.mouse.x, this.mouse.y)) this.selectedSlider = this.zslider;
      
      if(this.selectedSlider != null) e.stopPropagation();
    }, true);

    this.canvas.addEventListener("mouseup", e => {
      this.selectedSlider = null;
    })

    this.getScope();
  }

  drawGrid(){
    let x = this.scopex;
    let y = this.scopey;
    
    let fl = Math.ceil(x);
    let bl = Math.ceil(x);

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
    bl = Math.ceil(y);

    pos = yo + (bl-y)*(this.ppu/this.scale);

   //console.log(this.vslider.getValue());

    while(pos > 60){
      this.ctx.beginPath();
      this.ctx.moveTo(30, pos);
      this.ctx.lineTo(800, pos);
      this.ctx.stroke();
      this.ctx.closePath();

      pos -= (this.ppu/this.scale);
    }

    pos = yo + (fl-y)*(this.ppu/this.scale);
    
    while(pos < 800){
      this.ctx.beginPath();
      this.ctx.moveTo(30, pos);
      this.ctx.lineTo(800, pos);
      this.ctx.stroke();
      this.ctx.closePath();

      pos += (this.ppu/this.scale);
    }
  }

  getScope(){
    this.scopex = 400*(2.0*this.hslider.getValue() - 1);
    this.scopey = 400*(2.0*this.vslider.getValue() - 1);
    this.scale = 1*(this.zslider.getValue() + 1/10);
  }

  showNodeMenu(node){
    if(!this.graph) return;
    this.nodeMenu.nodeNamePicker.value = node.label;
    this.nodeMenu.isSourcePicker.checked = node.isSource;
    this.nodeMenu.nodeValPicker.value = node.val;
    this.nodeMenu.nodeColorPicker.value = node.fillColor;
    this.x_data_field.value = Math.round(node.x*100)/100;
    this.y_data_field.value = Math.round(node.y*100)/100;

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

        this.nodeMenu.display(xr, yr);
      }
    
  }

  createGraph(isDirected = false) {
    this.graph = new Graph(this.ctx, false, false, CompetEdge);
    this.adj = this.graph.adj.container;
    return this.graph;
  }

  generateEdge(n0, n1){
    return null;
  }

  generateNode(x, y, val = 0, id = null){
    let xo = (x - 400)*(this.scale/this.ppu) + this.scopex;
    let yo = (400 - y)*(this.scale/this.ppu) + this.scopey;
    let nnode = new CompetNode(xo, yo, "", this.graph.n+1);
    nnode.R = this.ppu/2;
    return nnode;
  }

  draw(){

    requestAnimationFrame(this.draw.bind(this));
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.getScope();

    this.vslider.draw(this.ctx);
    this.hslider.draw(this.ctx);
    this.zslider.draw(this.ctx);

    this.drawGrid();
    for(let node of this.graph.nodes){
      let xr = (node.posx - this.scopex)*(this.ppu/this.scale) + 400;
      let yr = -(node.posy - this.scopey)*(this.ppu/this.scale) + 400;
      let r = node.R/this.scale;
      if(xr > 60 && xr < 800 
        && yr > 60 && yr < 800){
          node.x = xr;
          node.y = yr;
          node.r = r;
          //console.log(xr, yr);
          node.draw(this.ctx);
        }
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
      points[index]=[];
      points[index][0]=node.posx;
      points[index][1]=node.posy;
    });

    
    function mid(a, b) {
      return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    }
    
    function dist(a, b) {
      const x = a[0] - b[0];
      const y = a[1] - b[1];
      return Math.sqrt(x * x + y * y);
    }
    
    function adist(points) {
      let s = 0;
      let last = points[0];
      for (const p of points) {
        s += dist(last, p);
        last = p;
      }
      return s / points.length;
    }
    
    const e = 0.0001;
    
    while (adist(points) >= e) {
      const first = points[0];
      for (let i = 1; i < points.length; i++) {
        points[i - 1] = mid(points[i], points[i - 1]);
      }
      points[points.length - 1] = mid(first, points[points.length - 1]);
    }
    
    console.log("x: ", Math.round(points[0][0]));
    console.log("y: ", Math.round(points[0][1]));

    if(centroid != null) graph.deleteNode(centroid);
    centroid = new CompetNode(points[0][0], Math.round(points[0][1]),"x: " + Math.round(points[0][0])+" y: " + Math.round(points[0][1]))
    centroid.label = "centroide;"
    centroid.R = controller.ppu/2;
    graph.addNodeObject(centroid)
    
    

    for(let node of graph.nodes){
      if(node != centroid){
        graph.joinNodesWithEdge(node, centroid, new CompetEdge(node, centroid, 0, 0));
      }
    }

    


  }