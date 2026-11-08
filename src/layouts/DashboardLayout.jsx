import { NavLink, Outlet, Link } from "react-router-dom";

const MENU = [
  { to: "/dashboard", texto: "Resumen", fin: true },
  { to: "/dashboard/servicios", texto: "Servicios" },
  { to: "/dashboard/clientes", texto: "Clientes" },
  { to: "/dashboard/perfil", texto: "Mi perfil" },
];

function DashboardLayout({ user, onLogout }) {
  const claseEnlace = ({ isActive }) =>
    `block px-4 py-3 rounded-lg text-sm font-medium transition ${
      isActive
        ? "bg-orange-500/10 text-orange-400 border border-orange-500/30"
        : "text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent"
    }`;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      <aside className="w-full md:w-64 md:min-h-screen bg-zinc-950 border-b md:border-b-0 md:border-r border-zinc-800 p-5 flex flex-col">
        <Link to="/" className="text-xl font-bold text-orange-500 mb-8">
          ConfIAnce
        </Link>

        <nav className="flex md:flex-col gap-2 overflow-x-auto">
          {MENU.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.fin} className={claseEnlace}>
              {item.texto}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-6 hidden md:block">
          <p className="text-xs text-zinc-500">Sesión iniciada como</p>
          <p className="text-sm text-white font-medium truncate mb-3">{user.name}</p>
          <button
            onClick={onLogout}
            className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-sm py-2 rounded-lg transition cursor-pointer"
          >
            Salir
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;