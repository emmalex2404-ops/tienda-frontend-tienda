import axios from 'axios';

const API_PRODUCTOS = 'https://api-productos.hexamx.com.mx';
const API_USUARIOS = 'https://api-usuarios.hexamx.com.mx';
const API_PEDIDOS = 'https://api-pedidos.hexamx.com.mx';

const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

// ==================== PRODUCTOS ====================
export const getProductos = (filtros = {}) =>
  axios.get(`${API_PRODUCTOS}/productos`, { params: filtros });

// ==================== AUTH ====================
export const login = (datos) =>
  axios.post(`${API_USUARIOS}/login`, datos);

export const registro = (datos) =>
  axios.post(`${API_USUARIOS}/registro`, datos);

// ==================== CARRITO ====================
export const getCarrito = () =>
  axios.get(`${API_PEDIDOS}/carrito`, getHeaders());

export const agregarAlCarrito = (product_id, cantidad) =>
  axios.post(`${API_PEDIDOS}/carrito`, { product_id, cantidad }, getHeaders());

export const eliminarDelCarrito = (id) =>
  axios.delete(`${API_PEDIDOS}/carrito/${id}`, getHeaders());

export const actualizarCantidad = (id, cantidad) =>
  axios.patch(`${API_PEDIDOS}/carrito/${id}`, { cantidad }, getHeaders());

// ==================== PEDIDOS ====================
export const crearPedido = (datos) =>
  axios.post(`${API_PEDIDOS}/pedidos`, datos, getHeaders());

export const getMisPedidos = () =>
  axios.get(`${API_PEDIDOS}/pedidos/mis-pedidos`, getHeaders());
