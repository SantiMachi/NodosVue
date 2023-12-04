import {Node, UndirectedEdge, DirectedEdge, Graph, GraphController} from "../../GraphClasses/GraphController.mjs";
import { convertToPixels, extractFontSize } from "../../Utilities/TextUtils.mjs";
const criticalPathButton = document.getElementById("criticalPath_btn");
const matrixButton = document.getElementById("adj_Button");
const newNodeButton = document.getElementById("new_node_button");
const saveButton = document.getElementById("save_btn");
const loadButton = document.getElementById("load_btn");
var matrixContainer = document.getElementById("myDropdown");

class JohnsonNode extends Node{
  constructor(x, y, val, id, label = ""){
    super(x, y, val, id, label);
    this.ef = null;
    this.lf = null;
    
  }

  draw(ctx){
    super.draw(ctx);

    const x = this.x;
    const y = this.y - this.r - 40;

  if(this.ef != null && this.lf != null){

    ctx.beginPath();
    ctx.save();
    ctx.translate(x, y);

    let flabelWidth = ctx.measureText(this.ef.toFixed(1)).width;
    let blabelWidth = ctx.measureText(this.lf.toFixed(1)).width;
    let width = Math.max(flabelWidth, blabelWidth);
    let height = extractFontSize(this.font);

    ctx.font = this.font;
    ctx.strokeStyle = "black";
    ctx.lineWidth = "2";
    ctx.strokeRect(0, 0, (5/4)*width, (5/4)*height);

    ctx.fillStyle = "black";
    ctx.fillText(this.lf.toFixed(1), (5/8)*width, (5/8)*height);
    
    ctx.fillStyle = "black";
    ctx.fillRect(-(5/4)*width, 0, (5/4)*width, (5/4)*height);
    ctx.strokeRect(-(5/4)*width, 0, (5/4)*width, (5/4)*height);
    
    ctx.fillStyle = "white";
    ctx.fillText(this.ef.toFixed(1), -(5/8)*width, (5/8)*height);
    
    ctx.restore();
    ctx.closePath();
    }
  }
}

class JohnsonEdge extends DirectedEdge{
  constructor(n0, n1, weight, id){
    super(n0, n1, weight, id);
    this.forwardLabel = null;
    this.backwardLabel = null;
    this.h = null;
  }
  draw(ctx){
    super.draw(ctx);

    let normal_direction = this.direction;
    if(this.direction < Math.PI){ 
      normal_direction  = this.direction + (Math.PI/2);
    }
    else{
      normal_direction  = this.direction - (Math.PI/2);
    }
    const px = 20*Math.cos(normal_direction);
    const py = 20*Math.sin(normal_direction);
    
    const x = ((this.originX + this.targetX) / 2) + px;
    const y = ((this.originY + this.targetY) / 2) + py;

    if(this.h!=null){

    ctx.beginPath();
    ctx.save();
    ctx.translate(x, y); 
    ctx.rotate(this.direction);

    let width = ctx.measureText("h = " + this.h.toFixed(1)).width;
    let height = extractFontSize(this.font);

    ctx.font = this.font;

    ctx.fillStyle = "black";
    ctx.fillRect(-(5/8)*width, 0, (5/4)*width, (5/4)*height);
    ctx.strokeRect(-(5/8)*width, 0, (5/4)*width, (5/4)*height);
    
    ctx.fillStyle = "white";
    ctx.fillText("h = " + this.h.toFixed(1), 0, (5/8)*height);
    
    ctx.restore();
    ctx.closePath();
    }
  }

}

class JohnsonGraphController extends GraphController{
  constructor(){
    super();
  }

  createGraph(isDirected = true){
    this.graph = new Graph(this.ctx, true, false, JohnsonEdge);
    this.adj = this.graph.adj.container;    
    return this.graph;
  }

  generateNode(x, y, val = 0, id = null){
    let nnode = new JohnsonNode(x, y, val, null);
    return nnode
  }
}


