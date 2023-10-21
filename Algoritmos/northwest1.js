var fil = 0;
var col = 0;
var supply = [];
var demand = [];
var cost = [];
var result = [];

function crearTabla() {
    // Obtiene el número de filas y columnas de la tabla a partir de los inputs.
    var filas = parseInt(document.getElementById("numFilas").value);
    var columnas = parseInt(document.getElementById("numColumnas").value);

    var tabla = document.getElementById("tabla");

    tabla.innerHTML = '';

    // Crea la tabla con inputs para ingresar los costos.
    for (var i = 0; i <= filas + 1; i++) {
        var fila = tabla.insertRow(i);
        for (var j = 0; j <= columnas + 1; j++) {
            var celda = fila.insertCell(j);

            if (i === 0 && j === 0) {
                celda.innerHTML = '';
            } else if (i === 0) {
                if (j === columnas + 1) {
                    celda.innerHTML = "Demanda";
                } else {
                    celda.innerHTML = "Columna " + j;
                }
            } else if (j === 0) {
                if (i === filas + 1) {
                    celda.innerHTML = "Oferta";
                } else {
                    celda.innerHTML = "Fila " + i;
                }
            } else {
                var input = document.createElement("input");
                input.type = "number";
                input.id = "input" + i + "-" + j;
                celda.appendChild(input);
            }
            if (i === filas + 1 && j === columnas + 1) {
                celda.innerHTML = '';
            }
        }
    }
}

function obtenerDatosDeInputs() {
    // Obtiene el número de filas y columnas de la tabla a partir de los inputs.
    var filas = parseInt(document.getElementById("numFilas").value);
    var columnas = parseInt(document.getElementById("numColumnas").value);

    var datos = [];
    var datos1 = [];
    var datos2 = [];

    // Recorre las filas y columnas para obtener los valores de los inputs.
    for (var i = 1; i <= filas; i++) {
        datos[i - 1] = []; // Inicializa un arreglo para cada fila.
        for (var j = 1; j <= columnas; j++) {
            var input = document.getElementById("input" + i + "-" + j);
            datos[i - 1][j - 1] = input.value; // Obtiene el valor del input y lo almacena en la matriz.
        }
    }

    for (var j = 1; j <= columnas; j++) {
        var input = document.getElementById("input" + j + "-" + (columnas + 1));
        datos1[j - 1] = input.value; // Obtiene el valor del input de demanda y lo almacena en la matriz.
    }
    for (var j = 1; j <= filas; j++) {
        var input = document.getElementById("input" + (filas + 1) + "-" + j);
        datos2[j - 1] = input.value; // Obtiene el valor del input de oferta y lo almacena en la matriz.
    }

    // Almacena los datos en las variables globales.
    cost = datos;
    supply = datos2; // Cambiamos los nombres de supply y demand para que coincidan con el algoritmo.
    demand = datos1; // Cambiamos los nombres de supply y demand para que coincidan con el algoritmo.
    result = northwestCorner(supply, demand, cost);
}

function northwestCorner(matrixSupply, matrixDemand, costMatrix) {
    const numRows = matrixSupply.length;
    const numCols = matrixDemand.length;

    const allocationMatrix = new Array(numRows).fill(null).map(() => new Array(numCols).fill(0));

    let i = 0;
    let j = 0;

    while (i < numRows && j < numCols) {
        const supply = matrixSupply[i];
        const demand = matrixDemand[j];

        if (supply > demand) {
            allocationMatrix[i][j] = demand;
            matrixSupply[i] -= demand;
            matrixDemand[j] = 0;
            j++;
        } else if (supply < demand) {
            allocationMatrix[i][j] = supply;
            matrixDemand[j] -= supply;
            matrixSupply[i] = 0;
            i++;
        } else {
            allocationMatrix[i][j] = supply;
            matrixSupply[i] = 0;
            matrixDemand[j] = 0;
            i++;
            j++;
        }
        fil = i; // Almacenamos la fila actual para uso posterior.
        col = j; // Almacenamos la columna actual para uso posterior.
    }

    return allocationMatrix;
}

// Función para mostrar la tabla con los resultados.
function fillTable() {
    obtenerDatosDeInputs();

    // Obtén las dimensiones de la matriz result.
    var numRows = result.length;
    var numCols = result[0].length;

    for (var i = 1; i < numRows + 1; i++) {
        var fila = document.getElementById("tabla").rows[i];
        for (var j = 1; j < numCols + 1; j++) {
            var celda = fila.cells[j];
            celda.innerHTML = result[i - 1][j - 1];
        }
    }
    
    // Realizar el cálculo del costo total.
    var totalCost = calcularCostoTotal(cost, result);
    
    // Mostrar el costo total en la consola.
    console.log("Costo Total: " + totalCost);
}

// Función para calcular el costo total a partir de los costos y la asignación.
function calcularCostoTotal(costMatrix, allocationMatrix) {
    var totalCost = 0;
    for (var i = 0; i < allocationMatrix.length; i++) {
        for (var j = 0; j < allocationMatrix[i].length; j++) {
            totalCost += costMatrix[i][j] * allocationMatrix[i][j];
        }
    }
    return totalCost;
}

// Ejemplo de uso:
// Puedes utilizar las funciones "crearTabla" y "fillTable" para ingresar los datos, mostrar la asignación y el costo total en la consola.


