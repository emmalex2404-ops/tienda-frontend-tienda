import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProductos, agregarAlCarrito } from "../services/api";

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const token = localStorage.getItem("token");

  useEffect(() => { cargarProductos(); }, []);

  const cargarProductos = async (filtros = {}) => {
    setCargando(true);
    try {
      const res = await getProductos(filtros);
      setProductos(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const buscar = () => cargarProductos(busqueda ? { nombre: busqueda } : {});

  const agregar = async (product_id) => {
    if (!token) { alert("Debes iniciar sesión para agregar al carrito"); navigate("/login"); return; }
    try {
      await agregarAlCarrito(product_id, 1);
      alert("✅ Producto agregado al carrito");
    } catch (err) {
      alert("❌ Error al agregar al carrito");
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Tienda Online</h1>
        <div className="flex items-center gap-4">
          {usuario ? (
            <>
              <span className="text-sm">Hola, {usuario.nombre}</span>
              <button onClick={() => navigate("/carrito")}
                className="bg-blue-600 px-4 py-1 rounded-lg text-sm hover:bg-blue-700">
                Carrito
              </button>
              <button onClick={() => navigate("/mis-pedidos")}
                className="bg-gray-600 px-4 py-1 rounded-lg text-sm hover:bg-gray-700">
                Mis pedidos
              </button>
              <button onClick={cerrarSesion}
                className="bg-red-600 px-4 py-1 rounded-lg text-sm hover:bg-red-700">
                Salir
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/login")}
                className="bg-blue-600 px-4 py-1 rounded-lg text-sm hover:bg-blue-700">
                Iniciar sesión
              </button>
              <button onClick={() => navigate("/registro")}
                className="bg-green-600 px-4 py-1 rounded-lg text-sm hover:bg-green-700">
                Registrarse
              </button>
            </>
          )}
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* BUSCADOR */}
        <div className="flex gap-3 mb-8">
          <input type="text" placeholder="Buscar producto..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={busqueda} onChange={e => setBusqueda(e.target.value)}
            onKeyDown={e => e.key === "Enter" && buscar()} />
          <button onClick={buscar}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Buscar
          </button>
          <button onClick={() => { setBusqueda(""); cargarProductos(); }}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">
            Limpiar
          </button>
        </div>

        {/* PRODUCTOS */}
        {cargando ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Cargando productos...</p>
          </div>
        ) : productos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron productos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productos.map(p => (
              <div key={p.id} className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-5">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {p.categoria || "Sin categoría"}
                </span>
                <h3 className="font-bold text-lg mt-3">{p.nombre}</h3>
                <p className="text-gray-500 text-sm mt-1">{p.descripcion}</p>
                <p className="text-green-600 font-bold text-xl mt-3">${p.precio}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${p.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {p.stock > 0 ? `Stock: ${p.stock}` : "Agotado"}
                </span>
                <button onClick={() => agregar(p.id)} disabled={p.stock === 0}
                  className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold">
                  🛒 Agregar al carrito
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
