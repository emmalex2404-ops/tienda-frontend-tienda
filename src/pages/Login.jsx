import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/api";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!correo || !password) { setError("Todos los campos son requeridos"); return; }
    setCargando(true);
    setError("");
    try {
      const res = await login({ correo, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("usuario", JSON.stringify(res.data.usuario));
      navigate("/");
    } catch (err) {
      setError("Correo o contraseña incorrectos");
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Tienda Online</h1>
        <p className="text-center text-gray-500 mb-6">Iniciar sesión</p>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Correo</label>
          <input type="email" placeholder="correo@ejemplo.com"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={correo} onChange={e => setCorreo(e.target.value)} />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">Contraseña</label>
          <input type="password" placeholder="********"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password} onChange={e => setPassword(e.target.value)} />
        </div>

        <button onClick={handleLogin} disabled={cargando}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50">
          {cargando ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>

        <p className="text-center mt-4 text-sm">
          ¿No tienes cuenta? <Link to="/registro" className="text-blue-600 hover:underline">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}
