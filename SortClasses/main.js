import {Array, Element} from "./Array.mjs"; 

console.log("chambeaSort")

var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var array = new Array(ctx, 500, 700, 200);

array.push(5);
array.push(3);
array.push(2);
array.push(10);
array.push(11);
array.push(9);

//array.move(1, 5);

function animation(){
    requestAnimationFrame(animation);

    array.draw();
}

animation();