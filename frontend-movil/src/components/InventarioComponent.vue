<script>
import axios from 'axios';
import Cookies from 'js-cookie';
import { IonButton } from '@ionic/vue';
export default {
  components:{
    IonButton
  },
  props: {
    show: Boolean
  },
  data() {
    return {
      tabSelected: "amigos",
      IdUsuario: '',
      productos: [],
      fichaActiva: '',
      tableroActivo: ''
    }
  },
  methods: {
    cargarProductos() {
      console.log('cargando skins ');

      //peticion a azzure backend thisProductos = response.data
       axios.get('https://lamesa-backend.azurewebsites.net/usuario/productos/'+this.IdUsuario)
         .then(response => {
           this.productos = response.data;
         })
         .catch(error => {
           console.log(error);
         });
    },
    verSkinsActivas() {
      console.log('cargando skins activas edel user : ',this.IdUsuario );
       axios.get('https://lamesa-backend.azurewebsites.net/usuario/tablero-activo/'+this.IdUsuario)
         .then(response => {
           console.log('TableroAvtivo= ',response.data.id);
           this.tableroActivo = response.data.id;
         })
         .catch(error => {
           console.log(error); 
         });

       axios.get('https://lamesa-backend.azurewebsites.net/usuario/ficha-activa/'+this.IdUsuario)
         .then(response => {
           console.log('FichaAvtivo= ',response.data.id);
           this.fichaActiva = response.data.id;
         })
         .catch(error => {
           console.log(error);
         });
      this.tableroActivo = Cookies.get('tableroActivo');
      this.fichaActiva = Cookies.get('fichaActiva')
    },

    callParentMethodImage() {
      this.$parent.changeImageSrc();
    },
    activarProducto(productoId, tipo) {

       axios.post('https://lamesa-backend.azurewebsites.net/usuario/activar',{
         usuario: this.IdUsuario,
         producto: productoId
       })
         .then(response => {
          console.log('Skin activation: ',response);
           
           if (response.status == 200) {
             if (tipo == "TABLERO") {
               this.tableroActivo = productoId;
               Cookies.set('tableroActivo', this.tableroActivo);
             }else{
               this.fichaActiva = productoId;
               Cookies.set('fichaActiva', this.fichaActiva);
             }
             this.callParentMethodImage();
           }

         })
         .catch(error => {
           console.log(error);
         });

      // if (tipo == "TABLERO") { //paara probar mientras no va el backend
      //   this.tableroActivo = productoId;
      //   console.log('tablero activado');
      //   Cookies.set('tableroActivo', this.tableroActivo);
      // } else {
      //   this.fichaActiva = productoId;
      //   console.log('ficha activada');
      //   Cookies.set('fichaActiva', this.fichaActiva);
      // }
      


    }
  },
  beforeMount() {
    const sessionId = Cookies.get('sessionId');
    console.log('sessionId: ', sessionId);
    this.IdUsuario = sessionId;
    //ver que tablero tiene activo el user para cambiar el tablero activo
    this.verSkinsActivas();
  },

  mounted() {
    

    // cargar los productos que tiene el user
    this.cargarProductos();




  }
}
</script>

<style>
.modal-container {

  justify-content: space-between;
  align-items: center;
  position: relative;
  /* make the container position relative */
}

.close-icon-img {
  width: 16px;
  height: 16px;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>

<template>
  <Transition name="notificaciones">
    <div v-if="show" class="modal-mask">
      <div class="modal-container">

        <a class="close-icon-img" @click="$emit('close')">
          <img src="../../public/assets/close.png" alt="cerrar popup">
        </a>

        <div class="productos" v-if="productos.length > 0">

          <div v-for="producto in productos" :key="producto.id" class="producto"
            :class="{ 'producto-seleccionado': producto.id == tableroActivo || producto.id == fichaActiva }">

            <!-- <div class="producto" v-for="producto in productos" :key="producto.id"> -->
            <!-- LAS IMAGENES SE TIENEN QUE LLAMAR COMO ESPECIFICA EN LA SIGUIENTE LINEA -->

            <!-- <img :src="'../../public/assets/'+producto.tipoProducto+producto.id+'.png'" />  -->
            <h2>{{ producto.nombre }}</h2>
            <!-- <p>{{ producto.descripcion }}</p> -->
            <ion-button id="ion-buttonInv" v-if="!(producto.id == tableroActivo || producto.id == fichaActiva)"
              @click="activarProducto(producto.id, producto.tipoProducto)">Activar</ion-button>

          </div>

        </div>

      </div>
    </div>
  </Transition>
</template>


<style>
.customTab {
  height: 80%;
  width: 100%;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.33);
  display: flex;
  transition: opacity 0.3s ease;
}

.modal-container {
  width: 300px;
  margin: auto;
  padding: 20px 30px;
  border: 5px solid rgb(34, 34, 34);
  border-radius: 13px;

  background-color: rgb(69, 69, 69);
  ;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.tienda {
  max-height: 90%;
  overflow-y: scroll;
}

.productos {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  height: 100%;
}

.producto {
  width: 200px;
  height: 180px;
  margin: 10px;
  border: 3px solid rgb(172, 119, 20);
  padding: 10px;
  border-radius: 10%;
  background-color: #007bff;
  text-align: center;
  z-index: 1;
  position: relative;
  /* Set the background image */
  background-image: url("../../public/assets/TABLERO1.png");
  /* Set the background size */
  background-size: cover;
  /* Set the background position */
  background-position: center center;
  /* Set the background repeat */
  background-repeat: no-repeat;
}

.producto::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 10%;
}

.producto-seleccionado {
  width: 200px;
  margin: 10px;
  box-shadow: 0px 3px 10px rgba(55, 228, 21, 0.563);
  border: 3px solid rgb(22, 215, 58);
  padding: 10px;
  border-radius: 10%;
  background-color: #007bff;
  text-align: center;
  z-index: 1;
  position: relative;
  /* Set the background image */
  background-image: url("../../public/assets/TABLERO1.png");
  /* Set the background size */
  background-size: cover;
  /* Set the background position */
  background-position: center center;
  /* Set the background repeat */
  background-repeat: no-repeat;
}


.image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 150px;
  margin: 0 auto;
}

#precio {
  font-size: 20px;
  font-weight: bold;
  color: white;
  margin-right: 10px;


}

#pantallaTienda {
  opacity: 1;
}

.image-container img {
  max-width: 20%;
  height: auto;
  display: inline-block;
  vertical-align: middle;
}

.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  opacity: 20%;
}

video {
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}



#ion-buttonInv {
  margin-top: 10px;
  --background: #457341;
  --color: #fff;
}
</style>