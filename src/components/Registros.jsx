import { useState } from "react";
import { registrar } from "../services/api";

function Registros({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const passwordValida =
      password.length >= 10 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      !/(.)\1\1/.test(password);

    if (!passwordValida) {
      setError("La contraseña no cumple con todos los requisitos.");
      return;
    }

    setCargando(true);
    try {
      const respuesta = await registrar({
        name,
        email,
        password,
        password_confirmation: password,
      });
      setName("");
      setEmail("");
      setPassword("");
      onSuccess(respuesta);
    } catch (err) {
      setError(
        err.errors?.email?.[0] ||
          err.errors?.password?.[0] ||
          err.message ||
          "No se pudo completar el registro."
      );
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

        <h3 className="text-2xl font-bold mb-2 text-orange-500">Regístrate</h3>
        <p className="text-zinc-400 text-sm mb-6">
          Regístrate para acceder a nuestros beneficios.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1 font-semibold">
              Nombre Completo
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition"
              placeholder="Ingrese su nombre completo"
            />
          </div>

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
            <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1 font-semibold">
              Contraseña
            </label>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition"
              placeholder="Ingrese su contraseña"
            />

            <div className="mt-3 text-xs space-y-1">
              <p className={password.length >= 10 ? "text-green-400" : "text-zinc-400"}>
                {password.length >= 10 ? "✓" : "○"} Mínimo 10 caracteres
              </p>
              <p className={/[A-Z]/.test(password) ? "text-green-400" : "text-zinc-400"}>
                {/[A-Z]/.test(password) ? "✓" : "○"} Al menos una letra mayúscula
              </p>
              <p className={/[a-z]/.test(password) ? "text-green-400" : "text-zinc-400"}>
                {/[a-z]/.test(password) ? "✓" : "○"} Al menos una letra minúscula
              </p>
              <p className={/[0-9]/.test(password) ? "text-green-400" : "text-zinc-400"}>
                {/[0-9]/.test(password) ? "✓" : "○"} Al menos un número
              </p>
              <p className={!/(.)\1\1/.test(password) ? "text-green-400" : "text-zinc-400"}>
                {!/(.)\1\1/.test(password) ? "✓" : "○"} No más de 2 caracteres iguales consecutivos
              </p>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-medium py-3 rounded-lg transition mt-2 shadow-lg shadow-orange-500/20"
          >
            {cargando ? "Enviando..." : "Enviar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Registros;