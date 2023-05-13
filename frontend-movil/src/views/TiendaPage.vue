<template>
  <div class="background">
    <video autoplay muted loop>
      <source src="../../public/assets/fondoTienda.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
  </div>
  <div id="pantallaTienda" class="pantalla-menu">
    <div id="saldo" class="image-container"
      style="border-color:rgb(28, 212, 74) ; border-radius: 5%; border: 10px; background-color: rgb(58, 47, 35); z-index: 1;">
      <span id="precio">{{ monedas }}</span>
      <img src="../../public/assets/moneda.png">
    </div>
    <h2></h2>
    <div class="tienda">
      <div class="productos" v-if="productos.length > 0">

        <div v-for="producto in  productos " :key="producto.id" :ref="`${producto.tipoProducto}${producto.id}`"
          class="producto" :class="{ 'producto-comprado': productosComprados.some((p) => p.id === producto.id) }">

          <!-- <div class="producto" v-for="producto in productos" :key="producto.id"> -->
          <!-- LAS IMAGENES SE TIENEN QUE LLAMAR COMO ESPECIFICA EN LA SIGUIENTE LINEA -->
          <div class="image-container">
            <span id="precio">{{ producto.precio }}</span>
            <img src="../../public/assets/moneda.png">
          </div>
          <!-- <img :src="'../../public/assets/'+producto.tipoProducto+producto.id+'.png'" />  -->
          <h2>{{ producto.nombre }}</h2>
          <!-- <p>{{ producto.descripcion }}</p> -->
          <ion-button v-if="!productosComprados.some((p) => p.id === producto.id)" id="ion-buttonInv2"
            @click="comprarProducto(producto.id)">Comprar</ion-button>

        </div>

      </div>
      <!-- <p v-else>No hay productos disponibles</p> -->
    </div>
  </div>
</template>
  
<script>
import { IonButton } from '@ionic/vue'
import axios from 'axios';
import router from "@/router";
import Cookies from 'js-cookie';

export default {
  components: {
    IonButton
  },
  data() {
    return {
      idUsuario: '',
      monedas: '',
      loadedProducts: 0,
      sinMonedas: false,
      productos: [],
      productosComprados: []
    }
  },
  methods: {
    changeBackgroundImage() {
      console.log('changeBackgroundImage(): ', this.productos);
      this.productos.forEach((producto) => {
        console.log('changeBackgroundImage() en foreach');
        const refName = `${producto.tipoProducto}${producto.id}`;
        console.log('refname = ', refName);
        const productoDiv = this.$refs[refName][0];
        productoDiv.style.backgroundImage = `url(../../public/assets/${producto.tipoProducto}${producto.id}.png)`;
      });
    }
    ,
    cargarProductosComprados() {

      axios.get('https://lamesa-backend.azurewebsites.net/usuario/productos/' + this.idUsuario)
        .then(response => {
          console.log('PRODUCTOS DE LA TIENDA: ', response.data);
          this.productosComprados = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    cargarProductos() {
      // Aquí  el código para cargar los productos desde el backend
      axios.get('https://lamesa-backend.azurewebsites.net/tienda')
        .then(response => {
          console.log('PRODUCTOS DE LA TIENDA: ', response.data);
          this.productos = response.data;
          console.log('cargarProductos(): ', this.productos);
        })
        .catch(error => {
          console.log(error);
        });
    },
    comprarProducto(id) {
      this.sinMonedas = false;
      console.log('comprando:' + id);
      // Aquí iría el código para comprar un producto con el ID especificado

      //ACTIVAR SKIN DE COMPRADO SI LA COMPRA TIENE EXITO

      axios.post('https://lamesa-backend.azurewebsites.net/tienda/comprar', {
        usuario: this.IdUsuario,
        producto: id
      })
        .then((response) => {
          const success = response.status === 200;
          console.log(response.data)
          if (success) {
            this.cargarProductosComprados(); 
          }
        })
        .catch((error) => {
          console.log(error);
        })
    },
  },
  beforeMount() {

    this.idUsuario = Cookies.get('sessionId');
    this.cargarProductosComprados();
  },
  mounted() {
    this.loadedProducts = this.productos.length;


    this.cargarProductos();
    this.changeBackgroundImage();
    axios.get('https://lamesa-backend.azurewebsites.net/usuario/monedas/' + this.idUsuario)
      .then(response => {
        this.monedas = response.data;
      })
      .catch(error => {
        console.log(error);
      });
  },
}
</script>

<style>
@import '../theme/estilos.css';
@import '../theme/estilosInicio.css';




.tienda {
  max-height: 90%;
  overflow-y: scroll;
}

.productos {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.producto {
  width: 200px;
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


.producto-comprado::before {
  content: "COMPRADO";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  background-color: rgba(28, 24, 24, 0.809);
  border-radius: 10%;
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



#ion-buttonInv2 {
  margin-top: 10px;
  --background: #457341;
  --color: #fff;
}
</style>
  