import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ingresar } from "../services/api";

function Login({ isOpen, onClose, onSuccess, onForgotPasswordClick }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    setCargando(true);
    try {
      const respuesta = await ingresar({ email, password });
      setEmail("");
      setPassword("");
      onSuccess(respuesta); // App guarda el token y cierra el modal
      navigate(location.state?.desde ?? "/dashboard", { replace: true });
    } catch (err) {
      setError(err.errors?.email?.[0] || "No se pudo iniciar sesión.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-white shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white text-xl transition"
        >
          ✕
        </button>

        <h3 className="text-2xl font-bold mb-2 text-orange-500">Iniciar Sesión</h3>
        <p className="text-zinc-400 text-sm mb-6">
          Ingresa tus credenciales para acceder a tu cuenta.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1 font-semibold">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition"
              placeholder="xxxx@empresa.com"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                Contraseña
              </label>
              <button
                type="button"
                onClick={onForgotPasswordClick}
                className="text-xs text-orange-400 hover:underline cursor-pointer"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition"
              placeholder="Ingrese su contraseña"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-medium py-3 rounded-lg transition mt-4 shadow-lg shadow-orange-500/20"
          >
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;