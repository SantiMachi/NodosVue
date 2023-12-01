import {Node, UndirectedEdge, DirectedEdge, Graph, GraphController} from "../../GraphClasses/GraphController.mjs";
import { convertToPixels, extractFontSize } from "../../Utilities/TextUtils.mjs";

const assignmentButton = document.getElementById("assignment_btn");
const assignmentButton2 = document.getElementById("assignment_btn2");
const matrixButton = document.getElementById("adj_Button");
const newNodeButton = document.getElementById("new_button");
const saveButton = document.getElementById("save_btn");
const loadButton = document.getElementById("load_btn");
var matrixContainer = document.getElementById("myDropdown");
const resButton = document.getElementById("res");

class JohnsonNode extends Node {
  constructor(x, y, val, id, label = "") {
    super(x, y, val, label);
    this.ef = null;
    this.lf = null;

  }

  draw(ctx) {
    super.draw(ctx);

    const x = this.x;
    const y = this.y - this.r - 40;

    if (this.ef != null && this.lf != null) {

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
      ctx.strokeRect(0, 0, (5 / 4) * width, (5 / 4) * height);

      ctx.fillStyle = "black";
      ctx.fillText(this.lf.toFixed(1), (5 / 8) * width, (5 / 8) * height);

      ctx.fillStyle = "black";
      ctx.fillRect(-(5 / 4) * width, 0, (5 / 4) * width, (5 / 4) * height);
      ctx.strokeRect(-(5 / 4) * width, 0, (5 / 4) * width, (5 / 4) * height);

      ctx.fillStyle = "white";
      ctx.fillText(this.ef.toFixed(1), -(5 / 8) * width, (5 / 8) * height);

      ctx.restore();
      ctx.closePath();
    }
  }
}

class JohnsonEdge extends DirectedEdge {
  constructor(n0, n1, weight, id) {
    super(n0, n1, weight, id);
    this.forwardLabel = null;
    this.backwardLabel = null;
    this.h = null;
  }
  draw(ctx) {
    super.draw(ctx);

    let normal_direction = this.direction;
    if (this.direction < Math.PI) {
      normal_direction = this.direction + (Math.PI / 2);
    }
    else {
      normal_direction = this.direction - (Math.PI / 2);
    }
    const px = 20 * Math.cos(normal_direction);
    const py = 20 * Math.sin(normal_direction);

    const x = ((this.originX + this.targetX) / 2) + px;
    const y = ((this.originY + this.targetY) / 2) + py;

    if (this.h != null) {

      ctx.beginPath();
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(this.direction);

      let width = ctx.measureText("h = " + this.h.toFixed(1)).width;
      let height = extractFontSize(this.font);

      ctx.font = this.font;

      ctx.fillStyle = "black";
      ctx.fillRect(-(5 / 8) * width, 0, (5 / 4) * width, (5 / 4) * height);
      ctx.strokeRect(-(5 / 8) * width, 0, (5 / 4) * width, (5 / 4) * height);

      ctx.fillStyle = "white";
      ctx.fillText("h = " + this.h.toFixed(1), 0, (5 / 8) * height);

      ctx.restore();
      ctx.closePath();
    }
  }

}

class JohnsonGraphController extends GraphController {
  constructor() {
    super();
  }

  createGraph(isDirected = true) {
    this.graph = new Graph(this.ctx, true, false, JohnsonEdge);
    this.adj = this.graph.adj.container;
    return this.graph;
  }

  generateNode(x, y, val = 0, id = null) {
    return new JohnsonNode(x, y, 0, null);
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


assignmentButton.addEventListener("click", e => {
  resButton.innerHTML = "Resultado: " +  findAssingment(true);
});

assignmentButton2.addEventListener("click", e => {
  resButton.innerHTML = "Resultado: " + (-1)*findAssingment(false);

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


function findAssingment(maximize) {
  for (var edge of graph.edges) {
    edge.isAssigned = false;
  }
  console.log("entra");
  if (maximize) {
    var mayor = 0.0;
    var edgepaintfinal = [];
    graph.edges.forEach(edgeini => {
      var edgepaint = [];
      var nodusoi = [];
      var nodusof = [];
      var suma = 0.0;
      var flagA = true;
      var flagB = true;
      nodusoi.push(edgeini.n0);
      nodusof.push(edgeini.n1);
      suma = suma + parseFloat(edgeini.weight);
      edgepaint.push(edgeini);

      graph.edges.forEach(edg => {
        flagB = true;
        flagA = true;
        nodusoi.forEach(nd => {
          if (nd == edg.n0) {
            flagA = false;
          }
        });
        nodusof.forEach(nd => {
          if (nd == edg.n1) {
            flagB = false;
          }
        });
        if (flagA && flagB) {
          nodusoi.push(edg.n0);
          nodusof.push(edg.n1);
          suma = suma + parseFloat(edg.weight);
          edgepaint.push(edg);
        }

      });
      if (suma >= mayor) {
        mayor = suma;
        edgepaintfinal = [];
        edgepaintfinal = edgepaint;
      }
    });

  } else {
    var mayor = 0.0;
    var edgepaintfinal = [];
    var firstin = true;
    graph.edges.forEach(edgeini => {
      var edgepaint = [];
      var nodusoi = [];
      var nodusof = [];
      var suma = 0.0;
      var flagA = true;
      var flagB = true;

      nodusoi.push(edgeini.n0);
      nodusof.push(edgeini.n1);
      suma = suma - parseFloat(edgeini.weight);
      edgepaint.push(edgeini);

      graph.edges.forEach(edg => {
        flagB = true;
        flagA = true;
        nodusoi.forEach(nd => {
          if (nd == edg.n0) {
            flagA = false;
          }
        });
        nodusof.forEach(nd => {
          if (nd == edg.n1) {
            flagB = false;
          }
        });
        if (flagA && flagB) {
          nodusoi.push(edg.n0);
          nodusof.push(edg.n1);
          suma = suma - parseFloat(edg.weight);
          edgepaint.push(edg);
        }

      });
      if (firstin) {
        mayor = suma;
        firstin = false;
        edgepaintfinal = [];
        edgepaintfinal = edgepaint;
      }
      console.log(suma);
      if (suma >= mayor) {
        mayor = suma;
        edgepaintfinal = [];
        edgepaintfinal = edgepaint;
      }
    });
  }
  console.log(edgepaintfinal);
  edgepaintfinal.forEach(edge => {
    graph.edges.forEach(paint => {
      if (parseInt(paint.id) == parseInt(edge.id)) {
        edge.isAssigned = true;

      }
    });

  });

  return mayor;
}