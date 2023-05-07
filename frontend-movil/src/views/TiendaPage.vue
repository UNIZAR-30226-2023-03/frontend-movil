<template>
  <div class="background">
    <video autoplay muted loop>
      <source src="../../public/assets/fondoTienda.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
  </div>
  <div id="pantallaTienda" class="pantalla-menu">
    <div id="saldo" class="image-container" style="border-color:rgb(28, 212, 74) ; border-radius: 5%; border: 10px; background-color: rgb(58, 47, 35); z-index: 1;">
            <span id="precio">{{ monedas }}</span>
            <img src="../../public/assets/moneda.png">
          </div>
          <h2></h2>
    <div class="tienda">
      <div class="productos" v-if="productos.length > 0">

        <div v-for="producto in productos" :key="producto.id" class="producto">

          <!-- <div class="producto" v-for="producto in productos" :key="producto.id"> -->
          <!-- LAS IMAGENES SE TIENEN QUE LLAMAR COMO ESPECIFICA EN LA SIGUIENTE LINEA -->
          <div class="image-container">
            <span id="precio">{{ producto.precio }}</span>
            <img src="../../public/assets/moneda.png">
          </div>
          <!-- <img :src="'../../public/assets/'+producto.tipoProducto+producto.id+'.png'" />  -->
          <h2>{{ producto.nombre }}</h2>
          <p>{{ producto.descripcion }}</p>
          <ionbutton @click="comprarProducto(producto.id)">Comprar</ionbutton>

        </div>

      </div>
      <!-- <p v-else>No hay productos disponibles</p> -->
    </div>
  </div>
</template>
  
<script>
import axios from 'axios';
import router from "@/router";
import Cookies from 'js-cookie';

export default {

  data() {
    return {
      idUsuario: '',
      monedas: '45',
      loadedProducts: 0,
      sinMonedas: false,
      productos: [
        {
          "id": 1,
          "nombre": "Tablero de HALLOWEEN",
          "descripcion": "Tablero de ajedrez clásico hecho de madera de alta calidad",
          "precio": 29.99,
          "tipoProducto": "TABLERO"
        },
        {
          "id": 2,
          "nombre": "Fichas de plástico",
          "descripcion": "Set de 32 fichas de ajedrez hechas de plástico resistente",
          "precio": 12.99,
          "tipoProducto": "TABLERO"
        },
        {
          "id": 3,
          "nombre": "Tablero de NAVIDAD",
          "descripcion": "Tablero de ajedrez moderno hecho de cristal templado",
          "precio": 59.99,
          "tipoProducto": "TABLERO"
        },
        {
          "id": 4,
          "nombre": "Fichas de madera",
          "descripcion": "Set de 32 fichas de ajedrez hechas de madera de diferentes tonalidades",
          "precio": 24.99,
          "tipoProducto": "TABLERO"
        }
      ]
    }
  },
  methods: {
    // cargarProductos() {
    //   // Aquí iría el código para cargar los productos desde el backend
    //   axios.get('https://lamesa-backend.azurewebsites.net/tienda')
    //     .then(response => {
    //       this.productos = response.data;
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });
    // },
    comprarProducto(id) {
      this.sinMonedas = false;
      console.log('comprando:' + id);
      // Aquí iría el código para comprar un producto con el ID especificado
    },
  },
  mounted() {
    this.loadedProducts = this.productos.length;
    this.idUsuario = Cookies.get('sessionId');

    // this.cargarProductos();
    // axios.get('https://lamesa-backend.azurewebsites.net/usuario/monedas/'+this.idUsuario)
    //     .then(response => {
    //       this.monedas = response.data;
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });
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



ion-button {
  margin-top: 10px;
  --background: #007bff;
  --color: #fff;
}
</style>
  