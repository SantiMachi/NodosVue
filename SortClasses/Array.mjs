import { Element } from "./Element.mjs";
export {Element}

export  class Array{
    constructor(ctx, y, maxWidth, maxHeight){
        this.ctx = ctx;
        this.elements = [];
        this.n = 0;
        this.y = y;
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
        this.defaultWidth = 10;
        this.elementWidth = this.defaultWidth;
        this.margin = 30;
        this.spacing = 10;
        this.transition = false;
        this.dx = 10;
        this.u = null;
        this.v = null;

        this.maxValue = 0.1;
    }

    move(u, v){
        this.transition = true;
        this.u = u;
        this.v = v;
    }

    updateElementWidht(){
        if(this.n > 0){
            this.elementWidth = this.maxWidth-2*this.margin;
            this.elementWidth = (this.elementWidth - (this.n-1)*this.spacing)/this.n;
        } 
        else this.elementWidth = this.defaultWidth;
    }

    push(value){
        
        this.maxValue = Math.max(value, this.maxValue);

        this.updateElementWidht();
        let h = this.maxHeight*(value/this.maxValue);
        let element = new Element(value, this.position(this.n), 
        this.y, this.elementWidth, h);

        this.elements.push(element);

        this.n++;   
    }

    draw(){
        for(var element of this.elements){
            element.updateDraw(this.ctx);
        }
    }

    swap(u , v){
        var element = this.elements[u];
        this.elements.splice(u, 1);
        this.elements.splice(v, 0, element);
    }

    position(i){
        return this.margin + i*(this.elementWidth + this.spacing);
    }

    update(){
        this.updateElementWidht();
        
        for(var element of this.elements){
            element.width = this.elementWidth;
            element.height = this.maxHeight*(element.value/this.maxValue);
        }

        if(this.transition){
            this.elements[this.u].isSelected = true;
            
            if(this.v > this.u){
                this.elements[u].x += this.dx;
                for(let i = u+1; i <= v; i++){
                    elements[i].x -= this.dx;
                }
            }
            else if(this.v < this.u){
                this.elements[u].x -= this.dx;
                for(let i = v; i < u; i++){
                    elements[i].x += this.dx;
                }
            }
            

            const target = this.position(v);
            if((this.elements[u].x - target) <= 3){
                this.elements[u].x = target;
                
                if(this.v > this.u){
                    for(let i = this.u+1; i <= this.v; i++){
                        this.elements[i].x = this.position(i-1);
                    }
                }
                else if(this.v < this.u){
                    for(let i = this.v; i < this.u; i++){
                        this.elements[i].x = this.position(i+1);
                    }
                }
            
                this.elements[this.u].isSelected = false;
                this.swap(this.u, this.v);
                this.transition = false;
            
            }

        }
        else{
            for(let i = 0; i < this.n; i++){
                this.elements[i].x = this.position(i);
            }
        }
    }
}