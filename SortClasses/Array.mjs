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
        this.dx = 2;
        this.u = null;
        this.v = null;

        this.maxValue = 0.1;
    }

    checkTransition(){
        if(this.transition){
            console.log("in transition");
            setTimeout(this.checkTransition , 100);
        }
        else{
            console.log("transition finished");
            return true;
        }
    }

    async move(u, v){
        this.transition = true;
        this.u = u;
        this.v = v;

        return new Promise((resolve) => {
            function checkAttribute() {
                if (this.transition == false) {
                  console.log("resolved");
                  resolve(true);
                  
                } else {
                  setTimeout(checkAttribute, 100);
                }
              }
          
            checkAttribute();
        });
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
        //this.update();

        let h = this.maxHeight*(value/this.maxValue);
        let element = new Element(value, this.position(this.n), this.y, this.elementWidth, h);

        this.elements.push(element);

        this.n++;   
    }

    updateDraw(){
        //console.log(this.transition);
        this.update();
        this.draw();
    }

    draw(){
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
                this.elements[this.u].x += this.dx;
                for(let i = this.u+1; i <= this.v; i++){
                    this.elements[i].x -= this.dx * 1/(this.v - this.u);
                }
            }
            else if(this.v < this.u){
                this.elements[this.u].x -= this.dx;
                for(let i = this.v; i < this.u; i++){
                    this.elements[i].x += this.dx * 1/(this.u - this.v);
                }
            }
            

            const target = this.position(this.v);
            if(Math.abs(this.elements[this.u].x - target) <= 3){
                this.elements[this.u].x = target;
                
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
                //console.log("should resolve");
            
            }

        }
        else{
            for(let i = 0; i < this.n; i++){
                this.elements[i].x = this.position(i);
            }
        }
    }
}