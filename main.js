import {Node, DirectedEdge, UndirectedEdge, Graph} from "./GraphClasses/Graph.mjs"
   
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
         }); */

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
         }); */

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

   var canvas = document.querySelector("canvas");
   var ctx = canvas.getContext("2d");
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;

   window.addEventListener('resize', function () {
     canvas.width = window.innerWidth;
     canvas.height = window.innerHeight;
   })

   let selectedNode = null;
   let isDragging = false;

   let selectedEdge = null;
   let isDrawingEdge = false;
   let isEditing = false;

   var graph = new Graph(ctx);

   var mouse = {
     x: undefined,
     y: undefined,
     dx: undefined,
     dy: undefined
   }

   window.addEventListener("mousemove", (e) => {
     const last_x = mouse.x;
     const last_y = mouse.y;

     mouse.x = e.clientX - canvas.getBoundingClientRect().left;
     mouse.y = e.clientY - canvas.getBoundingClientRect().top;

     mouse.dx = mouse.x - last_x;
     mouse.dy = mouse.y - last_y;

     if (isDragging && selectedNode) {
       selectedNode.x = mouse.x;
       selectedNode.y = mouse.y;
     }
     else if (isDrawingEdge && selectedNode && selectedEdge) {
       selectedEdge.n1.x = mouse.x;
       selectedEdge.n1.y = mouse.y;

       let f = true;
       for(var nodo of graph.nodes){
         if(nodo.isInside(mouse.x, mouse.y)){
             if(nodo == selectedNode){
               selectedEdge.isSelfDirected = true;
               selectedEdge.relativeX = mouse.x - selectedEdge.n0.x;
               selectedEdge.relativeY = mouse.y - selectedEdge.n0.y;
               f = false;
             }
             break;
         }
       }

       if(f){
         selectedEdge.isSelfDirected = false;
       }
     }
   });

   canvas.addEventListener("mousedown", (e) => {

     if (isEditing) {
       if (selectedNode) {
         selectedNode.isSelected = false;
         nodeMenu.style.display = 'none';
       }
       

       if (selectedEdge){
       selectedEdge.isSelected = false;
       edgeMenu.style.display = 'none';
       }
       //selectedNode = null;
       //selectedEdge = null;
       isEditing = false;
     }//boton 0 click izquierdo
 
     else if (e.button == 0) {
       for (const node of graph.nodes) {
         if (node.isInside(mouse.x, mouse.y)) {
           selectedNode = node;
           isDrawingEdge = true;
           selectedEdge = new DirectedEdge(selectedNode, new Node(mouse.x, mouse.y), 0);
           break;
         }
       }

       if (!isDragging && !isDrawingEdge && !isEditing) {
         graph.addNode(mouse.x, mouse.y, 0);
         console.log("Nodo creado ejex", mouse.x, "ejeY", mouse.y);
       }
     }
     else if (e.button == 2) {
       for (var node of graph.nodes) {
         if (node.isInside(mouse.x, mouse.y)) {
           selectedNode = node;
           isDragging = true;
           break;
         }
       }
     }
   });

   canvas.addEventListener("mouseup", (e) => {

     if (isDrawingEdge) {
       for (const node of graph.nodes) {
         if (node.isInside(mouse.x, mouse.y)) {
           if (node != selectedNode) {
             graph.joinNodesWithEdge(selectedNode, node, selectedEdge);
             break;
           }
           else{
             selectedEdge.isSelfDirected = true;
             graph.joinNodesWithEdge(selectedNode, node, selectedEdge);
           }
         }
       }
       selectedNode = null;
       selectedEdge = null;
       isDrawingEdge = false;
     }

     else if (isDragging) {
       selectedNode.dx = mouse.dx;
       selectedNode.dy = mouse.dy;
       isDragging = false;

       selectedEdge = false;
       selectedNode.isSelected = true;
       isEditing = true;

       showNodeMenu(mouse.x + selectedNode.r + 10, mouse.y); //TODO
     }

     else if (!isDragging && !isDrawingEdge && !isEditing) {
       for (const edge of graph.edges) {
         if (edge.isInside(mouse.x, mouse.y)) {

           selectedNode = null;
           selectedEdge = edge;
           selectedEdge.isSelected = true;
           isEditing = true;

           showEdgeMenu(mouse.x, mouse.y); //TODO
           break;
         }
       }
     }
   });


   const nodeMenu = document.getElementById("node_cm");
   const edgeMenu = document.getElementById("edge_cm");

   const nodeNamePicker = document.getElementById("node_name_p");
   const isSourcePicker = document.getElementById("is_source_p");
   const nodeValPicker = document.getElementById("node_val_p");
   const nodeColorPicker = document.getElementById("node_cp");
   const nodeDeleteButton = document.getElementById("node_delete_b");

   const edgeWeightPicker = document.getElementById("edge_weight_p");
   const edgeColorPicker = document.getElementById("edge_cp");
   const edgeDeleteButton = document.getElementById("edge_delete_b");

   window.addEventListener("contextmenu", (e) => {
     e.preventDefault();
   });


   //escuchar cambio nombre
   nodeNamePicker.addEventListener("input", e => {
     selectedNode.label = e.target.value;
   });

   isSourcePicker.addEventListener("change", e => {
    if(isSourcePicker.checked){
        selectedNode.isSource = true;
    }
    else{
        selectedNode.isSource = false;
    }
  });

   nodeValPicker.addEventListener("input", e => {
     selectedNode.val = e.target.value;
   });

   nodeColorPicker.addEventListener("input", e => {
     console.log(e.target.value);
     selectedNode.setFillColor(e.target.value);
   });


   nodeDeleteButton.addEventListener("click", e => {
     nodoSel = selectedNode.id;
     console.log(nodoSel);
     graph.deleteNode(selectedNode);
     nodeMenu.style.display = 'none';
   });



   edgeWeightPicker.addEventListener("input", e => {
     selectedEdge.weight = e.target.value;
   });

   edgeColorPicker.addEventListener("input", e => {
     selectedEdge.setStrokeColor(e.target.value);
   });

   edgeDeleteButton.addEventListener("click", e => {
     graph.deleteEdge(selectedEdge);
     nodeMenu.style.display = 'none';
   });
   function showNodeMenu(x, y) {

     if (x + nodeMenu.offsetWidth > window.innerWidth) {
       x = window.innerWidth - nodeMenu.offsetWidth;
     }
     if (y + edgeMenu.offsetHeight > window.innerHeight) {
       y = window.innerHeight - nodeMenu.offsetHeight;
     }

     nodeMenu.style.left = x;
     nodeMenu.style.top = y;
     nodeMenu.style.display = 'block';
   }

   function showEdgeMenu(x, y) {

     if (x + edgeMenu.offsetWidth > window.innerWidth) {
       x = window.innerWidth - edgeMenu.offsetWidth;
     }
     if (y + edgeMenu.offsetHeight > window.innerHeight) {
       y = window.innerHeight - edgeMenu.offsetHeight;
     }

     edgeMenu.style.left = x;
     edgeMenu.style.top = y;
     edgeMenu.style.display = 'block';

   }

   const criticalPathButton = document.getElementById("criticalPath_btn");
   const adjMatrixButton = document.getElementById("adjMatrix_btn");
   const assignmentButton = document.getElementById("assignment_btn");
   const saveButton = document.getElementById("save_btn");
   const loadButton = document.getElementById("load_btn");

   criticalPathButton.addEventListener("click", e =>{   
    graph.findCriticalPath();
   });

   assignmentButton.addEventListener("click", e =>{   
    graph.findAssingment();
   });

   adjMatrixButton.addEventListener("click", e => {
    console.log(matrizita);
   });

   function getBrightness(rgbColor) {
     // Remove any whitespace and convert the color string to lowercase
     rgbColor = rgbColor.replace(/\s+/g, '').toLowerCase();

     // Check if the color string starts with "rgb(" and ends with ")"
     if (rgbColor.startsWith("#")) {
       rgbColor = rgbColor.substring(1, 7);
       const red = parseInt(rgbColor.substring(0, 2), 16);
       const green = parseInt(rgbColor.substring(2, 4), 16);
       const blue = parseInt(rgbColor.substring(4, 6), 16);

       const brightness = (red + green + blue) / 3;

       return brightness;
     } else {
       // If the input is not a valid RGB color, return null or an error value
       return null;
     }
   }


   function nodoInicial() {
     graph.nodes = [];
     //nodo lista?
     //nodo al canvas
     //console.log("nodo inicial:", nodoini);
     console.log(esawea);

     esawea.forEach(abc => {
       const nodoini = new Node(abc.posicion_x, abc.posicion_y, 0, abc.id);
       nodoini.label = abc.nombre;
       nodoini.setFillColor('black');
       graph.addNodeObject(nodoini);
     });
     console.log(graph.nodes);
     //console.log(graph.nodes);
   }


   function edgeInicial() {
     graph.edges = [];
     //nodo lista?
     //nodo al canvas
     //console.log("nodo inicial:", nodoini);
     console.log(esawea2);



     esawea2.forEach(abc => {
       var nodoinicio = null;
       var nodofin = null;
       graph.nodes.forEach(nodot1 => {
         if (nodot1.id == abc.nodo_inicio_id) {
           nodoinicio = nodot1;
         }
         console.log(nodoinicio);
       });
       graph.nodes.forEach(nodot2 => {
         if (nodot2.id == abc.nodo_fin_id) {
           nodofin = nodot2;
         }
         console.log(nodofin);
       });
       //console.log(this.nodofin);
       //console.log(this.nodoinicio);
       const edgeini = new UndirectedEdge(nodoinicio, nodofin, abc.valor_numerico, abc.id);
       graph.joinNodesWithEdge(nodoinicio, nodofin, edgeini);
     });
     console.log(graph.edges);
     //console.log(graph.nodes);
   }


   function draw() {
     requestAnimationFrame(draw);

     ctx.clearRect(0, 0, canvas.width, canvas.height);
     if (selectedEdge) {
       selectedEdge.updatedDraw(ctx);
     }

     graph.update();
   }

   draw();





