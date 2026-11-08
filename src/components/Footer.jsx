function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-800 text-white">
      <div className="max-w-7xl mx-auto px-10 py-16">
        <div className="grid grid-cols-2 gap-10 mb-10">
          {/* COLUMNA 1 */}
          <div>
            <img
              src="/FooterIMG.png"
              alt="Logo de ConfIAnce"
              className="w-100 object-contain"
            />
            <p className="text-gray-400 leading-relaxed">
              Firma legal-tech enfocada en gobernanza IA, automatización
              jurídica y transformación digital.
            </p>
          </div>
          {/* COLUMNA 2 */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Navegación</h3>
            <ul className="flex flex-col gap-3 text-gray-400">
              <li className="hover:text-white transition cursor-pointer">
                Inicio
              </li>
              <li className="hover:text-white transition cursor-pointer">
                Servicios
              </li>
              <li className="hover:text-white transition cursor-pointer">
                Nosotros
              </li>
              <li className="hover:text-white transition cursor-pointer">
                Contacto
              </li>
            </ul>
          </div>
        </div>
        {/* COPYRIGHT */}
        <div className="border-t border-zinc-800 pt-6">
          <p className="text-gray-500 text-sm text-center">
            © 2026 ConfIAnce. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
