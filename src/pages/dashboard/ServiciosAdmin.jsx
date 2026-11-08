import { useState, useEffect } from "react";
import TablaDatos from "../../components/TablaDatos";
import ModalServicio from "../../components/ModalServicio";
import {
  obtenerServiciosAdmin,
  eliminarServicio,
  urlStorage,
} from "../../services/api";

const formatoPrecio = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

function ServiciosAdmin() {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState({ abierto: false, servicio: null });
  const [aEliminar, setAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const cargar = () =>
    obtenerServiciosAdmin()
      .then(setServicios)
      .catch(() => setError("No pudimos cargar los servicios."))
      .finally(() => setCargando(false));

  useEffect(() => {
    cargar();
  }, []);

  const categorias = [...new Set(servicios.map((s) => s.categoria))];

  const columnas = [
    {
      clave: "imagen",
      titulo: "Imagen",
      ordenable: false,
      render: (s) =>
        s.imagen ? (
          <img
            src={urlStorage(s.imagen)}
            alt={s.nombre}
            className="w-10 h-10 rounded-lg object-contain bg-zinc-900 border border-zinc-800"
          />
        ) : (
          <span className="text-zinc-600">—</span>
        ),
    },
    { clave: "nombre", titulo: "Nombre" },
    { clave: "nombre", titulo: "Nombre" },
    { clave: "categoria", titulo: "Categoría" },
    {
      clave: "precio_base",
      titulo: "Precio base",
      render: (s) => formatoPrecio.format(s.precio_base),
    },
    {
      clave: "activo",
      titulo: "Estado",
      render: (s) => (
        <span
          className={`text-xs font-medium rounded-full px-3 py-1 border ${
            s.activo
              ? "text-green-400 bg-green-500/10 border-green-500/20"
              : "text-zinc-400 bg-zinc-500/10 border-zinc-500/20"
          }`}
        >
          {s.activo ? "Activo" : "Inactivo"}
        </span>
      ),
    },
  ];

  const confirmarEliminar = async () => {
    setEliminando(true);
    try {
      await eliminarServicio(aEliminar.id);
      setAEliminar(null);
      await cargar();
    } catch {
      setError("No se pudo eliminar el servicio.");
      setAEliminar(null);
    } finally {
      setEliminando(false);
    }
  };

  const guardado = async () => {
    setModal({ abierto: false, servicio: null });
    await cargar();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Servicios</h1>
          <p className="text-zinc-400">Administra el catálogo de ConfIAnce.</p>
        </div>
        <button
          onClick={() => setModal({ abierto: true, servicio: null })}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-5 py-3 rounded-lg transition cursor-pointer"
        >
          + Nuevo servicio
        </button>
      </div>

      {error && (
        <p className="text-red-400 border border-red-900/50 bg-red-950/20 rounded-xl p-4 mb-4">
          {error}
        </p>
      )}

      {cargando ? (
        <p className="text-zinc-400">Cargando...</p>
      ) : (
        <TablaDatos
          columnas={columnas}
          datos={servicios}
          buscarEn={["nombre", "categoria", "descripcion"]}
          porPagina={5}
          textoVacio="No se encontraron servicios."
          acciones={(s) => (
            <>
              <button
                onClick={() => setModal({ abierto: true, servicio: s })}
                className="text-orange-400 hover:text-orange-300 mr-4 cursor-pointer"
              >
                Editar
              </button>
              <button
                onClick={() => setAEliminar(s)}
                className="text-red-400 hover:text-red-300 cursor-pointer"
              >
                Eliminar
              </button>
            </>
          )}
        />
      )}

      {modal.abierto && (
        <ModalServicio
          servicio={modal.servicio}
          categorias={categorias}
          onClose={() => setModal({ abierto: false, servicio: null })}
          onGuardado={guardado}
        />
      )}

      {aEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-white shadow-2xl">
            <h3 className="text-xl font-bold mb-2">¿Eliminar servicio?</h3>
            <p className="text-zinc-400 text-sm mb-6">
              Vas a eliminar{" "}
              <span className="text-orange-400 font-medium">{aEliminar.nombre}</span>.
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setAEliminar(null)}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-3 rounded-lg transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminar}
                disabled={eliminando}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-60 py-3 rounded-lg transition cursor-pointer"
              >
                {eliminando ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServiciosAdmin;