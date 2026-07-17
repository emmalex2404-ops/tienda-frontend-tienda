import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registro } from "../services/api";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleRegistro = async () => {
    if (!nombre || !correo || !password) {
      setError("Todos los campos son requeridos");
      return;
    }
    setCargando(true);
    setError("");
    try {
      await registro({ nombre, correo, password });
      alert("✅ Cuenta creada correctamente. Inicia sesión.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Error al registrar usuario");
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Tienda Online</h1>
        <p className="text-center text-gray-500 mb-6">Crear cuenta</p>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Nombre</label>
          <input type="text" placeholder="Tu nombre"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={nombre} onChange={e => setNombre(e.target.value)} />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Correo</label>
          <input type="email" placeholder="correo@ejemplo.com"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={correo} onChange={e => setCorreo(e.target.value)} />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">Contraseña</label>
          <input type="password" placeholder="********"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={password} onChange={e => setPassword(e.target.value)} />
        </div>

        <button onClick={handleRegistro} disabled={cargando}
          className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50">
          {cargando ? "Creando cuenta..." : "Crear cuenta"}
        </button>

        <p className="text-center mt-4 text-sm">
          ¿Ya tienes cuenta? <Link to="/login" className="text-blue-600 hover:underline">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
}
