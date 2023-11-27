import { Node } from "./Node.mjs";
import { extractFontSize } from "../Utilities/TextUtils.mjs";
export class UndirectedEdge {
    constructor(n0, n1, weight, id) {
      /* if (!n0 || !n1 ){
          this.id = 0
      }
      else{
          this.id=n0.id*10000 + n1.id;
      } */
      this.id = id;
      this.n0 = n0;
      this.n1 = n1;
      this.weight = weight;
      this.isSelected = false;
      this.isSelfDirected = false;
      this.defaultStrokeColor = 'black';
      this.defaultWeightColor = 'black';
      this.strokeColor = this.defaultStrokeColor;
      this.weightColor = this.defaultWeightColor;
      this.font = '24px Montserrat, sans-serif';
      //para la bd , n0.id,n1.id, weight,strokecolor, weightcolor,font

      this.relativeX = -1;
      this.relativeY = -1;
      this.originX = 0;
      this.originY = 0;
      this.arcr = 2*Math.sqrt(Math.pow(this.startX - this.endX, 2) + Math.pow(this.startY - this.endY, 2));
      this.arcr = Math.min(this.arcr, this.n0.r/3);
      this.centerDist = this.n0.r + this.arcr/2;
      this.teta1 = Math.pow(this.arcr, 2) + Math.pow(this.centerDist, 2) -  Math.pow(this.n0.r, 2) ;
      this.teta1 = Math.PI - Math.acos(this.teta1/(Math.pow(this.arcr, 2) * Math.pow(this.centerDist, 2)));
      this.teta2 = 2*Math.PI - this.teta1;
    }

    setStrokeColor(color) {
      this.defaultStrokeColor = color;
    }

    isInside(x, y) {
      if(this.isSelfDirected){
        const centerX = this.startX + this.centerDist*Math.cos(this.direction);
        const centerY = this.startY + this.centerDist*Math.sin(this.direction);
        const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        
        const angle = Math.atan2(y-centerY, x-centerX);
        
        if(Math.abs(dist - this.arcr) < 10 &&
        (angle < this.teta1 || angle > this.teta2))return true;
        else return false;
      }
      else{

        if((this.n1.x - this.n0.x) == 0){
          if (Math.abs(x - this.n0.x) < 10
          && ((Math.abs(y-this.originY) +  Math.abs(y-this.targetY)) <= Math.abs(this.originY-this.targetY))) return true;
          else return false;
        }
        const slope = (this.n1.y - this.n0.y) / (this.n1.x - this.n0.x);
        const intercept = this.n0.y - slope * this.n0.x;

        const a = slope * (this.n1.x - this.n0.x);
        const b = -(this.n1.x - this.n0.x);
        const c = intercept * (this.n1.x - this.n0.x);
        if (Math.abs(a * x + b * y + c) / Math.sqrt(a ** 2 + b ** 2) < 10
        && ((Math.abs(x-this.originX) +  Math.abs(x-this.targetX)) <= Math.abs(this.originX-this.targetX))
        && ((Math.abs(y-this.originY) +  Math.abs(y-this.targetY)) <= Math.abs(this.originY-this.targetY))) return true;
        else return false;  
      }
    }

