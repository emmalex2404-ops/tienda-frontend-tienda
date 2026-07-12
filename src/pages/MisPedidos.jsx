import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMisPedidos } from "../services/api";

const badgeColor = (estatus) => {
  const colores = {
    'pendiente': 'bg-yellow-100 text-yellow-800',
    'pagado': 'bg-blue-100 text-blue-800',
    'en preparacion': 'bg-purple-100 text-purple-800',
    'enviado': 'bg-cyan-100 text-cyan-800',
    'entregado': 'bg-green-100 text-green-800',
    'cancelado': 'bg-red-100 text-red-800',
  };
  return colores[estatus] || 'bg-gray-100 text-gray-800';
};

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) { navigate("/login"); return; }
    getMisPedidos()
      .then(res => setPedidos(res.data))
      .catch(err => console.error(err))
      .finally(() => setCargando(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Mis Pedidos</h1>
        <button onClick={() => navigate("/")} className="text-sm underline">← Volver al catálogo</button>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h2 className="text-2xl font-bold mb-6">Historial de pedidos</h2>

        {cargando && <p className="text-gray-500">Cargando pedidos...</p>}

        {!cargando && pedidos.length === 0 && (
          <div className="bg-white rounded-lg p-8 text-center shadow">
            <p className="text-gray-500">No tienes pedidos aún.</p>
            <button onClick={() => navigate("/")}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Ver catálogo
            </button>
          </div>
        )}

        {pedidos.map(pedido => (
          <div key={pedido.id} className="bg-white rounded-lg shadow p-6 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-lg">Pedido #{pedido.id}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badgeColor(pedido.estatus)}`}>
                {pedido.estatus}
              </span>
            </div>
            <p className="text-gray-600"><b>Total:</b> ${pedido.total}</p>
            <p className="text-gray-600"><b>Dirección:</b> {pedido.direccion_envio}</p>
            <p className="text-gray-600"><b>Fecha:</b> {new Date(pedido.created_at).toLocaleDateString('es-MX')}</p>
            {pedido.numero_guia && (
              <p className="text-gray-600"><b>Número de guía:</b> {pedido.numero_guia}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
