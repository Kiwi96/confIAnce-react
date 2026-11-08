import { useState } from "react";
import {
  crearServicio,
  actualizarServicio,
  subirImagenServicio,
  urlStorage,
} from "../services/api";

function ModalServicio({ servicio, categorias, onClose, onGuardado }) {
  const editando = !!servicio;

  const [nombre, setNombre] = useState(servicio?.nombre ?? "");
  const [categoria, setCategoria] = useState(servicio?.categoria ?? "");
  const [descripcion, setDescripcion] = useState(servicio?.descripcion ?? "");
  const [precio, setPrecio] = useState(servicio ? Number(servicio.precio_base) : "");
  const [activo, setActivo] = useState(servicio?.activo ?? true);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
    const [archivo, setArchivo] = useState(null);
  const [idGuardado, setIdGuardado] = useState(servicio?.id ?? null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    const datos = {
      nombre,
      categoria,
      descripcion,
      precio_base: Number(precio),
      activo,
    };

    try {
            let guardado;
      if (idGuardado) {
        guardado = await actualizarServicio(idGuardado, datos);
      } else {
        guardado = await crearServicio(datos);
        setIdGuardado(guardado.id);
      }

      if (archivo) {
        await subirImagenServicio(guardado.id, archivo);
      }
      onGuardado();
    } catch (err) {
      const mensajes = err.errors ? Object.values(err.errors).flat().join(" ") : "";
      setError(mensajes || err.message || "No se pudo guardar el servicio.");
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
          {editando ? "Editar servicio" : "Nuevo servicio"}
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={claseLabel}>Nombre</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={claseInput}
            />
          </div>

          <div>
            <label className={claseLabel}>Categoría</label>
            <input
              type="text"
              required
              list="lista-categorias"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className={claseInput}
              placeholder="Elige una o escribe una nueva"
            />
            <datalist id="lista-categorias">
              {categorias.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          <div>
            <label className={claseLabel}>Descripción</label>
            <textarea
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className={claseInput}
            />
          </div>

          <div>
            <label className={claseLabel}>Precio base (COP)</label>
            <input
              type="number"
              required
              min="0"
              step="1000"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className={claseInput}
            />
          </div>

                    <div>
            <label className={claseLabel}>Imagen (opcional)</label>
            <div className="flex items-center gap-4">
              {servicio?.imagen && !archivo && (
                <img
                  src={urlStorage(servicio.imagen)}
                  alt="Imagen actual"
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

          <label className="flex items-center gap-3 text-sm text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={activo}
              onChange={(e) => setActivo(e.target.checked)}
              className="w-4 h-4 accent-orange-500"
            />
            Servicio activo (visible en el catálogo público)
          </label>

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

export default ModalServicio;