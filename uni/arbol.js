const canvas = document.getElementById('myCanvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 2;

const ctx = canvas.getContext("2d");
ctx.font = "18px Arial";

let firstArray = null;

function makeNode(x, y, data) {
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(data, x, y);
}

function createText(x, y, data) {}

function joinNode(x, y, toX, toY) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(toX, toY);
    ctx.stroke();
}

class Node {
    constructor(data, x, y) {
        this.value = data;
        this.frequency = 1;
        this.x = x;
        this.y = y;
        this.left = null;
        this.right = null;
    }
}

class BST {
    constructor() {
        this.root = null;
    }

    insertHelper(value, node, x, y, gap) {
        gap = (gap / 2 > 60) ? gap / 2 : gap;
        if (node === null) {
            node = new Node(value, x, y);
            makeNode(x, y, value);
            createText(x, y, value);
            return node;
        }

        if (value < node.value) {
            node.left = this.insertHelper(value, node.left, x - gap, y + 100, gap / 2);
        } else if (value > node.value) {
            node.right = this.insertHelper(value, node.right, x + gap, y + 100, gap / 2);
        }

        return node;
    }

    insert(value) {
        this.root = this.insertHelper(value, this.root, canvas.width / 2, 50, 300);
    }

    pre() {
        let visited = [];
        let traverse = node => {
            if (node) {
                visited.push(node.value);
                if (node.left) traverse(node.left);
                if (node.right) traverse(node.right);
            }
        }

        traverse(this.root);
        return visited;
    }

    in() {
        let visited = [],
            current = this.root;
        let traverse = node => {
            if (node.left) traverse(node.left);
            visited.push(node.value);
            if (node.right) traverse(node.right);
        }

        traverse(current);
        return visited;
    }

    post() {
        let visited = [],
            current = this.root;
        let traverse = node => {
            if (node.left) traverse(node.left);
            if (node.right) traverse(node.right);
            visited.push(node.value);
        }

        traverse(current);
        console.log("postorder", visited)
        return visited;
    }

    updateGraph() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawTree(this.root, canvas.width / 2, 50, 300);
    }

    drawTree(node, x, y, gap) {
        if (node !== null) {
            if (node.left) {
                let childX = x - gap;
                let childY = y + 100;
                joinNode(x, y, childX, childY);
                this.drawTree(node.left, childX, childY, gap / 2);
            }

            if (node.right) {
                let childX = x + gap;
                let childY = y + 100;
                joinNode(x, y, childX, childY);
                this.drawTree(node.right, childX, childY, gap / 2);
            }

            makeNode(x, y, node.value);
            createText(x, y, node.value);
        }
    }

    resetRoot() {
        this.root = null;
    }
}

function buildTree(inOrder, postOrder) {
    if (inOrder.length === 0 || postOrder.length === 0) {
      return [];
    }

    const rootValue = postOrder.pop();
    const rootIndex = inOrder.indexOf(rootValue);

    const inOrderLeft = inOrder.slice(0, rootIndex);
    const inOrderRight = inOrder.slice(rootIndex + 1);

    const postOrderLeft = postOrder.slice(0, inOrderLeft.length);
    const postOrderRight = postOrder.slice(inOrderLeft.length);

    const root = [rootValue];

    return root.concat(
      buildTree(inOrderLeft, postOrderLeft),
      buildTree(inOrderRight, postOrderRight)
    );
  }

var tree = new BST();
var bstForm = document.getElementById('form-trees');
var array = [];
var resultDiv = document.getElementById('resultDiv');

bstForm.addEventListener('click', (event) => {
    event.preventDefault();
    array = [];
    tree.resetRoot();
    let valores = document.querySelector('[name="nodosLista"]');
    if (valores) {
        let valoresArray = valores.value.split(',').map(val => parseInt(val.trim()));
        if (!firstArray) firstArray = valoresArray;
        console.log(firstArray);
        valoresArray.forEach(valor => {
            if (!isNaN(valor)) {
                tree.insert(valor);
                array.push(valor);
            }
        });

        updateResultDiv(array);

        // Agrega la siguiente línea para actualizar el grafo después de cada inserción
        tree.updateGraph();
    }
});


