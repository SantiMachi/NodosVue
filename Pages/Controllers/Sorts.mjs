import {Array, Element} from "../../SortClasses/Array.mjs"

console.log("chambeaSort")

var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const movelo = document.getElementById("movelo");
const randomButton =  document.getElementById("random_button");
const elementButton =  document.getElementById("element_button");
const comboBox = document.getElementById('myComboBox');

var array = new Array(ctx, 500, 500, 700, 200);
var time = null;

function printArray(arr){
    var s = "";
    for(let o of arr){
        s += o.value.toString()+ "\n"
    }
    console.log(s);
}


canvas.addEventListener("resize", e=>{
    array.maxWidth = canvas.innerWidth*(3/4);
})

movelo.addEventListener("click", e =>{

    let res;
    if(comboBox.value == "1"){
        res = selectionSort(array.elements);
        array.title = "Selection Sort";
    }
    else if(comboBox.value == "2"){
        res = bubbleSort(array.elements);
        array.title = "Bubble Sort";
    }
    else if(comboBox.value == "3"){
        res = insertionSort(array.elements);
        array.title = "Insertion Sort";
    }
    else if(comboBox.value == "4"){
        res = mergeSort(array.elements);
        array.title = "Merge Sort";
    }
    else if(comboBox.value == "5"){
        res = shellSort(array.elements);
        array.title = "Shell Sort";
    }
    let steps = res[1];

    console.log(steps)
    array.playAnimation(steps);
})

randomButton.addEventListener("click", e=>{
    try{
        var n  = parseInt(prompt("Ingrese la cantidad de elementos"));
        array.clear();
        for(let i  = 0; i < n; i++){
            array.push((Math.random()+0.1)/1.1);
        }
    }
    catch{
        alert("Formato Incorrecto");
    }      
})

elementButton.addEventListener("click", e => {
    try{
        var n  = parseInt(prompt("Ingrese el valor a añadir"));
        array.push(n/100);
    }
    catch{
        alert("Formato Incorrecto");
    }     
}

)

comboBox.addEventListener('change', function() {
    if(comboBox.value == "1"){
        array.title = "Selection Sort";
    }
    else if(comboBox.value == "2"){
        array.title = "Bubble Sort";
    }
    else if(comboBox.value == "3"){
        array.title = "Insertion Sort";
    }
    else if(comboBox.value == "4"){
        array.title = "Merge Sort";
    }
    else if(comboBox.value == "5"){
        array.title = "Shell Sort";
    }
});

function animation(){
    requestAnimationFrame(animation);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    array.updateDraw();
}

animation();


function bubbleSort(array){
    let steps = [];
    let carray = array.slice(0);
    for(let i = 0; i < array.length-1; i ++){
        for(let j = 0; j < array.length-i-1; j++){
            if(carray[j].value > carray[j+1].value){
                steps.push([carray[j], j+1]);
                let temp = carray[j+1];
                carray[j+1] = carray[j];
                carray[j] = temp;
            }
        }
    }
    return [carray, steps];
}

function mergeSort(array){
    let steps = [];
    let carray = array.slice(0);
    mergeSortIt(0, array.length-1, carray, steps);

    return [carray, steps];
}
function mergeSortIt(b, e, carray, steps){
    if(b >= e) return;
    var h = Math.floor((b+e)/2);
    //console.log( "b", b,"h", h, "e", e);
    mergeSortIt(b, h, carray, steps);
    mergeSortIt(h+1,e, carray, steps);

    
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
    for(let k = 0; k < c.length; k++){
        if(carray.indexOf(c[k]) != b+k){
            steps.push([c[k], b+k]);
            carray[b+k] = c[k];
        }
    }
}


function selectionSort(array){
    var steps = [];
    var carray = array.slice(0);
    for(let i = 0; i < array.length; i++){
        let mini = i;
        for(let j = i; j < array.length; j++){
            if(carray[j].value < carray[mini].value){
                mini = j;     
            }
        }
        steps.push([carray[mini], i]);
        let temp = carray[i];
        carray[i] = carray[mini];
        carray[mini] = temp;
    }
    return [carray, steps];
}

function insertionSort(array){
    let steps = [];
    let carray = array.slice(0);
    for(let i = 0; i < array.length; i++){
        let b = 0;
        let e = i;
        let h = Math.floor((b+e)/2);
        while(b < e){
            h = Math.floor((b+e)/2);
            if(carray[h].value < carray[i].value){
                b = h+1;
            }
            else{
                e = h;
            }
        }

        steps.push([carray[i], b]);
        let temp = carray[i];
        carray.splice(i, 1);
        carray.splice(b, 0, temp);
    }
    return [carray, steps];
}

function shellSort(array) {
    let steps = []
    let arr = array.slice(0);
    let len = arr.length;
    let gap = Math.floor(len / 2);

    while (gap > 0) {
        for (var i = gap; i < len; i++) {
        var temp = arr[i];
        var j = i;

        while (j >= gap && arr[j - gap].value > temp.value) {
            steps.push([arr[j - gap], j]);
            arr[j] = arr[j - gap];
            j -= gap;
        }

        arr[j] = temp;
        }

        gap = Math.floor(gap / 2);
    }

  return [arr, steps];
}