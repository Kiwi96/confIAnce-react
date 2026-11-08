import { Link } from "react-router-dom";

function Navbar({ user, onLogout, onRegistrosClick, onIngresarClick }) {
  return (
    <header className="absolute top-0 left-0 w-full z-20">
      <nav className="w-full px-10 pt-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 -mt-10">
            <img
              src="/LOGO2.png"
              alt="Logo de ConfIAnce"
              className="w-100 md:w-110 h-auto object-contain"
            />
          </Link>

          <ul className="flex items-center gap-8 text-white">
            <li>
              <Link to="/" className="hover:text-orange-400 transition font-medium">
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/servicios" className="hover:text-orange-400 transition font-medium">
                Servicios
              </Link>
            </li>
            <li className="hover:text-orange-400 transition cursor-pointer font-medium">
              Nosotros
            </li>
            <li className="hover:text-orange-400 transition cursor-pointer font-medium">
              Blog
            </li>

            <a
              href="https://wa.me"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-400 transition cursor-pointer font-medium"
            >
              Contactanos
            </a>

            {user ? (
              <>
                <span className="font-medium text-orange-400">
                  Hola, {user.name}
                </span>
                <Link to="/dashboard" className="hover:text-orange-400 transition font-medium">
  Mi panel
</Link>
                <button
                  onClick={onLogout}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full transition font-medium cursor-pointer"
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onRegistrosClick}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full transition font-medium cursor-pointer"
                >
                  Regístrate
                </button>
                <button
                  onClick={onIngresarClick}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full transition font-medium cursor-pointer"
                >
                  Ingresa
                </button>
              </>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;