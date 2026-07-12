import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCarrito, eliminarDelCarrito, actualizarCantidad, crearPedido } from "../services/api";

export default function Carrito() {
  const [items, setItems] = useState([]);
  const [direccion, setDireccion] = useState("");
  const [cargando, setCargando] = useState(true);
  const [paso, setPaso] = useState(1); // 1: carrito, 2: checkout
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) { navigate("/login"); return; }
    cargarCarrito();
  }, []);

  const cargarCarrito = async () => {
    try {
      const res = await getCarrito();
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const eliminar = async (id) => {
    await eliminarDelCarrito(id);
    cargarCarrito();
  };

  const cambiarCantidad = async (id, cantidad) => {
    if (cantidad < 1) return;
    await actualizarCantidad(id, cantidad);
    cargarCarrito();
  };

  const total = items.reduce((acc, item) => acc + (item.precio || 0) * item.cantidad, 0);

  const confirmarPedido = async () => {
    if (!direccion) { alert("Ingresa tu dirección de envío"); return; }
    try {
      const pedidoData = {
        direccion_envio: direccion,
        total: total || 0,
        items: items.map(i => ({
          product_id: i.product_id,
          nombre_producto: i.nombre || "Producto",
          precio: i.precio || 0,
          cantidad: i.cantidad
        }))
      };
      await crearPedido(pedidoData);
      alert("✅ Pedido creado exitosamente");
      navigate("/mis-pedidos");
    } catch (err) {
      alert("❌ Error al crear el pedido");
    }
  };

  if (cargando) return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-gray-500 text-lg">Cargando carrito...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Mi Carrito</h1>
        <button onClick={() => navigate("/")} className="text-sm underline">← Seguir comprando</button>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">

        {/* PASO 1: CARRITO */}
        {paso === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-6">Productos en tu carrito</h2>

            {items.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center shadow">
                <p className="text-gray-500">Tu carrito está vacío.</p>
                <button onClick={() => navigate("/")}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  Ver catálogo
                </button>
              </div>
            ) : (
              <>
                {items.map(item => (
                  <div key={item.id} className="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">Producto #{item.product_id}</p>
                      <p className="text-gray-500 text-sm">Cantidad: {item.cantidad}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                        className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">−</button>
                      <span className="font-bold">{item.cantidad}</span>
                      <button onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
                        className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">+</button>
                      <button onClick={() => eliminar(item.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">🗑️</button>
                    </div>
                  </div>
                ))}

                <div className="bg-white rounded-lg shadow p-4 mt-4 flex justify-between items-center">
                  <p className="text-xl font-bold">Total: <span className="text-green-600">${total.toFixed(2)}</span></p>
                  <button onClick={() => setPaso(2)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold">
                    Continuar al checkout →
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* PASO 2: CHECKOUT */}
        {paso === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-6">Confirmar pedido</h2>

            <div className="bg-white rounded-lg shadow p-6 mb-4">
              <h3 className="font-semibold text-lg mb-4">Resumen del pedido</h3>
              {items.map(item => (
                <div key={item.id} className="flex justify-between py-2 border-b">
                  <span>Producto #{item.product_id} x{item.cantidad}</span>
                </div>
              ))}
              <p className="text-xl font-bold mt-4">Total: <span className="text-green-600">${total.toFixed(2)}</span></p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-4">
              <h3 className="font-semibold text-lg mb-4">Dirección de envío</h3>
              <textarea
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Ingresa tu dirección completa..."
                value={direccion}
                onChange={e => setDireccion(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <button onClick={() => setPaso(1)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600">
                ← Regresar
              </button>
              <button onClick={confirmarPedido}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold flex-1">
                ✅ Confirmar pedido
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
