import { useState } from "react";
import {
  crearCliente,
  actualizarCliente,
  subirLogoCliente,
  urlStorage,
} from "../services/api";

function ModalCliente({ cliente, servicios, onClose, onGuardado }) {
  const editando = !!cliente;

  const [nombre, setNombre] = useState(cliente?.nombre ?? "");
  const [sector, setSector] = useState(cliente?.sector ?? "");
  const [pais, setPais] = useState(cliente?.pais ?? "");
  const [email, setEmail] = useState(cliente?.email ?? "");
  const [telefono, setTelefono] = useState(cliente?.telefono ?? "");
  const [servicioId, setServicioId] = useState(cliente?.servicio_id ?? "");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [archivo, setArchivo] = useState(null);
  const [idGuardado, setIdGuardado] = useState(cliente?.id ?? null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    const datos = {
      nombre,
      sector,
      pais,
      email,
      telefono: telefono || null,
      servicio_id: servicioId === "" ? null : Number(servicioId),
    };

    try {
      let guardado;
      if (idGuardado) {
        guardado = await actualizarCliente(idGuardado, datos);
      } else {
        guardado = await crearCliente(datos);
        setIdGuardado(guardado.id);
      }

      if (archivo) {
        await subirLogoCliente(guardado.id, archivo);
      }
      onGuardado();
    } catch (err) {
      const mensajes = err.errors ? Object.values(err.errors).flat().join(" ") : "";
      setError(mensajes || err.message || "No se pudo guardar el cliente.");
    } finally {
      setCargando(false);
    }
  };

  const claseInput =
    "w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition";
  const claseLabel =
    "block text-xs uppercase tracking-wider text-zinc-400 mb-1 font-semibold";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-white shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white text-xl transition cursor-pointer"
        >
          ✕
        </button>

        <h3 className="text-2xl font-bold mb-6 text-orange-500">
          {editando ? "Editar cliente" : "Nuevo cliente"}
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={claseLabel}>Nombre o razón social</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={claseInput}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={claseLabel}>Sector</label>
              <input
                type="text"
                required
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className={claseInput}
                placeholder="Salud, fintech..."
              />
            </div>
            <div>
              <label className={claseLabel}>País</label>
              <input
                type="text"
                required
                value={pais}
                onChange={(e) => setPais(e.target.value)}
                className={claseInput}
                placeholder="Colombia"
              />
            </div>
          </div>

          <div>
            <label className={claseLabel}>Correo</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={claseInput}
            />
          </div>

          <div>
            <label className={claseLabel}>Teléfono (opcional)</label>
            <input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className={claseInput}
            />
          </div>

          <div>
            <label className={claseLabel}>Servicio contratado</label>
            <select
              value={servicioId}
              onChange={(e) => setServicioId(e.target.value)}
              className={claseInput}
            >
              <option value="">Sin servicio asignado</option>
              {servicios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={claseLabel}>Logo (opcional)</label>
            <div className="flex items-center gap-4">
              {cliente?.logo && !archivo && (
                <img
                  src={urlStorage(cliente.logo)}
                  alt="Logo actual"
                  className="w-14 h-14 rounded-lg object-contain bg-zinc-950 border border-zinc-800"
                />
              )}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => setArchivo(e.target.files[0] ?? null)}
                className="text-sm text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-4 file:py-2 file:text-white hover:file:bg-zinc-700 file:cursor-pointer"
              />
            </div>
            <p className="text-xs text-zinc-500 mt-1">JPG, PNG o WEBP, máximo 2 MB.</p>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-3 rounded-lg transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando}
              className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 font-medium py-3 rounded-lg transition cursor-pointer"
            >
              {cargando ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalCliente;