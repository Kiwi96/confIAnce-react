import { Navigate, Outlet, useLocation } from "react-router-dom";

function RutaProtegida({ user, cargando }) {
  const location = useLocation();

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-400">
        Cargando...
      </div>
    );
  }

  if (!user) {
    // Va al inicio, pide abrir el login y recuerda a dónde quería entrar
    return (
      <Navigate
        to="/"
        replace
        state={{ abrirLogin: true, desde: location.pathname }}
      />
    );
  }

  return <Outlet />;
}

export default RutaProtegida;