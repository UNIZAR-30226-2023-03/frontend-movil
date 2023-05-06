<template>
  <div class="pantalla-menu">
    <div class="tienda">
      <div class="productos" v-if="productos.length > 0">
        <div class="producto" v-for="producto in productos" :key="producto.id">
          <!-- LAS IMAGENES SE TIENEN QUE LLAMAR COMO ESPECIFICA EN LA SIGUIENTE LINEA -->
          <img :src="'../../public/assets/'+productos.tipoProducto+producto.id" /> 
          <h2>{{ producto.nombre }}</h2>
          <p>{{ producto.descripcion }}</p>
          <ionbutton @click="comprarProducto(producto.id)">Comprar</ionbutton>
        </div>
      </div>
      <p v-else>No hay productos disponibles</p>
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
      productos: [],
      monedas: '',
      sinMonedas: false
    }
  },
  methods: {
    cargarProductos() {
      // Aquí iría el código para cargar los productos desde el backend
      axios.get('https://lamesa-backend.azurewebsites.net/tienda/productos')
        .then(response => {
          this.productos = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    comprarProducto(id) {
      this.sinMonedas = false;
      // Aquí iría el código para comprar un producto con el ID especificado
    },
  },
  mounted() {
    this.idUsuario = Cookies.get('sessionId');

    this.cargarProductos();

    axios.get('https://lamesa-backend.azurewebsites.net/usuario/monedas'+this.idUsuario)
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
@import '../theme/prueba.css';
@import '../theme/estilosInicio.css';

.tienda {
  max-height: 80%;
  /* Altura máxima del contenedor */
  overflow-y: scroll;
  /* Hacer que sea scrollable verticalmente */
}

.productos {
  display: flex;
  flex-wrap: wrap;
}

.producto {
  width: 200px;
  margin: 10px;
  border: 1px solid #ccc;
  padding: 10px;
}
</style>
  