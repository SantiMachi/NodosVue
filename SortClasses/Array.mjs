import { Element } from "./Element.mjs";
export {Element}

export  class Array{
    constructor(ctx, x, y, maxWidth, maxHeight){
        this.ctx = ctx;
        this.elements = [];
        this.n = 0;

        this.x = x;
        this.y = y;
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
        this.defaultWidth = 10;
        this.elementWidth = this.defaultWidth;
        
        this.margin = 30;
        this.spacing = 10;

        this.animation = null;
        this.step = 0;

        this.dx = 10;
        this.ou = null;
        this.u = null;
        this.v = null;
        this.title = null;

        this.maxValue = null;
    }

    push(value){

        if(this.maxValue == null) this.maxValue = value; 
        else this.maxValue = Math.max(value, this.maxValue);

        this.n++; 
        this.updateElementWidht();
        
        let h = (this.maxHeight-2*this.margin)*(value/this.maxValue);
        let element = new Element(value, this.n-1, this.position(this.n-1), this.y - this.margin, this.elementWidth, h);

        this.elements.push(element);

        this.updateElementAtributes();
    }

    clear(){
        this.elements.splice(0);
        this.n = 0;
    }

    updateDraw(){
        this.update();
        this.draw();
    }

    draw(){
        this.ctx.lineWidth = 2;
        this.ctx.fillStyle = "black";
        this.ctx.strokeRect(this.x, this.y - this.maxHeight - 100, this.maxWidth, this.maxHeight + 100);
        
        if(this.title != null && this.title != ""){
            this.ctx.font =  '30px Montserrat, sans-serif';
            this.fillStyle = "#006aff";
            this.ctx.textAlign = "left";
            this.ctx.textBaseline = "base";
            this.ctx.fillText(this.title, this.x + this.margin, this.y - this.maxHeight - 50);
        }
        
        var selectedItem = null;
        for(var element of this.elements){
            if(!element.isSelected) element.updateDraw(this.ctx);
            else selectedItem = element;
        }

        if(selectedItem) selectedItem.updateDraw(this.ctx);
    }

    swap(u , v){
        var element = this.elements[u];
        this.elements.splice(u, 1);
        this.elements.splice(v, 0, element);
    }

    playAnimation(steps){
        if(steps.length <= 0){
            return;
        }
        this.animation = steps;
        this.step = 0;
        this.ou = this.animation[this.step][0];
        this.u = this.ou.index;
        this.v = this.animation[this.step][1];
    }

    updateElementWidht(){
        if(this.n > 0){
            this.elementWidth = this.maxWidth-2*this.margin;
            this.elementWidth = (this.elementWidth - (this.n-1)*this.spacing)/this.n;
        } 
        else this.elementWidth = this.defaultWidth;
    }

    updateElementAtributes(){
        for(let  i = 0; i < this.n; i++){
            var element = this.elements[i];
            element.index = i;
            element.width = this.elementWidth;
            element.height = (this.maxHeight-2*this.margin)*(element.value/this.maxValue);
        }
    }

    position(i){
        return this.x + this.margin + i*(this.elementWidth + this.spacing);
    }

    finishStep(){
        this.swap(this.u, this.v);
        this.updateElementAtributes();

        for(let i = 0; i < this.n; i++){
            this.elements[i].x = this.position(i);
        }

        this.ou.isSelected = false;
        if(this.step <= this.animation.length-2){
            this.step++;

            this.ou = this.animation[this.step][0];
            this.u = this.ou.index;
            this.v = this.animation[this.step][1];
        }
        else{
            this.animation = null;
            this.step = 0;
            this.ou = null;
            this.u = null;
            this.v = null;
        }
    }

    update(){
        
        this.updateElementWidht();
        this.updateElementAtributes();
        this.spacing = Math.max(this.elementWidth/30, 2);
        if(this.animation){
            console.log(this.step, this.u, this.v);

            this.ou.isSelected = true;
            
            if(this.v > this.u){
                this.elements[this.u].x += this.dx;
                for(let i = this.u+1; i <= this.v; i++){
                    this.elements[i].x -= this.dx * 1/(this.v - this.u);
                }

                if(this.elements[this.u].x >= this.position(this.v) - this.dx){
                    this.finishStep();
                }
            }
            else if(this.v < this.u){
                this.elements[this.u].x -= this.dx;
                for(let i = this.v; i < this.u; i++){
                    this.elements[i].x += this.dx * 1/(this.u - this.v);
                }

                if(this.elements[this.u].x <= this.position(this.v) + this.dx){
                    this.finishStep();
                }
            }
            else{
                this.finishStep();
            }

        }
        else{
            for(let i = 0; i < this.n; i++){
                this.elements[i].x = this.position(i);
            }
        }
    }
}