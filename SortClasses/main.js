import {Array, Element} from "./Array.mjs"; 

console.log("chambeaSort")

var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const movelo = document.getElementById("movelo");


var array = new Array(ctx, 500, 700, 200);

movelo.addEventListener("click", e =>{
    //array.move(1, 6);
    //console.log("llamado");
    //bubbleSort();
    array.dx = 5;
    mergeSort(0, array.n-1);
    //array.move(1, 0);
    
})



var n  = 10;

for(let i  = 0; i < n; i++){
    array.push(Math.random());
}


//array.move(1, 5);

function animation(){
    requestAnimationFrame(animation);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    array.updateDraw();
}

animation();


async function bubbleSort(){
    
    for(let i = 0; i < array.n-1; i ++){
        for(let j = 0; j < array.n-i-1; j++){
            console.log("pin");
            if(array.elements[j].value > array.elements[j+1].value){
                try{
                    await array.move(j, j+1);
                    console.log("movement finished");
                }
                catch(error){
                    console.log("movement fucked", error);
                }
            }
        }
    }
}


async function mergeSort(b, e){
    if(b >= e) return;
    var h = Math.floor((b+e)/2);
    console.log( "b", b,"h", h, "e", e);
    mergeSort(b, h);
    mergeSort(h+1,e);

    var i = b;
    var j = h+1;
    var c = [];
    //var g = [];
    while((i <= h) && (j <= e)){
        if(array.elements[i].value < array.elements[j].value){
            c.push(array.elements[i]);
            //g.push(array.elements[i].value);
            //console.log("b:", array.elements[i].value);
            i++;
        }
        else{
            c.push(array.elements[j]);
            //g.push(array.elements[j].value);
            //console.log("e:", array.elements[j].value);
            j++;
        }
    }

    while(i <= h){
        c.push(array.elements[i]);
        //g.push(array.elements[i].value);
        //console.log("b:", array.elements[i].value);
        i++;
    }

    while(j <= e){
        c.push(array.elements[j]);
        //g.push(array.elements[j].value);
        //console.log("e:", array.elements[j].value); 
        j++;
    }

    console.log(c);
    //console.log(g);
    /*
    for(let k = 0; k < c.length; k++){
        array.elements[b+k].value = c[k];
    } */  
    for(let k = 0; k < c.length; k++){
        
        //console.log(x, b+k);
        //var x = array.elements.indexOf(c[k]);
        try{
            console.log("u", c[k].index,"v", b+k);
            await array.move(c[k].index, b+k);
            console.log("movement finished");
        }
        catch(error){
            console.log("movement fucked", error);
        }
    }

    console.log(array.elements);
}