var controller = new JohnsonGraphController();
var graph = controller.createGraph();
var begin = null;
var end = null;
var canvas = controller.getVisualFrame();
controller.resizeVisualFrame(window.innerWidth, window.innerHeight);

document.body.appendChild(canvas);
matrixContainer.appendChild(controller.getVisualMatrix());

controller.draw();

criticalPathButton.addEventListener("click", e =>{   
  graph = controller.graph;
  for(let node of graph.nodes){
    node.isCritical = false;
    node.ef = null;
    node.lf = null;
  }
  for(let edge of graph.edges){
    edge.isAssigned = false;
    edge.forwardLabel = null;
    edge.backwardLabel = null;
  }

  findCriticalPath();
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


function findCriticalPath(){
  let rec = new Array(graph.n).fill(0); 
  let sen = new Array(graph.n).fill(0); 
  for(let edge of graph.edges){
    let u = edge.n0.id-1;
    let v = edge.n1.id-1;
    rec[v]++;
    sen[u]++;
  }

  let sources = [];
  let destinations = [];
  for(let  i = 0; i < graph.n; i++){
    if(rec[i] == 0) sources.push(graph.nodes[i]);
    if(sen[i] == 0) destinations.push(graph.nodes[i]);
  }

  console.log(sources);
  console.log(destinations);
  if(sources.length == 0) return;
  else{
    begin = new JohnsonNode(100, canvas.height/2, 0, null);
    begin.label = "Inicio";
    begin.fillColor = "#00e660";
    graph.addNodeObject(begin);

    for(let node of sources){
      graph.joinNodes(begin, node);
      rec[node.id-1]++;
    }
  }

  if(destinations.length == 0) return;
  else{
    end = new JohnsonNode(canvas.width-100, canvas.height/2, 0, null);
    end.label = "Final";
    end.fillColor = "#ff2a00";
    graph.addNodeObject(end);

    for(let node of destinations){
      graph.joinNodes(node, end);
      sen[node.id-1]++;
    }
  }

  let vis =  new Array(graph.n).fill(0);
  begin.ef = 0;
  
  rec.push(0);
  rec.push(destinations.length);

  sen.push(sources.length);
  sen.push(0);

  console.log(rec);
  console.log(sen);
  console.log(vis);
  fdfs(begin, rec);
  end.lf = end.ef;
  bdfs(end, sen);
  
  begin.isCritical = true
  dfs(begin, vis);

}

function fdfs(node, rec){
  if(rec[node.id-1]) return;

  for(let edge of node.edges){
    if(edge.n1 == node) continue;
    edge.forwardLabel = parseFloat(edge.n0.ef) + parseFloat(edge.weight);
    if(edge.n1.ef == null){
      edge.n1.ef =  Math.round(edge.forwardLabel*10)/10;
    }
    else{
      edge.n1.ef = Math.max(edge.n1.ef,  Math.round(edge.forwardLabel*10)/10);
    }

    rec[edge.n1.id-1]--;
    fdfs(edge.n1, rec);
  }
}

function bdfs(node, sen){
  if(sen[node.id-1]) return;

  for(let edge of node.edges){
    if(edge.n0 == node) continue;
    edge.backwardLabel = parseFloat(edge.n1.lf) - parseFloat(edge.weight);
    if(edge.n0.lf == null){
      edge.n0.lf = Math.round(edge.backwardLabel*10)/10;
    }
    else{
      edge.n0.lf = Math.min(edge.n0.lf,  Math.round(edge.backwardLabel*10)/10);
      
    }
    edge.h = Math.round((edge.n1.lf - edge.n1.ef)*10)/10;
    sen[edge.n0.id-1]--;
    bdfs(edge.n0, sen);
  }
}

function dfs(node, vis){
  if(vis[node.id-1]) return;
  
  vis[node.id-1] = 1;
  for(let edge of node.edges){
    if(Math.abs(edge.n1.ef - edge.n1.lf) < 1e-6
      && edge.n1 != node){

      edge.n1.isCritical = true;
      edge.isAssigned = true;

      dfs(edge.n1, vis);
      break;
    }
  }
}

