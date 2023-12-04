// script.js

class Nodo {
    constructor(valor) {
        this.valor = valor;
        this.izquierda = null;
        this.derecha = null;
    }
}

function inOrder(node, result) {
    if (node) {
        inOrder(node.izquierda, result);
        result.push(node.valor);
        inOrder(node.derecha, result);
    }
}

function preOrder(node, result) {
    if (node) {
        result.push(node.valor);
        preOrder(node.izquierda, result);
        preOrder(node.derecha, result);
    }
}


function generarPostOrder() {
    const preOrderInput = document.getElementById('preOrderInput').value.trim();
    const inOrderInput = document.getElementById('inOrderInput').value.trim();

    const preOrderList = preOrderInput.split(',').map(item => parseInt(item.trim()));
    const inOrderList = inOrderInput.split(',').map(item => parseInt(item.trim()));

    const raiz = construirArbol(preOrderList, inOrderList);

    const postOrderList = [];
    postOrderFromInPre(inOrderList, preOrderList).forEach(valor => {
        postOrderList.push(valor);
    });

    document.getElementById('resultado').textContent = 'Post-Order: ' + postOrderList.join(', ');
}

function construirArbol(preOrderList, inOrderList) {
    if (preOrderList.length === 0 || inOrderList.length === 0) {
        return null;
    }

    const rootValue = preOrderList[0];
    const rootIndexInOrder = inOrderList.indexOf(rootValue);

    const inOrderLeft = inOrderList.slice(0, rootIndexInOrder);
    const inOrderRight = inOrderList.slice(rootIndexInOrder + 1);

    const preOrderLeft = preOrderList.slice(1, rootIndexInOrder + 1);
    const preOrderRight = preOrderList.slice(rootIndexInOrder + 1);

    const node = new Nodo(rootValue);
    node.izquierda = construirArbol(preOrderLeft, inOrderLeft);
    node.derecha = construirArbol(preOrderRight, inOrderRight);

    return node;
}
