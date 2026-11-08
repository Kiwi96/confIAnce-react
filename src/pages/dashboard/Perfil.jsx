import { useState } from "react";
import { actualizarPerfil, cambiarPassword } from "../../services/api";

const claseInput =
  "w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition";
const claseLabel =
  "block text-xs uppercase tracking-wider text-zinc-400 mb-1 font-semibold";

function Perfil({ user, onUserUpdate }) {
  // Datos personales
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [errorDatos, setErrorDatos] = useState("");
  const [okDatos, setOkDatos] = useState("");
  const [guardandoDatos, setGuardandoDatos] = useState(false);

  // Contraseña
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [errorPass, setErrorPass] = useState("");
  const [okPass, setOkPass] = useState("");
  const [guardandoPass, setGuardandoPass] = useState(false);

  const passwordValida =
    nueva.length >= 10 &&
    /[A-Z]/.test(nueva) &&
    /[a-z]/.test(nueva) &&
    /[0-9]/.test(nueva) &&
    !/(.)\1\1/.test(nueva);

  const guardarDatos = async (e) => {
    e.preventDefault();
    setErrorDatos("");
    setOkDatos("");
    setGuardandoDatos(true);
    try {
      const actualizado = await actualizarPerfil({ name, email });
      onUserUpdate(actualizado);
      setOkDatos("Datos actualizados correctamente.");
    } catch (err) {
      const mensajes = err.errors ? Object.values(err.errors).flat().join(" ") : "";
      setErrorDatos(mensajes || "No se pudieron guardar los datos.");
    } finally {
      setGuardandoDatos(false);
    }
  };

  const guardarPassword = async (e) => {
    e.preventDefault();
    setErrorPass("");
    setOkPass("");

    if (!passwordValida) {
      setErrorPass("La nueva contraseña no cumple con todos los requisitos.");
      return;
    }
    if (nueva !== confirmacion) {
      setErrorPass("Las contraseñas no coinciden.");
      return;
    }

    setGuardandoPass(true);
    try {
      await cambiarPassword({
        password_actual: actual,
        password: nueva,
        password_confirmation: confirmacion,
      });
      setActual("");
      setNueva("");
      setConfirmacion("");
      setOkPass("Contraseña actualizada correctamente.");
    } catch (err) {
      const mensajes = err.errors ? Object.values(err.errors).flat().join(" ") : "";
      setErrorPass(mensajes || "No se pudo cambiar la contraseña.");
    } finally {
      setGuardandoPass(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1">Mi perfil</h1>
      <p className="text-zinc-400 mb-8">Actualiza tus datos y tu contraseña.</p>

      <div className="grid lg:grid-cols-2 gap-6 max-w-5xl">
        {/* DATOS PERSONALES */}
        <form
          onSubmit={guardarDatos}
          className="bg-zinc-950 border border-zinc-800 rounded-2xl p-7 flex flex-col gap-4"
        >
          <h2 className="text-xl font-semibold text-orange-500">Datos personales</h2>

          <div>
            <label className={claseLabel}>Nombre</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={claseInput}
            />
          </div>

          <div>
            <label className={claseLabel}>Correo electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={claseInput}
            />
          </div>

          {errorDatos && <p className="text-red-400 text-sm">{errorDatos}</p>}
          {okDatos && <p className="text-green-400 text-sm">{okDatos}</p>}

          <button
            type="submit"
            disabled={guardandoDatos}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 font-medium py-3 rounded-lg transition cursor-pointer"
          >
            {guardandoDatos ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>

        {/* CONTRASEÑA */}
        <form
          onSubmit={guardarPassword}
          className="bg-zinc-950 border border-zinc-800 rounded-2xl p-7 flex flex-col gap-4"
        >
          <h2 className="text-xl font-semibold text-orange-500">Cambiar contraseña</h2>

          <div>
            <label className={claseLabel}>Contraseña actual</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={actual}
              onChange={(e) => setActual(e.target.value)}
              className={claseInput}
            />
          </div>

          <div>
            <label className={claseLabel}>Nueva contraseña</label>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={nueva}
              onChange={(e) => setNueva(e.target.value)}
              className={claseInput}
            />
            <div className="mt-3 text-xs space-y-1">
              <p className={nueva.length >= 10 ? "text-green-400" : "text-zinc-400"}>
                {nueva.length >= 10 ? "✓" : "○"} Mínimo 10 caracteres
              </p>
              <p className={/[A-Z]/.test(nueva) ? "text-green-400" : "text-zinc-400"}>
                {/[A-Z]/.test(nueva) ? "✓" : "○"} Al menos una letra mayúscula
              </p>
              <p className={/[a-z]/.test(nueva) ? "text-green-400" : "text-zinc-400"}>
                {/[a-z]/.test(nueva) ? "✓" : "○"} Al menos una letra minúscula
              </p>
              <p className={/[0-9]/.test(nueva) ? "text-green-400" : "text-zinc-400"}>
                {/[0-9]/.test(nueva) ? "✓" : "○"} Al menos un número
              </p>
              <p className={!/(.)\1\1/.test(nueva) ? "text-green-400" : "text-zinc-400"}>
                {!/(.)\1\1/.test(nueva) ? "✓" : "○"} No más de 2 caracteres iguales consecutivos
              </p>
            </div>
          </div>

          <div>
            <label className={claseLabel}>Confirmar nueva contraseña</label>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={confirmacion}
              onChange={(e) => setConfirmacion(e.target.value)}
              className={claseInput}
            />
          </div>

          {errorPass && <p className="text-red-400 text-sm">{errorPass}</p>}
          {okPass && <p className="text-green-400 text-sm">{okPass}</p>}

          <button
            type="submit"
            disabled={guardandoPass}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 font-medium py-3 rounded-lg transition cursor-pointer"
          >
            {guardandoPass ? "Guardando..." : "Cambiar contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Perfil;