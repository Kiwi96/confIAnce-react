import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { restablecerContrasena } from "../services/api";

function RestablecerPassword({ onIngresarClick }) {
  const [params] = useSearchParams();
  const token = params.get("token");
  const email = params.get("email");

  const [password, setPassword] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [error, setError] = useState("");
  const [listo, setListo] = useState(false);
  const [cargando, setCargando] = useState(false);

  const passwordValida =
    password.length >= 10 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    !/(.)\1\1/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!passwordValida) {
      setError("La contraseña no cumple con todos los requisitos.");
      return;
    }
    if (password !== confirmacion) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setCargando(true);
    try {
      await restablecerContrasena({
        token,
        email,
        password,
        password_confirmation: confirmacion,
      });
      setListo(true);
    } catch (err) {
      setError(
        err.errors?.email?.[0] ||
          err.errors?.password?.[0] ||
          "No se pudo cambiar la contraseña."
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="flex items-center justify-center px-4 pt-40 pb-20">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-white shadow-2xl">
        {!token || !email ? (
          <p className="text-red-400 text-center">
            El enlace no es válido. Pide uno nuevo desde "¿Olvidaste tu contraseña?".
          </p>
        ) : listo ? (
          <div className="text-center py-4">
            <div className="text-orange-500 text-4xl mb-4">✅</div>
            <h3 className="text-2xl font-bold mb-2">¡Contraseña actualizada!</h3>
            <p className="text-zinc-400 text-sm mb-6">
              Ya puedes iniciar sesión con tu nueva contraseña.
            </p>
            <button
              onClick={onIngresarClick}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition"
            >
              Iniciar sesión
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-bold mb-2 text-orange-500">Nueva contraseña</h3>
            <p className="text-zinc-400 text-sm mb-6">
              Cuenta: <span className="text-orange-400">{email}</span>
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1 font-semibold">
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition"
                  placeholder="Ingrese su nueva contraseña"
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

              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1 font-semibold">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={confirmacion}
                  onChange={(e) => setConfirmacion(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition"
                  placeholder="Repita la contraseña"
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-medium py-3 rounded-lg transition mt-2 shadow-lg shadow-orange-500/20"
              >
                {cargando ? "Guardando..." : "Cambiar contraseña"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}

export default RestablecerPassword;