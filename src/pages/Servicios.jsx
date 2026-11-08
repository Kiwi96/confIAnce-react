import { useState, useEffect } from "react";
import { obtenerServicios, obtenerDolar, urlStorage } from "../services/api";

const ICONOS = [
  { clave: "gobernanza", archivo: "/consultoria.svg" },
  { clave: "analitica", archivo: "/gobernanza3.svg" },
  { clave: "automatizacion", archivo: "/ProteccionDatos.svg" },
  { clave: "cumplimiento", archivo: "/ciberseguridad.svg" },
  { clave: "compliance", archivo: "/ciberseguridad.svg" },
  { clave: "derecho", archivo: "/ProteccionDatos.svg" },
  { clave: "legal-tech", archivo: "/ProteccionDatos.svg" },
];

const normalizar = (texto) =>
  texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function iconoDe(servicio) {
  if (servicio.imagen) return urlStorage(servicio.imagen);
  const nombre = normalizar(servicio.nombre);
  const encontrado = ICONOS.find((i) => nombre.includes(i.clave));
  return encontrado ? encontrado.archivo : "/consultoria.svg";
}

const formatoCop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const formatoUsd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function Servicios() {
  const [servicios, setServicios] = useState([]);
  const [tasa, setTasa] = useState(null); // pesos por cada dólar
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerServicios()
      .then((datos) => setServicios(datos.filter((s) => s.activo)))
      .catch(() => setError("No pudimos cargar los servicios. Intenta de nuevo."))
      .finally(() => setCargando(false));

    // API externa: si falla, solo se oculta el precio en dólares
    obtenerDolar()
      .then((d) => setTasa(d.cop))
      .catch(() => {});
  }, []);

  return (
    <section className="bg-black pt-44 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="mb-14 max-w-3xl">
          <span className="text-orange-500 text-sm font-semibold uppercase tracking-widest">
            Qué hacemos
          </span>
          <h2 className="text-white text-4xl md:text-5xl font-bold mt-3 mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-zinc-400 text-lg md:text-xl">
            Tecnología, estrategia y cumplimiento para organizaciones que buscan
            liderar la transformación digital.
          </p>
          {tasa && (
            <p className="text-zinc-500 text-sm mt-4">
              Tasa de referencia: 1 USD ={" "}
              {tasa.toLocaleString("es-CO", { maximumFractionDigits: 0 })} COP
            </p>
          )}
        </div>

        {cargando && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-72 rounded-2xl bg-zinc-900/60 border border-zinc-800 animate-pulse"
              />
            ))}
          </div>
        )}

        {error && (
          <p className="text-red-400 border border-red-900/50 bg-red-950/20 rounded-xl p-4">
            {error}
          </p>
        )}

        {!cargando && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicios.map((s) => (
              <article
                key={s.id}
                className="group flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl p-7 transition duration-300 hover:border-orange-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/10"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-20 h-20 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-orange-500/40 transition">
                    <img
                      src={iconoDe(s)}
                      alt={s.nombre}
                      className="w-14 h-14 object-contain"
                    />
                  </div>
                  <span className="text-xs font-medium text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1">
                    {s.categoria}
                  </span>
                </div>

                <h3 className="text-white text-xl font-semibold mb-3">{s.nombre}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed flex-1">
                  {s.descripcion}
                </p>

                <div className="mt-6 pt-5 border-t border-zinc-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-zinc-500">Desde</p>
                    <p className="text-white font-semibold">
                      {formatoCop.format(s.precio_base)}
                    </p>
                    {tasa && (
                      <p className="text-xs text-zinc-500">
                        ≈ {formatoUsd.format(Number(s.precio_base) / tasa)} USD
                      </p>
                    )}
                  </div>
                  <a
                    href="https://wa.me"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-orange-400 hover:text-orange-300 transition font-medium"
                  >
                    Consultar →
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Servicios;