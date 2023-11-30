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
const saveButton = document.getElementById("save_btn");
const loadButton = document.getElementById("load_btn");

var oarray = new Array(ctx, 500, 400, 700, 200);
oarray.title = "Arreglo Original"
var array = new Array(ctx, 500, 800, 700, 200);
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
    //resetArray();
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
    array.performance = parseInt(res[2]);
    console.log(res[2]);
    //console.log(steps)
    array.playAnimation(steps);
})



randomButton.addEventListener("click", e=>{
    
    var n  = parseInt(prompt("Ingrese la cantidad de elementos"));
    if(isNaN(n)){
        alert("Formato Incorrecto");
        return;
    }

    
    oarray.clear();
    for(let i  = 0; i < n; i++){
        oarray.push((Math.random()+0.1)/1.1);
    }   

    resetArray();
})

elementButton.addEventListener("click", e => {
    
    var n  = parseInt(prompt("Ingrese el valor a añadir")); 
    if(isNaN(n)){
        alert("Formato Incorrecto");
        return;
    }

    oarray.push(n/100);   

    resetArray();
}

)

comboBox.addEventListener('change', function() {
    
    if(comboBox.value == "1"){
        array.title = "Selection Sort";
        array.performance = null;
    }
    else if(comboBox.value == "2"){
        array.title = "Bubble Sort";
        array.performance = null;
    }
    else if(comboBox.value == "3"){
        array.title = "Insertion Sort";
        array.performance = null;
    }
    else if(comboBox.value == "4"){
        array.title = "Merge Sort";
        array.performance = null;
    }
    else if(comboBox.value == "5"){
        array.title = "Shell Sort";
        array.performance = null;
    }

    resetArray();
});

comboBox.selectedIndex = 0;
array.title = "Selection Sort";

const fileInput = document.createElement('input');
fileInput.type = "file";
fileInput.id = "fileInput";
fileInput.style.display = "none";
document.body.appendChild(fileInput);

saveButton.addEventListener("click", e =>{
    downloadFile();
  })
  
  loadButton.addEventListener('click', e => { 
    loadFile();
  });

  

function animation(){
    requestAnimationFrame(animation);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    array.updateDraw();
    oarray.updateDraw()
}

animation();


function resetArray(){
    array.clear();
    array.performance = null;
    for(let element of oarray.elements){
        array.push(element.value);
    }
}


function bubbleSort(array){
    let steps = [];
    let carray = array.slice(0);
    let start = performance.now();
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
    let end = performance.now();
    return [carray, steps, end - start];
}

function mergeSort(array){
    let steps = [];
    let carray = array.slice(0);
    let start = performance.now();
    mergeSortIt(0, array.length-1, carray, steps);
    let end = performance.now();
    return [carray, steps, end - start];
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
    let start = performance.now();
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
    let end = performance.now();
    return [carray, steps, end - start];
}

function insertionSort(array){
    let steps = [];
    let carray = array.slice(0);
    let start = performance.now();
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
    let end = performance.now();
    return [carray, steps, end - start];
}

function shellSort(array) {
    let steps = []
    let arr = array.slice(0);

    let start = performance.now();
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
    let end = performance.now();
  return [arr, steps, end-start];
}




function downloadFile(){
      
    const jsonString = JSON.stringify(oarray);

    const filename = 'Project1.json';
  
    // Create a blob with the data
    const blob = new Blob([jsonString], { type: 'application/json' });
  
    // Create a temporary URL for the file
    const url = window.URL.createObjectURL(blob);
  
    // Create a link and trigger a click to download the file
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  
    // Clean up
    window.URL.revokeObjectURL(url);
}




function loadFile(){
    fileInput.click();
    let self = this;
    fileInput.addEventListener('change', function(event) {
        const selectedFile = event.target.files[0];
        const reader = new FileReader();
  
        reader.onload = function(event) {
            try {
                var data = JSON.parse(event.target.result);
                oarray = new Array(ctx, data.x, data.y, data.maxWidth, data.maxHeight);
                for(const element of data.elements){
                    oarray.push(element.value);
                }
                resetArray();
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        };
  
        reader.readAsText(selectedFile);
    });
    return self.graph;
}  

            
