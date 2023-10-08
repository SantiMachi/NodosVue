
const valor = [
    'A',2,'B','B',3,'C','C',2,'D','B',7,'D','D',3,'E'
];

const nodos = [
    'A','B','C','D','E'
];

var optim=0;


function algoritmoJohnson(valor,nodos) {

    var vals = [];
    var c = 0;
    
    nodos.forEach(nodo => {
        vals[c]=[];
        for (let i = 0; i < valor.length; i=i+3) {
            if(nodo==valor[i]){
                var k = 0;
                
                nodos.forEach(nod => {
                    if(vals[c][k]==0 || vals[c][k]==undefined){
                        vals[c][k]=0;
                    }
                    if(nod==valor[i+2]){
                        vals[c][k]=valor[i+1];
                    }
                    k++;
                });
                
            }
            
        }
        c++;
    });


    var sum1=[];
    var sum2=[];
    var nodop=[];
    var nodosop =[];
    var max=0;

    for (let i = nodos.length; i >=0; i--) {
        //sum[nodos.length-i]=vals[0][i-1];
        sum2[nodos.length-i]=0;
    }

    for (let i = 0; i < nodos.length; i++) {
        var x=0;
        var flag=false;
        for (let y = i+1; y < nodos.length; y++) {
            var n=0;
            for (let j = i+1; j < nodos.length; j++) {
                sum2[y-1]=sum2[y-1]+vals[n][j];
                console.log('esto: '+nodos[n]);
                nodop[j-1]=nodos[n];
                n=j;
                if (flag) {
                    x++;
                    j=j+x;
                    flag=false;
                }
                
            }
            
            if(sum2[y-1]>max){
                max=sum2[y-1];
                nodop.push(nodos[nodos.length-1]);
                nodosop.splice(0, nodosop.length);
                nodosop = [...nodop];
            }
            nodop.splice(0, nodop.length);
            
            console.log('esto: '+nodosop);
            flag=true;
        }
        sum1[i]=Math.max(...sum2);
        console.log('paso'+Math.max(...sum2));
        for (let i = nodos.length; i >=0; i--) {
            sum2[nodos.length-i]=0;
        }
        
        
    }

    optim=Math.max(...sum1);

    return nodosop;
}


const resultado = algoritmoJohnson(valor,nodos);
const resultadosDiv = document.getElementById("resultados");
resultadosDiv.innerHTML = `<p>Valor optimo obtenido: ${optim} Orden óptimo de ejecución de tareas: ${resultado.join(" -> ")}</p>`;
