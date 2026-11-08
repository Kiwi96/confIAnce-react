import { useState, useEffect } from "react";
import TablaDatos from "../../components/TablaDatos";
import ModalCliente from "../../components/ModalCliente";
import {
  obtenerClientes,
  obtenerServiciosAdmin,
  eliminarCliente,
  urlStorage,
} from "../../services/api";

function ClientesAdmin() {
  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState({ abierto: false, cliente: null });
  const [aEliminar, setAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const cargar = () =>
    obtenerClientes()
      .then((datos) =>
        // Aplanamos el nombre del servicio para poder buscar y ordenar por él
        setClientes(datos.map((c) => ({ ...c, servicio_nombre: c.servicio?.nombre ?? "" })))
      )
      .catch(() => setError("No pudimos cargar los clientes."))
      .finally(() => setCargando(false));

  useEffect(() => {
    cargar();
    obtenerServiciosAdmin().then(setServicios).catch(() => {});
  }, []);

  const columnas = [
        {
      clave: "logo",
      titulo: "Logo",
      ordenable: false,
      render: (c) =>
        c.logo ? (
          <img
            src={urlStorage(c.logo)}
            alt={c.nombre}
            className="w-10 h-10 rounded-lg object-contain bg-zinc-900 border border-zinc-800"
          />
        ) : (
          <span className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-orange-500 font-semibold">
            {c.nombre.charAt(0)}
          </span>
        ),
    },
    { clave: "nombre", titulo: "Cliente" },
    { clave: "sector", titulo: "Sector" },
    { clave: "pais", titulo: "País" },
    { clave: "email", titulo: "Correo" },
    {
      clave: "servicio_nombre",
      titulo: "Servicio",
      render: (c) =>
        c.servicio_nombre ? (
          <span className="text-xs font-medium text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1">
            {c.servicio_nombre}
          </span>
        ) : (
          <span className="text-zinc-500">—</span>
        ),
    },
  ];

  const confirmarEliminar = async () => {
    setEliminando(true);
    try {
      await eliminarCliente(aEliminar.id);
      setAEliminar(null);
      await cargar();
    } catch {
      setError("No se pudo eliminar el cliente.");
      setAEliminar(null);
    } finally {
      setEliminando(false);
    }
  };

  const guardado = async () => {
    setModal({ abierto: false, cliente: null });
    await cargar();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Clientes</h1>
          <p className="text-zinc-400">Empresas y personas que contratan ConfIAnce.</p>
        </div>
        <button
          onClick={() => setModal({ abierto: true, cliente: null })}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-5 py-3 rounded-lg transition cursor-pointer"
        >
          + Nuevo cliente
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
          datos={clientes}
          buscarEn={["nombre", "sector", "pais", "email", "servicio_nombre"]}
          porPagina={5}
          textoVacio="No se encontraron clientes."
          acciones={(c) => (
            <>
              <button
                onClick={() => setModal({ abierto: true, cliente: c })}
                className="text-orange-400 hover:text-orange-300 mr-4 cursor-pointer"
              >
                Editar
              </button>
              <button
                onClick={() => setAEliminar(c)}
                className="text-red-400 hover:text-red-300 cursor-pointer"
              >
                Eliminar
              </button>
            </>
          )}
        />
      )}

      {modal.abierto && (
        <ModalCliente
          cliente={modal.cliente}
          servicios={servicios}
          onClose={() => setModal({ abierto: false, cliente: null })}
          onGuardado={guardado}
        />
      )}

      {aEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-white shadow-2xl">
            <h3 className="text-xl font-bold mb-2">¿Eliminar cliente?</h3>
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

export default ClientesAdmin;