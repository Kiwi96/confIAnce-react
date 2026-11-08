function Inicio() {
  return (
    <>
      {/* HERO COMPLETO */}
      <section className="relative h-screen overflow-hidden">
        {/* VIDEO BACKGROUND */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/videoHero.mp4" type="video/mp4" />
        </video>

        {/* OVERLAY OSCURO */}
        <div className="absolute inset-0 bg-black/70"></div>

        {/* CONTENIDO HERO */}
        <main className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-10 w-full">
            <article className="max-w-5xl mt-20">
              <h1 className="text-white text-6xl font-bold leading-tight mb-3 max-w-2xl text-justify">
                Redefinimos el ejercicio del derecho mediante inteligencia
                artificial
              </h1>

              <h2 className="text-2xl text-gray-300 leading-relaxed max-w-2xl">
                Gobernanza IA, analítica jurídica y soluciones legal-tech para
                organizaciones que buscan liderar la transformación digital.
              </h2>
            </article>
          </div>
        </main>
      </section>
      {/* SERVICIOS */}
      <section className="bg-black py-28">
        <div className="max-w-7xl mx-auto px-12">
          <h2 className="text-white text-5xl font-bold mb-4">
            {" "}
            Nuestros Servicios{" "}
          </h2>
          <p className="text-zinc-400 text-xl mb-16 max-w-3xl">
            {" "}
            Tecnología, estrategia y cumplimiento para organizaciones que buscan
            liderar la transformación digital.{" "}
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-black border border-zinc-800 rounded-2xl p-8 hover:border-orange-500 transition">
              <img
                src="/consultoria.svg"
                alt="Consultoria "
                className="w-44 h-44 object-contain mx-auto mb-6"
              />
              <h3 className="text-white text-2xl font-semibold mb-4">
                {" "}
                Gobernanza IA{" "}
              </h3>
              <p className="text-zinc-400">
                {" "}
                Diseño e implementación de políticas para el uso responsable de
                inteligencia artificial.{" "}
              </p>
            </div>
            <div className="bg-black border border-zinc-800 rounded-2xl p-8 hover:border-orange-500 transition">
              <img
                src="/gobernanza3.svg"
                alt="Gobernanza IA"
                className="w-44 h-44 object-contain mx-auto mb-6"
              />
              <h3 className="text-white text-2xl font-semibold mb-4">
                {" "}
                Analítica Jurídica{" "}
              </h3>
              <p className="text-zinc-400">
                {" "}
                Transformamos datos legales en información estratégica para la
                toma de decisiones.{" "}
              </p>
            </div>
            <div className="bg-black border border-zinc-800 rounded-2xl p-8 hover:border-orange-500 transition">
              <img
                src="/ProteccionDatos.svg"
                alt="Protección Datos"
                className="w-44 h-44 object-contain mx-auto mb-6"
              />
              <h3 className="text-white text-2xl font-semibold mb-4">
                {" "}
                Automatización Legal{" "}
              </h3>
              <p className="text-zinc-400">
                {" "}
                Optimización de procesos jurídicos mediante herramientas de
                inteligencia artificial.{" "}
              </p>
            </div>
            <div className="bg-black border border-zinc-800 rounded-2xl p-8 hover:border-orange-500 transition">
              <img
                src="/ciberseguridad.svg"
                alt="Protección Datos"
                className="w-44 h-44 object-contain mx-auto mb-6"
              />
              <h3 className="text-white text-2xl font-semibold mb-4">
                {" "}
                Compliance Tecnológico{" "}
              </h3>
              <p className="text-zinc-400">
                {" "}
                Cumplimiento normativo para organizaciones digitales y proyectos
                tecnológicos.{" "}
              </p>
            </div>
            <div className="bg-black border border-zinc-800 rounded-2xl p-8 hover:border-orange-500 transition">
              <img
                src="/ProteccionDatos.svg"
                alt="Protección Datos"
                className="w-44 h-44 object-contain mx-auto mb-6"
              />
              <h3 className="text-white text-2xl font-semibold mb-4">
                {" "}
                Derecho Digital{" "}
              </h3>
              <p className="text-zinc-400">
                {" "}
                Protección de datos, contratación electrónica y regulación
                tecnológica.{" "}
              </p>
            </div>
            <div className="bg-black border border-zinc-800 rounded-2xl p-8 hover:border-orange-500 transition">
              <img
                src="/ProteccionDatos.svg"
                alt="Protección Datos"
                className="w-44 h-44 object-contain mx-auto mb-6"
              />
              <h3 className="text-white text-2xl font-semibold mb-4">
                {" "}
                Transformación Legal-Tech{" "}
              </h3>
              <p className="text-zinc-400">
                {" "}
                Implementación de soluciones innovadoras para departamentos
                jurídicos modernos.{" "}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Inicio;
