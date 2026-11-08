import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  obtenerServiciosAdmin,
  obtenerClientes,
  descargarInforme,
} from "../../services/api";

const COLORES = ["#f97316", "#fb923c", "#fdba74", "#ea580c", "#c2410c", "#9a3412"];

const estiloTooltip = {
  contentStyle: {
    backgroundColor: "#18181b",
    border: "1px solid #3f3f46",
    borderRadius: "8px",
    color: "#fff",
  },
  itemStyle: { color: "#fff" },
  labelStyle: { color: "#fb923c" },
};

function Resumen({ user }) {
  const [servicios, setServicios] = useState([]);
  const [clientes, setClientes] = useState([]);
    const [descargando, setDescargando] = useState(false);
  const [errorPdf, setErrorPdf] = useState("");

  const bajarInforme = async () => {
    setErrorPdf("");
    setDescargando(true);
    try {
      await descargarInforme();
    } catch {
      setErrorPdf("No se pudo descargar el informe. Intenta de nuevo.");
    } finally {
      setDescargando(false);
    }
  };

  useEffect(() => {
    obtenerServiciosAdmin().then(setServicios).catch(() => {});
    obtenerClientes().then(setClientes).catch(() => {});
  }, []);

  const activos = servicios.filter((s) => s.activo).length;
  const categorias = new Set(servicios.map((s) => s.categoria)).size;

  // Clientes por servicio (incluye servicios con 0 clientes)
  const porServicio = servicios.map((s) => ({
    nombre: s.nombre,
    clientes: clientes.filter((c) => c.servicio_id === s.id).length,
  }));
  const sinServicio = clientes.filter((c) => !c.servicio_id).length;
  if (sinServicio > 0) {
    porServicio.push({ nombre: "Sin servicio", clientes: sinServicio });
  }

  // Clientes por país
  const conteoPais = {};
  clientes.forEach((c) => {
    conteoPais[c.pais] = (conteoPais[c.pais] || 0) + 1;
  });
  const porPais = Object.entries(conteoPais).map(([pais, total]) => ({
    pais,
    total,
  }));

  const tarjetas = [
    { titulo: "Servicios", valor: servicios.length },
    { titulo: "Servicios activos", valor: activos },
    { titulo: "Categorías", valor: categorias },
    { titulo: "Clientes", valor: clientes.length },
  ];

  return (
    <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Hola, {user.name}</h1>
          <p className="text-zinc-400">Este es el resumen de tu panel.</p>
        </div>
        <button
          onClick={bajarInforme}
          disabled={descargando}
          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-medium px-5 py-3 rounded-lg transition cursor-pointer"
        >
          {descargando ? "Generando..." : "Descargar informe PDF"}
        </button>
      </div>

      {errorPdf && (
        <p className="text-red-400 border border-red-900/50 bg-red-950/20 rounded-xl p-4 mb-6">
          {errorPdf}
        </p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {tarjetas.map((t) => (
          <div
            key={t.titulo}
            className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6"
          >
            <p className="text-sm text-zinc-400">{t.titulo}</p>
            <p className="text-4xl font-bold text-orange-500 mt-2">{t.valor}</p>
          </div>
        ))}
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        {/* GRÁFICO 1: clientes por servicio */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-1">Clientes por servicio</h2>
          <p className="text-sm text-zinc-500 mb-4">
            Cuántos clientes tiene cada servicio.
          </p>
          {clientes.length === 0 ? (
            <p className="text-zinc-500 py-16 text-center">Aún no hay datos.</p>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={porServicio}
                  layout="vertical"
                  margin={{ left: 10, right: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    stroke="#71717a"
                    fontSize={12}
                  />
                  <YAxis
                    type="category"
                    dataKey="nombre"
                    width={150}
                    stroke="#a1a1aa"
                    fontSize={12}
                  />
                  <Tooltip {...estiloTooltip} cursor={{ fill: "#27272a" }} />
                  <Bar
                    dataKey="clientes"
                    name="Clientes"
                    fill="#f97316"
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* GRÁFICO 2: clientes por país */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-1">Clientes por país</h2>
          <p className="text-sm text-zinc-500 mb-4">
            Presencia de ConfIAnce en Latinoamérica.
          </p>
          {clientes.length === 0 ? (
            <p className="text-zinc-500 py-16 text-center">Aún no hay datos.</p>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={porPais}
                    dataKey="total"
                    nameKey="pais"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {porPais.map((_, i) => (
                      <Cell key={i} fill={COLORES[i % COLORES.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...estiloTooltip} />
                  <Legend
                    formatter={(valor) => (
                      <span style={{ color: "#d4d4d8" }}>{valor}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Resumen;