    draw(ctx) {
      

      if(this.isSelfDirected){

        ctx.beginPath();
        ctx.font = this.font;
        ctx.fillStyle = this.weightColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.weight.toString(), (this.startX + (this.centerDist+this.arcr+15)*Math.cos(this.direction)), 
                                             (this.startY + (this.centerDist+this.arcr+15)*Math.sin(this.direction)));
        ctx.closePath();

        ctx.beginPath();
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = 4;
        //console.log(this.arcr);
        ctx.arc(this.startX + this.centerDist*Math.cos(this.direction),
                this.startY + this.centerDist*Math.sin(this.direction), this.arcr, this.teta1, this.teta2, true);
        ctx.stroke();
        ctx.closePath();
      }
      else{

        ctx.beginPath();
        ctx.font = this.font;
        ctx.fillStyle = this.weightColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        let normal_direction = this.direction;
        if(this.direction < Math.PI){ 
          normal_direction  = this.direction - (Math.PI/2);
        }
        else{
          normal_direction  = this.direction + (Math.PI/2);
        }
        const px = (extractFontSize(this.font)+10)*Math.cos(normal_direction);
        const py = (extractFontSize(this.font)+10)*Math.sin(normal_direction);
        
        ctx.fillText(this.weight.toString(), ((this.originX + this.targetX) / 2) + px, 
                                             ((this.originY + this.targetY) / 2) + py);
        ctx.closePath();

        ctx.beginPath();
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = 4;
        ctx.moveTo(this.originX, this.originY);
        ctx.lineTo(this.targetX, this.targetY);
        ctx.stroke();
        ctx.closePath();
      }
      
    }

    update() {

      this.startX = this.n0.x;
      this.startY = this.n0.y;
      if(!this.isSelfDirected){
        this.endX = this.n1.x;
        this.endY = this.n1.y;
      }
      else{
        this.endX = this.n0.x + this.relativeX;
        this.endY = this.n0.y + this.relativeY;
      }
      this.direction = Math.atan2(this.endY - this.startY, this.endX - this.startX);
      this.targetX = this.endX - this.n1.r * Math.cos(this.direction);
      this.targetY = this.endY - this.n1.r * Math.sin(this.direction);
      
      this.originX = this.startX + this.n0.r*Math.cos(this.direction);
      this.originY = this.startY +this.n0.r*Math.sin(this.direction);

      this.arcr = 1.5*Math.sqrt(Math.pow(this.startX - this.endX, 2) + Math.pow(this.startY - this.endY, 2));
      this.arcr = Math.max(this.arcr,0.5* this.n0.r);
      this.centerDist = this.n0.r + this.arcr/2;
      let alfa = Math.acos( ( Math.pow(this.arcr, 2) + Math.pow(this.centerDist, 2) -  Math.pow(this.n0.r, 2) )/(2*this.arcr*this.centerDist));
      this.teta1 = Math.PI + this.direction - alfa;
      this.teta2 = Math.PI + this.direction + alfa;


      if (this.isSelected) {
        this.strokeColor = 'orange';
      }
      else{
        if(this.isAssigned) {
          this.strokeColor = 'blue';
        }
        else{
          this.strokeColor = this.defaultStrokeColor; 
        }
      }
    }

    updatedDraw(ctx){
      this.update();
      this.draw(ctx);
    }
  }

export class DirectedEdge extends UndirectedEdge {
    constructor(n0, n1, weight, id) {
      super(n0, n1, weight, id);
      this.isAssigned = false;
      this.arrowDirection = this.direction;
      this.arrowLength = 20;
      this.headX = this.targetX;
      this.headY = this.targetY;
    }

    draw(ctx) {
      super.draw(ctx);

      ctx.beginPath();
      ctx.fillStyle = this.strokeColor;
      ctx.lineWidth = 4;
      ctx.moveTo(this.headX , this.headY);
      ctx.lineTo(this.headX - this.arrowLength * Math.cos((Math.PI/6) - this.arrowDirection),
                 this.headY + this.arrowLength * Math.sin((Math.PI/6) - this.arrowDirection));
      ctx.lineTo(this.headX - this.arrowLength * Math.cos((Math.PI/6) + this.arrowDirection),
                 this.headY - this.arrowLength * Math.sin((Math.PI/6) + this.arrowDirection));
      //ctx.stroke();
      ctx.fill();
      ctx.closePath();
      //console.log("Estoy en el directed");

    }

    update() {
      super.update();

      if(this.isSelfDirected){
        
        this.headX = this.startX + this.centerDist*Math.cos(this.direction) + this.arcr*Math.cos(this.teta2);
        this.headY = this.startY + this.centerDist*Math.sin(this.direction) + this.arcr*Math.sin(this.teta2);

        this.teta2 = this.teta2 + Math.acos(Math.sqrt(1-Math.pow(this.arrowLength*(Math.sqrt(3)/2)/this.arcr, 2)/2));
        this.arrowDirection = this.teta2 - Math.PI/2;
        
      }
      else{
        this.arrowDirection = this.direction;

        this.headX = this.targetX;
        this.headY = this.targetY;
        this.targetX = this.endX - (this.n1.r + this.arrowLength*(Math.sqrt(3)/2) ) * Math.cos(this.direction);
        this.targetY = this.endY - (this.n1.r + this.arrowLength*(Math.sqrt(3)/2) ) * Math.sin(this.direction);
      } 
      //console.log("Estoy en el update");
    }
    updatedDraw(ctx){
      this.update();
      this.draw(ctx);
    }
  }

  export{ Node } from "./Node.mjs"
