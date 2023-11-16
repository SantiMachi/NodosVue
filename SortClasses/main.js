import {Array, Element} from "./Array.mjs"; 

console.log("chambeaSort")

var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const movelo = document.getElementById("movelo");

movelo.addEventListener("click", e =>{
    //array.move(1, 6);
    //console.log("llamado");
    bubbleSort();
})

var array = new Array(ctx, 500, 400, 200);

array.push(5);
array.push(3);
array.push(2);
array.push(10);
array.push(11);
array.push(9);
array.push(20);
array.push(10);
array.push(7);

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
                catch{
                    console.log("movement fucked");
                }
            }
        }
    }
}
