import { useState } from "react";

const normalizar = (t) =>
  String(t ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

// Convierte "3800000.00" o true en número para ordenar bien
const comparable = (v) => {
  if (typeof v === "boolean") return Number(v);
  if (typeof v === "string" && v.trim() !== "" && !isNaN(v)) return Number(v);
  return v;
};

function TablaDatos({
  columnas,
  datos,
  buscarEn,
  porPagina = 5,
  acciones,
  textoVacio = "No hay registros.",
}) {
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState({ clave: null, dir: "asc" });
  const [pagina, setPagina] = useState(1);

  // 1. Buscar
  const q = normalizar(busqueda);
  const filtrados = q
    ? datos.filter((fila) => buscarEn.some((k) => normalizar(fila[k]).includes(q)))
    : datos;

  // 2. Ordenar
  const ordenados = [...filtrados];
  if (orden.clave) {
    ordenados.sort((a, b) => {
      const va = comparable(a[orden.clave]);
      const vb = comparable(b[orden.clave]);
      const r =
        typeof va === "number" && typeof vb === "number"
          ? va - vb
          : String(va ?? "").localeCompare(String(vb ?? ""), "es");
      return orden.dir === "asc" ? r : -r;
    });
  }

  // 3. Paginar
  const totalPaginas = Math.max(1, Math.ceil(ordenados.length / porPagina));
  const paginaActual = Math.min(pagina, totalPaginas);
  const inicio = (paginaActual - 1) * porPagina;
  const visibles = ordenados.slice(inicio, inicio + porPagina);

  const cambiarOrden = (clave) => {
    setOrden((o) =>
      o.clave === clave
        ? { clave, dir: o.dir === "asc" ? "desc" : "asc" }
        : { clave, dir: "asc" }
    );
  };

  return (
    <div>
      <input
        type="text"
        value={busqueda}
        onChange={(e) => {
          setBusqueda(e.target.value);
          setPagina(1);
        }}
        placeholder="Buscar..."
        className="w-full sm:w-72 mb-4 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition"
      />

      <div className="overflow-x-auto border border-zinc-800 rounded-2xl">
        <table className="w-full text-sm text-left">
          <thead className="bg-zinc-950 text-zinc-400 text-xs uppercase tracking-wider">
            <tr>
              {columnas.map((c) => (
                <th
                  key={c.clave}
                  onClick={() => c.ordenable !== false && cambiarOrden(c.clave)}
                  className={`px-4 py-3 font-semibold ${
                    c.ordenable !== false ? "cursor-pointer hover:text-white" : ""
                  }`}
                >
                  {c.titulo}
                  {orden.clave === c.clave && (orden.dir === "asc" ? " ▲" : " ▼")}
                </th>
              ))}
              {acciones && <th className="px-4 py-3 text-right">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {visibles.length === 0 ? (
              <tr>
                <td
                  colSpan={columnas.length + (acciones ? 1 : 0)}
                  className="px-4 py-10 text-center text-zinc-500"
                >
                  {textoVacio}
                </td>
              </tr>
            ) : (
              visibles.map((fila) => (
                <tr
                  key={fila.id}
                  className="border-t border-zinc-800 hover:bg-zinc-900/50 transition"
                >
                  {columnas.map((c) => (
                    <td key={c.clave} className="px-4 py-3 text-zinc-200">
                      {c.render ? c.render(fila) : fila[c.clave]}
                    </td>
                  ))}
                  {acciones && (
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {acciones(fila)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-zinc-400">
        <span>
          {ordenados.length} registro{ordenados.length !== 1 && "s"}
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
            className="px-3 py-1 rounded-lg border border-zinc-800 hover:bg-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Anterior
          </button>
          <span>
            Página {paginaActual} de {totalPaginas}
          </span>
          <button
            onClick={() => setPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            className="px-3 py-1 rounded-lg border border-zinc-800 hover:bg-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}

export default TablaDatos;