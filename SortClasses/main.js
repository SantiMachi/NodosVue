import {Array, Element} from "./Array.mjs"; 

console.log("chambeaSort")

var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const movelo = document.getElementById("movelo");


var array = new Array(ctx, 500, 700, 200);
var carray = array.elements.slice();
var steps = [];
movelo.addEventListener("click", e =>{
    //array.move(1, 6);
    //console.log("llamado");
    //bubbleSort();
    array.dx = 5;
    
    carray = array.elements.slice()
    console.log(carray);
    steps = [];
    bubbleSort(0, array.n-1);

    console.log("steps", steps)
    array.playAnimation(steps);
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


function bubbleSort(){
    for(let i = 0; i < array.n-1; i ++){
        for(let j = 0; j < array.n-i-1; j++){
            if(carray[j].value > carray[j+1].value){
                steps.push([carray[j], j+1]);
                let temp = carray[j+1];
                carray[j+1] = carray[j];
                carray[j] = temp;
            }
        }
    }
}


function mergeSort(b, e){
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
        if(carray[i].value < carray[j].value){
            c.push(carray[i]);
            i++;
        }
        else{
            c.push(carray[j]);
            j++;
        }
    }

    while(i <= h){
        c.push(carray[i]);
        i++;
    }

    while(j <= e){
        c.push(carray[j]);
        j++;
    }

    console.log(c);
    //console.log(g);
    /*
    for(let k = 0; k < c.length; k++){
        array.elements[b+k].value = c[k];
    } */  
    for(let k = 0; k < c.length; k++){
        steps.push([c[k], b+k]);
        carray[b+k] = c[k];
    }
}