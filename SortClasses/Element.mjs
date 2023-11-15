
export class Element{
    constructor(value, x, y, width, height){
        this.value = value;
        this.defaultFillColor = "black"; 
        this.fillColor = this.defaultFillColor;
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.isSelected = false;
    }

    draw(ctx){
        ctx.beginPath();
        ctx.fillStyle = this.fillColor;
        ctx.fillRect(this.x, this.y, this.width, this.height); 
        ctx.closePath();
        //console.log(this.x , this.y, this.width, this.height);
    }

    update(){
        if(this.isSelected) this.fillColor = "#006aff";
        else this.fillColor = this.defaultFillColor;
    }
    updateDraw(ctx){
        this.update();
        this.draw(ctx);
    }

}