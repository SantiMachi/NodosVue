import {getBrightness} from "../Utilities/RGBUtils.mjs"

export class Ball {
    constructor(x, y, dx, dy) {
      this.x = x;
      this.y = y;
      this.dx = 0;
      this.dy = 0;
      this.fillColor = 'black';
      this.strokeColor = 'black';
      this.strokeWidth = 1;
      this.R = 40;
      this.r = this.R;
    }

    inertialMove(x1, y1) {
      this.dx = x1 - this.x;
      this.dy = y1 - this.y;

      this.x = x1;
      this.y = y1;
      //console.log("Estoy en el inertial move");
    }

    dryMove(x1, y1) {
      this.dx = 0;
      this.dy = 0;

      this.x = x1;
      this.y = y1;
    }


    isInside(x, y) {
      if (Math.sqrt((this.x - x) ** 2 + (this.y - y) ** 2) <= this.r) return true;
      else return false;
    }

    draw(ctx) {

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.strokeStyle = this.strokeColor;
      ctx.lineWidth = this.strokeWidth;
      ctx.stroke();
      ctx.fillStyle = this.fillColor;
      ctx.fill();

      //console.log("Estoy en el draw");
    }

    update() {
      this.x = this.x + this.dx;
      this.y = this.y + this.dy;

      if (this.x + this.r >= window.innerWidth - 1) {
        this.dx = -0.8 * Math.abs(this.dx);
        this.x = window.innerWidth - 1 - this.r;
      }
      else if (this.x - this.r <= 1) {
        this.dx = 0.8 * Math.abs(this.dx);
        this.x = 1 + this.r;
      }


      if (this.y + this.r >= window.innerHeight - 1) {
        this.dy = -0.8 * Math.abs(this.dy);
        this.y = window.innerHeight - 1 - this.r;
      }
      else if (this.y - this.r <= 1) {
        this.dy = 0.8 * Math.abs(this.dy);
        this.y = 1 + this.r;
      }

      if (Math.abs(this.dx) >= 0.1) {
        //this.dx = this.dx - 0.1*(Math.abs(this.dx)/dx);
        if (this.dx > 0) this.dx = this.dx - 0.2;
        else this.dx = this.dx + 0.2;
      }
      else {
        this.dx = 0;
      }

      if (Math.abs(this.dy) >= 0.1) {
        //this.dy = this.dy - 0.2*(Math.abs(this.dy)/dy);
        if (this.dy > 0) this.dy = this.dy - 0.2;
        else this.dy = this.dy + 0.2;
      }
      else {
        this.dy = 0;
      }
    }

    updatedDraw(ctx){
      this.update();
      this.draw(ctx);
    }
}


export class Node extends Ball {
    constructor(x, y, val, id, label = "") {
      super(x, y, 0, 0);
      this.id = id;
      this.isSelected = false;
      this.t = 0;
      this.label = label;
      this.val = val;
      this.valueColor = 'white';
      this.labelColor = 'black';
      this.font = '24px Montserrat, sans-serif';
      this.edges = [];
      this.isCritical = false;
      this.isSource = false;

      //Guardar label, val, value color, labelcolor, font,id

      /*this.label = document.createElement("input");
      this.label.setAttribute("type", "text");
      this.label.setAttribute("id", "label");
      this.label.setAttribute("name", "nestedInput");
      this.label.placeholder = "Enter text here";
      this.label.value = "This is the new text."
      
      this.labelContainer = document.createElement("div");
      this.labelContainer.classList.add("context_menu");
      this.labelContainer.appendChild(this.label);
      
      this.labelContainer.style.position = 'absolute';
      this.labelContainer.style.left = this.x;
      this.labelContainer.style.top = this.y + this.R;
      this.labelContainer.style.display = 'block';

      var body = document.body;
      body.appendChild(this.labelContainer);*/
    }

    setCritical() {
      this.isCritical = true;
      }

    setFillColor(color) {
      this.fillColor = color;
      const brightness = getBrightness(color) / 255;
      //console.log(brightness);
      if (brightness >= 0.5) this.valueColor = 'black';
      else this.valueColor = 'white';
    }

    draw(ctx) {


      super.draw(ctx);

      ctx.beginPath();
      ctx.font = this.font;
      ctx.fillStyle = this.valueColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.val.toString(), this.x, this.y);

      ctx.beginPath();
      ctx.font = this.font;
      ctx.fillStyle = this.labelColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.label.toString(), this.x, this.y + this.r + 15);
    }

    update() {

      if (this.isSelected) {
        this.r = this.R + 5 * Math.sin(this.t);
        this.t += 0.1;
        if (this.t >= 2 * Math.PI) {
          this.t = 0;
        }
      }
      else {
        this.r = this.R;
        this.t = 0;
      }

      if(this.isSource){
        this.strokeWidth = 15;
        this.strokeColor = "orange";
      }
      else if(this.isCritical){
        this.strokeWidth = 15;
        this.strokeColor = "blue";
      }
      else{
        this.strokeWidth = 1;
        this.strokeColor = "black";
      }



      super.update();
    }

    updatedDraw(ctx){

      this.update();
      this.draw(ctx);
    }
}


