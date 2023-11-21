
export class Element{
    constructor(value, i, x, y, width, height){
        this.value = value;
        this.defaultFillColor = "black"; 
        this.fillColor = this.defaultFillColor;
        this.x = x;
        this.y = y;
        this.index = i;
        this.height = height;
        this.width = width;
        this.isSelected = false;
    }

    draw(ctx){
        ctx.beginPath();
        ctx.fillStyle = this.fillColor;
        ctx.fillRect(this.x, this.y - this.height, this.width, this.height); 
        ctx.closePath();
        //console.log(this.x , this.y, this.width, this.height);
        ctx.font = '24px Montserrat, sans-serif';
        ctx.fillText(this.index.toString(), ((2*this.x + this.width) / 2), 
        this.y + 24);
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