function reconstruir(){
    const po = document.getElementById("preOrderInput");
    const io = document.getElementById("inOrderInput");
    const to = document.getElementById("postOrderInput");

    if(po.value == ""|| po.value == null){
        if((io.value == "" || io.value == null) ||
        (to.value == "" || to.value == null)){
            alert("Sin datos suficientes");
            return;
        }

        array = [];
        tree.resetRoot();
        let a = io.value.split(',').map(val => parseInt(val.trim()));
        let b = to.value.split(',').map(val => parseInt(val.trim()));
            let valoresArray = buildPreorder(a, b);
            if (!firstArray) firstArray = valoresArray;
            console.log(firstArray);
            valoresArray.forEach(valor => {
                if (!isNaN(valor)) {
                    tree.insert(valor);
                    array.push(valor);
                }
            });

            console.log(array);
            updateResultDiv(array);
            console.log(tree);
            // Agrega la siguiente línea para actualizar el grafo después de cada inserción
            tree.updateGraph();
    }
    else{
        if((io.value == "" || io.value == null) &&
            (to.value == "" || to.value == null)){
            alert("Sin datos suficientes");
            return;
        }

        array =[];
        tree.resetRoot();
        let valores = document.querySelector('[name="nodosLista"]');
        if (valores) {
            let valoresArray = po.value.split(',').map(val => parseInt(val.trim()));
            if (!firstArray) firstArray = valoresArray;
            console.log(firstArray);
            valoresArray.forEach(valor => {
                if (!isNaN(valor)) {
                    tree.insert(valor);
                    array.push(valor);
                }
            });
    
            console.log(array);
            updateResultDiv(array);
            console.log(tree);
            // Agrega la siguiente línea para actualizar el grafo después de cada inserción
            tree.updateGraph();
        }

    }

}

function buildPreorder(inorder, postorder) {
    if (inorder.length === 0 || postorder.length === 0) {
      return [];
    }
  
    const rootValue = postorder.pop();
    const rootIndexInInorder = inorder.indexOf(rootValue);
  
    return [
      rootValue,
      ...buildPreorder(inorder.slice(0, rootIndexInInorder), postorder),
      ...buildPreorder(inorder.slice(rootIndexInInorder + 1), postorder)
    ];
  }


function recorrido(task) {
    let result = firstArray;
    if (task == "preOrder") {
        result = tree.pre();
    } else if (task == "inOrder") {
        result = tree.in();
    } else if (task == "postOrder") {
        result = tree.post();
    }
    array = result;
    updateInput(array);
    updateResultDiv(array);
    // Agrega la siguiente línea para actualizar el grafo después de cada recorrido
    tree.updateGraph();
}

function updateInput(value) {
    return;
}

function updateResultDiv(values) {
    if (resultDiv) {
        resultDiv.innerHTML = "<h3>Resultados:</h3><p>" + values.join(', ') + "</p>";
    }
}

// Agrega el siguiente código para crear un botón de "Guardar Estado"
var saveButton = document.createElement('button');
saveButton.textContent = 'Guardar Estado';
saveButton.addEventListener('click', function () {
    // Guarda el estado en un archivo
    const blob = new Blob([JSON.stringify(tree)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'arbol.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
    alert('Estado del árbol guardado correctamente.');
});
document.body.appendChild(saveButton);

// Agrega el siguiente código para crear un botón de "Recuperar Estado"
var loadButton = document.createElement('input');
loadButton.type = 'file';
loadButton.accept = '.json';
loadButton.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            // Recupera el estado desde el archivo
            const newState = JSON.parse(e.target.result);
            tree = new BST();
            Object.assign(tree, newState);
            tree.updateGraph();
            alert('Estado del árbol recuperado correctamente.');
        };
        reader.readAsText(file);
    }
});
document.body.appendChild(loadButton);