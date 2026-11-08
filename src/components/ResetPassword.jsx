import { useState } from "react";
import { olvideContrasena } from "../services/api";

function ResetPassword({ isOpen, onClose, onBackToLogin }) {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Por favor, ingresa tu correo electrónico.");
      return;
    }

    setCargando(true);
    try {
      await olvideContrasena(email);
      setIsSent(true);
    } catch (err) {
      setError(err.errors?.email?.[0] || "No se pudo enviar el correo. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  const handleClose = () => {
    setIsSent(false);
    setEmail("");
    setError("");
    onClose();
  };

  const handleBack = () => {
    setIsSent(false);
    setEmail("");
    setError("");
    onBackToLogin();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-white shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white text-xl transition"
        >
          ✕
        </button>

        {!isSent ? (
          <>
            <h3 className="text-2xl font-bold mb-2 text-orange-500">Recuperar Contraseña</h3>
            <p className="text-zinc-400 text-sm mb-6">
              Introduce tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
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

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-medium py-3 rounded-lg transition mt-2 shadow-lg shadow-orange-500/20"
              >
                {cargando ? "Enviando..." : "Enviar instrucciones"}
              </button>

              <button
                type="button"
                onClick={handleBack}
                className="text-sm text-zinc-400 hover:text-orange-400 transition underline mt-2 text-center"
              >
                Volver a Iniciar Sesión
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="text-orange-500 text-4xl mb-4">✉️</div>
            <h3 className="text-2xl font-bold mb-2 text-white">¡Revisa tu correo!</h3>
            <p className="text-zinc-400 text-sm mb-6">
              Si <span className="text-orange-400 font-medium">{email}</span> está registrado, te enviamos un enlace de recuperación.
            </p>

            <button
              onClick={handleBack}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 rounded-lg transition"
            >
              Regresar al Inicio de Sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;