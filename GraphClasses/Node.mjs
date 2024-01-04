import {getBrightness} from "../Utilities/RGBUtils.mjs"
import { extractFontSize } from "../Utilities/TextUtils.mjs";

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

    impulse(dx, dy){
      this.dx = dx;
      this.dy = dy;
    }

    inertialMove(x1, y1) {
      this.dx = (x1 - this.x)/100;
      this.dy = (y1 - this.y)/100;

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
    constructor(x, y, val = 0, id, label = "") {
      super(x, y, 0, 0);
      this.id = id;
      this.isSelected = false;
      this.t = 0;
      this.label = label;
      this.val = val;
      this.valueColor = 'black';
      this.labelColor = 'white';
      this.font = '24px Montserrat, sans-serif';
      this.edges = [];
      this.isCritical = false;
      this.isSource = false;
    }

    setCritical() {
      this.isCritical = true;
      }

    setFillColor(color) {
      this.fillColor = color;
      const brightness = getBrightness(color) / 255;
      //console.log(brightness);
      if (brightness >= 0.5) this.labelColor = 'black';
      else this.labelColor = 'white';
    }


    draw(ctx) {


      super.draw(ctx);

      ctx.beginPath();
      ctx.font = this.font;
      ctx.fillStyle = this.valueColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      //ctx.fillText(this.val.toString(), this.x, this.y + this.r + 15);
      
      let text;
      if(this.label == null ||
        this.label == ""){
          text = this.id;
      }
      else{
        text = this.label;
      }


      let width = 20+ctx.measureText(text).width;
      let height = (5/4)*extractFontSize(this.font);
      ctx.fillStyle = this.fillColor;

      ctx.globalAlpha = 0.65;
      drawRoundedRect(ctx, this.x - width/2, this.y - height/2, width, height, 5);
      ctx.globalAlpha = 1;

      ctx.beginPath();
      ctx.font = this.font;
      ctx.fillStyle = this.labelColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text.toString(), this.x, this.y);
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


export function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
  ctx.fill();
}


