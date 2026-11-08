import { useState, useEffect, useRef } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import Registros from "./components/Registros";
import Ingresar from "./components/Ingresar";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ResetPassword from "./components/ResetPassword";
import RutaProtegida from "./components/RutaProtegida";
import DashboardLayout from "./layouts/DashboardLayout";
import Inicio from "./pages/Inicio";
import Servicios from "./pages/Servicios";
import RestablecerPassword from "./pages/RestablecerPassword";
import Resumen from "./pages/dashboard/Resumen";
import ServiciosAdmin from "./pages/dashboard/ServiciosAdmin";
import ClientesAdmin from "./pages/dashboard/ClientesAdmin";
import Perfil from "./pages/dashboard/Perfil";
import { obtenerUsuario, cerrarSesion } from "./services/api";

function AppContent() {
  const [isRegistrosOpen, setIsRegistrosOpen] = useState(false);
  const [isIngresarOpen, setIsIngresarOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(
    !!localStorage.getItem("token")
  );
  const cerroSesion = useRef(false);

  const location = useLocation();
  const enDashboard = location.pathname.startsWith("/dashboard");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      obtenerUsuario()
        .then(setUser)
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setCargandoSesion(false));
    }
  }, []);

  // Si una ruta protegida nos mandó aquí, abre el login
  // (pero no si acabamos de cerrar sesión a propósito)
  useEffect(() => {
    if (location.state?.abrirLogin && !cerroSesion.current) {
      setIsIngresarOpen(true);
    }
    cerroSesion.current = false;
  }, [location]);

  const manejarAutenticacion = ({ user, token }) => {
    localStorage.setItem("token", token);
    setUser(user);
    setIsIngresarOpen(false);
    setIsRegistrosOpen(false);
  };

  const manejarLogout = async () => {
    cerroSesion.current = true;
    try {
      await cerrarSesion();
    } catch {
      // si falla, igual cerramos la sesión en el navegador
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const abrirResetDesdeIngresar = () => {
    setIsIngresarOpen(false);
    setIsResetOpen(true);
  };

  const volverAIngresarDesdeReset = () => {
    setIsResetOpen(false);
    setIsIngresarOpen(true);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-between relative">
      {!enDashboard && (
        <Navbar
          user={user}
          onLogout={manejarLogout}
          onRegistrosClick={() => setIsRegistrosOpen(true)}
          onIngresarClick={() => setIsIngresarOpen(true)}
        />
      )}

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route
          path="/restablecer"
          element={<RestablecerPassword onIngresarClick={() => setIsIngresarOpen(true)} />}
        />

        {/* Zona protegida */}
        <Route element={<RutaProtegida user={user} cargando={cargandoSesion} />}>
          <Route
            path="/dashboard"
            element={<DashboardLayout user={user} onLogout={manejarLogout} />}
          >
            <Route index element={<Resumen user={user} />} />
            <Route path="servicios" element={<ServiciosAdmin />} />
            <Route path="clientes" element={<ClientesAdmin />} />
            <Route path="perfil" element={<Perfil user={user} onUserUpdate={setUser} />} />
          </Route>
        </Route>
      </Routes>

      {!enDashboard && <Footer />}

      <Registros
        isOpen={isRegistrosOpen}
        onClose={() => setIsRegistrosOpen(false)}
        onSuccess={manejarAutenticacion}
      />

      <Ingresar
        isOpen={isIngresarOpen}
        onClose={() => setIsIngresarOpen(false)}
        onSuccess={manejarAutenticacion}
        onForgotPasswordClick={abrirResetDesdeIngresar}
      />

      <ResetPassword
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onBackToLogin={volverAIngresarDesdeReset}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;