import "./GraphClasses/GraphDriver.mjs";

import {downloadFile, uploadFile, graph, findShortestPath} from "./GraphClasses/GraphDriver.mjs";

const criticalPathButton = document.getElementById("criticalPath_btn");
const adjMatrixButton = document.getElementById("adjMatrix_btn");
const dijkstraButton = document.getElementById("dijkstra_btn");
const assignmentButton = document.getElementById("assignment_btn");
const saveButton = document.getElementById("save_btn");
const loadButton = document.getElementById("load_btn");


dijkstraButton.addEventListener("click", e =>{   
  findShortestPath();
});

criticalPathButton.addEventListener("click", e =>{   
graph.findCriticalPath();
});

assignmentButton.addEventListener("click", e =>{   
graph.findAssingment();
});

adjMatrixButton.addEventListener("click", e => {
console.log(matrizita);
});

saveButton.addEventListener("click", e =>{
  downloadFile();
})

loadButton.addEventListener('click', function() {
  uploadFile();
});



/*
let url = 'http://localhost:4000/users';
   let url2 = 'http://localhost:4000/enlaces';
   let esawea = [];
   let esawea2 = [];
   let nodoSel = null;
   let edgeSel = null;
   new Vue({
     el: '#app',
     vuetify: new Vuetify(),
     data() {
       return {
         userss: [],
         dialog: false,
         operacion: '',
         users: {
           id: null,
           nombre: '',
           posicion_x: 0,
           posicion_y: 0
         },
         enlaces: [],
         dialog1: false,
         operacion1: '',
         enlace: {
           id: null,
           nodo_inicio_id: '',
           nodo_fin_id: '',
           valor_numerico: 0
         }
       }
     },
     created() {
       this.mostrar();
       setTimeout(() => {
         this.mostrar2();
       }, 200);
     },
     methods: {
       //MÉTODOS PARA EL CRUD
       mostrar: function () {
         axios.get(url)
           .then(response => {
             
             
             esawea = [];
             this.userss = response.data;

             esawea = [...this.userss];
             console.log('nodos: '+this.userss);
             nodoInicial();
           })


       },
       mostrar2: function () {
         axios.get(url2)
           .then(response => {
             esawea2 = [];
             this.enlaces = response.data;
             esawea2 = [...this.enlaces];
             console.log('enlace: '+this.enlaces);
             edgeInicial();
           })


       },
       crear: function () {
         let parametros = { nombre: this.users.nombre, posicion_x: this.users.posicion_x, posicion_y: this.users.posicion_y };
         axios.post(url, parametros)
           .then(response => {
             console.log(parametros);
           });
         this.users.nombre = "";
         this.users.posicion_x = "";
         this.users.posicion_y = "";
       },
       editar: function () {
         let parametros = { nombre: this.users.nombre, posicion_x: this.users.posicion_x, posicion_y: this.users.posicion_y };
         //console.log(parametros);                   
         axios.put(url + "/" + this.users.id, parametros)
           .then(response => {
             //this.mostrar();
           })
           .catch(error => {
             console.log(error);
           });
       },
       borrar: function (id) {
         nodoSel = selectedNode.id;
         id = nodoSel;
            console.log(id);
         esawea.forEach(elm => {
           if (elm.id == id) {
             axios.delete(url + "/" + id)
               .then(response => {
                 console.log('funciona');
               });
           }
         });

       },
       crear2: function () {
         let parametros1 = { nodo_inicio_id: this.enlace.nodo_inicio_id, nodo_fin_id: this.enlace.nodo_fin_id, valor_numerico: this.enlace.valor_numerico };
         axios.post(url2, parametros1)
           .then(response => {
             console.log(parametros1);
           });
         this.enlace.nodo_inicio_id = "";
         this.enlace.nodo_fin_id = "";
         this.enlace.valor_numerico = "";
       },
       editar2: function () {
         let parametros1 = { nodo_inicio_id: this.enlace.nodo_inicio_id, nodo_fin_id: this.enlace.nodo_fin_id, valor_numerico: this.enlace.valor_numerico };
         //console.log(parametros);                   
         axios.put(url2 + "/" + this.enlace.id, parametros1)
           .then(response => {
             //this.mostrar2();
           })
           .catch(error => {
             console.log(error);
           });
       },
       borrare: function (id) {
         edgeSel = selectedEdge.id;
         id = edgeSel;
         console.log(id);
         esawea2.forEach(elm => {
           if (elm.id == id) {
             axios.delete(url2 + "/" + id)
               .then(response => {
                 console.log('funciona 2');
               });
           }
         });

       },
       borrar2: function () {

         graph.nodes.forEach(nod => {
           console.log('nodo: ' + this.userss);
           this.users.nombre = nod.label;
           this.users.posicion_x = nod.x;
           this.users.posicion_y = nod.y;
           this.operacion = 'crear';
           this.userss.forEach(element => {
             if (nod.id == element.id) {
               this.operacion = 'editar';
               this.users.id = nod.id;
             }
           });
           if (this.operacion == 'crear') {
             this.crear();
           }
           if (this.operacion == 'editar') {
             this.editar();
           }
           this.dialog = false;

         });
         setTimeout(() => {
           //this.mostrar();
           setTimeout(() => {
             //this.mostrar2();
           }, 200);
         }, 200);


       },
       borrar22: function () {
         graph.edges.forEach(edg => {
           console.log('unenlace: ' + this.enlaces);
           console.log('datoenlace: '+this.enlace);
           
           console.log(edg.n0.id);
           this.enlace.nodo_inicio_id = edg.n0.id;
           this.enlace.nodo_fin_id = edg.n1.id;
           this.enlace.valor_numerico = edg.weight;
           this.operacion1 = 'crear';
           this.enlaces.forEach(element => {
             if (edg.id == element.id) {
               this.operacion1 = 'editar';
               this.enlace.id = edg.id;
             }
           });
           if (this.operacion1 == 'crear') {
             this.crear2();
           }
           if (this.operacion1 == 'editar') {
             this.editar2();
           }
           this.dialog1 = false;
         });
         setTimeout(() => {
           //this.mostrar();
           setTimeout(() => {
             //this.mostrar2();
           }, 200);
         }, 200);


       },
       buerra: function () {

         this.borrar();


         /* graph.nodes.forEach(nod => {
           
           this.users.nombre = nod.label;
           this.users.posicion_x = nod.x;
           this.users.posicion_y = nod.y;
           this.operacion='crear';
           if (this.operacion == 'crear') {
             this.crear();
           }
           if (this.operacion == 'editar') {
             this.editar();
           }
           this.dialog = false;
         }); 

       },

       //Botones y formularios
       guardar: function () {
         console.log('enlaces'+this.userss);
         console.log('enlaces'+this.enlaces);
         this.borrar2();
         
         setTimeout(() => {
           this.borrar22(this.enlaces);
         }, 200);




         /* graph.nodes.forEach(nod => {
           
           this.users.nombre = nod.label;
           this.users.posicion_x = nod.x;
           this.users.posicion_y = nod.y;
           this.operacion='crear';
           if (this.operacion == 'crear') {
             this.crear();
           }
           if (this.operacion == 'editar') {
             this.editar();
           }
           this.dialog = false;
         }); 

       },
       formNuevo: function () {
         this.dialog = true;
         this.operacion = 'crear';
         this.users.nombre = '';
         this.users.posicion_x = 0;
         this.users.posicion_y = 0;
       },
       formEditar: function (id, nombre, posicion_x, posicion_y) {

         this.users.id = id;
         this.users.nombre = '';
         this.users.posicion_x = 0;
         this.users.posicion_y = 0;
         this.dialog = true;
         this.operacion = 'editar';
       }
     }
   });


   console.log("!chambea");

  */





