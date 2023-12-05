

export function TransportSolver(costMatrix, supply, demand, minimize = true){
    
    let assigment, rows, columns, u, v, bi, bj, optim;
    let r = supply.length;
    let c = demand.length;

    [assigment, rows, columns] = NorthWest(costMatrix, supply, demand);
    [u, v] = uv_dfs(assigment, costMatrix, rows, columns);
    optim = optimalityCheck(costMatrix, u, v, minimize);

    while(optim != null){
        printMatrix(assigment);
        [bi, bj] = optim;        
        let path = loop_dfs(bi, bj, assigment, rows, columns);

        console.log(path);
        let min = Infinity;
        let ei = null;
        let ej = null;

        if(path == null) break; // REVISAR
        for(let [index, pivot] of path.entries()){
            if(index%2 == 1){
                if(ei == null || assigment[pivot[0]][pivot[1]] < min){
                    ei = pivot[0];
                    ej = pivot[1];
                    min =  assigment[ei][ej];
                }
            }
        }

        for(let [index, pivot] of path.entries()){
            if(index%2 == 1){
                assigment[pivot[0]][pivot[1]] -= min;
            }
            else{
                assigment[pivot[0]][pivot[1]] += min;
            }
        }

        rows[ei].delete(ej);
        columns[ej].delete(ei);

        rows[bi].add(bj);
        columns[bj].add(bi);

        console.log("ei", ei)
        console.log("ej", ej);

        optim = optimalityCheck(costMatrix, u, v);
        console.log(Array.from(rows));
        console.log(Array.from(columns));
        console.log(optim);
        console.log("u", Array.from(u));
        console.log("v", Array.from(v));  

        printMatrix(assigment);
        [u, v] = uv_dfs(assigment, costMatrix, rows, columns);
        optim = optimalityCheck(costMatrix, u, v, minimize);
    }
    
    let sum = 0;
    for(let i = 0; i < r; i++){
        for(let j = 0; j < c; j++){
            sum += assigment[i][j]*costMatrix[i][j];
        }
    }

    [u, v] = uv_dfs(assigment, costMatrix, rows, columns);
    optim = optimalityCheck(costMatrix, u, v);
    console.log(Array.from(rows));
    console.log(Array.from(columns));
    console.log(optim);
    console.log("u", Array.from(u));
    console.log("v", Array.from(v)); 

    printMatrix(assigment);
    console.log("total:", sum);

    return [sum, assigment];
}

function loop_dfs(i, j, assigment, rows, columns){

    return dfs(i, j, []);

    function dfs(n_i, n_j, path){
        let parity = path.length%2;
        if(parity == 1 && assigment[n_i][n_j] == 0) return null;
        
        path.push([n_i, n_j]);
        if(path.length > 2 && (n_i == i || n_j == j)){
            return path;
        } 
        else{
            let n = path.length;
            if(n <= 1){
                for(let new_i  of columns[n_j]){
                    if(path.some((point, index) => point[0] == new_i && index != 0)){
                        continue;
                    }
                    let aux = dfs(new_i, n_j, [...path]);
                    if(aux != null) return aux;
                }

                for(let new_j  of rows[n_i]){
                    if(path.some((point, index) => point[1] == new_j && index != 0)){
                        continue;
                    }
                    let aux = dfs(n_i, new_j, [...path]);
                    if(aux != null) return aux;
                }
                return null;
            }
            else if(path[n-2][0] == path[n-1][0]){
                for(let new_i  of columns[n_j]){
                    if(path.some((point, index) => point[0] == new_i && index != 0)){
                        continue;
                    }
                    let aux = dfs(new_i, n_j, [...path]);
                    if(aux != null) return aux;
                }
                return null;
            }
            else{
                for(let new_j  of rows[n_i]){
                    if(path.some((point, index) => point[1] == new_j && index != 0)){
                        continue;
                    }
                    let aux = dfs(n_i, new_j, [...path]);
                    if(aux != null) return aux;
                }
                return null;
            }
        }
    }
}

function optimalityCheck(costMatrix, u, v, minimize = true){
    let index = 0;
    let jindex = 0;
    let minp = 0;

    let r = costMatrix.length;
    let c = costMatrix[0].length;
    
    for(let i = 0; i < r; i++){
        for(let j = 0; j < c; j++){
            let ind = costMatrix[i][j] - u[i] - v[j];
            if(minimize){
                if(ind < 0){
                    if(ind < minp){
                        minp = ind;
                        index = i;
                        jindex = j;
                    }
                }    
            }
            else{
                if(ind > 0){
                    if(ind > minp){
                        minp = ind;
                        index = i;
                        jindex = j;
                    }
                }  
            }
        }
    }


    if(minimize && minp < 0) return [index, jindex];
    else if(!minimize && minp > 0) return [index, jindex];
    else return null;
}

function uv_dfs(assigment, costMatrix, rows, columns){

    let rindex = 0;
    let cindex = null;
    for(let [i, row] of rows.entries()){
        if(row.size > rows[rindex].size){
            rindex = i;
        }
    }
    
    let u = new Array(rows.length).fill(null);
    let v = new Array(columns.length).fill(null);

    let vis = [];
    for(let i = 0; i < rows.length; i++){
        vis.push(new Array(columns.length).fill(false));
    }

    u[rindex] = 0;
    cindex = rows[rindex].values().next().value;

    dfs(rindex, cindex);

    function dfs(i, j){
        if(vis[i][j]) return;
    
        vis[i][j] = true;
        if(v[j] != null) u[i] = costMatrix[i][j] - v[j];
        else if(u[i] != null) v[j] = costMatrix[i][j] - u[i];

        for(let new_j of rows[i]){
            dfs(i, new_j);
        }
        for(let new_i of columns[j]){
            dfs(new_i, j);
        }
    }

    return [u, v];
}

export function NorthWest(costMatrix, supply, demand){
    let csupply = [...supply];
    let cdemand = [...demand];
    
    let r = csupply.length;
    let c = cdemand.length; 
    
    let columns = []
    for(let i = 0; i < c; i++){
        columns.push(new Set());
    }
    
    let rows = []
    for(let i = 0; i < r; i++){
        rows.push(new Set());
    }

    let asssigment = []
    for(let i = 0; i < r; i++){
        asssigment.push(new Array(c).fill(0));
    }

    let i = 0;
    let j = 0;

    while(i <= r-1 && j <= c-1){
        let located = Math.min(csupply[i], cdemand[j]);
        csupply[i] -= located;
        cdemand[j] -= located;

        rows[i].add(j);
        columns[j].add(i);
        asssigment[i][j] = located;
        if(csupply[i] == 0) i++;
        else j++;
    }

    printMatrix(asssigment)
    console.log("rows", rows);
    console.log("columns", columns);
    console.log("supply", csupply)
    console.log("demand", cdemand)
    
    return [asssigment, rows, columns];
}

function printMatrix(array){
    console.table(array);
    var s = ""
    for(let i = 0; i <  array.length; i++){
        for(let j = 0; j < array[0].length; j++){
            s += array[i][j] + " "
        }
        s += "\n"
    }
    //console.log(array)
    //console.log(s);
}