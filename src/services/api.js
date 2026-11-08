const API_URL = "http://127.0.0.1:8000/api";

async function peticion(ruta, { method = "GET", body } = {}) {
  const token = localStorage.getItem("token");

  const respuesta = await fetch(`${API_URL}${ruta}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) throw datos;
  return datos;
}

// ---------- Autenticación ----------
export const registrar = (datos) =>
  peticion("/register", { method: "POST", body: datos });

export const ingresar = (datos) =>
  peticion("/login", { method: "POST", body: datos });

export const cerrarSesion = () => peticion("/logout", { method: "POST" });

export const obtenerUsuario = () => peticion("/user");

export const olvideContrasena = (email) =>
  peticion("/forgot-password", { method: "POST", body: { email } });

export const restablecerContrasena = (datos) =>
  peticion("/reset-password", { method: "POST", body: datos });

// ---------- Perfil ----------
export const actualizarPerfil = (datos) =>
  peticion("/user", { method: "PUT", body: datos });

export const cambiarPassword = (datos) =>
  peticion("/user/password", { method: "PUT", body: datos });

// ---------- Servicios ----------
export const obtenerServicios = () => peticion("/servicios");

export const obtenerServiciosAdmin = () => peticion("/admin/servicios");

export const crearServicio = (datos) =>
  peticion("/servicios", { method: "POST", body: datos });

export const actualizarServicio = (id, datos) =>
  peticion(`/servicios/${id}`, { method: "PUT", body: datos });

export const eliminarServicio = (id) =>
  peticion(`/servicios/${id}`, { method: "DELETE" });

// ---------- Clientes ----------
export const obtenerClientes = () => peticion("/clientes");

export const crearCliente = (datos) =>
  peticion("/clientes", { method: "POST", body: datos });

export const actualizarCliente = (id, datos) =>
  peticion(`/clientes/${id}`, { method: "PUT", body: datos });

export const eliminarCliente = (id) =>
  peticion(`/clientes/${id}`, { method: "DELETE" });

// ---------- Informe PDF ----------
export async function descargarInforme() {
  const token = localStorage.getItem("token");

  const respuesta = await fetch(`${API_URL}/reportes/clientes`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!respuesta.ok) throw new Error("No se pudo generar el informe.");

  const blob = await respuesta.blob();
  const url = URL.createObjectURL(blob);

  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = "informe-confiance.pdf";
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  URL.revokeObjectURL(url);
}

// ---------- Imágenes ----------
export const urlStorage = (ruta) =>
  ruta ? `http://127.0.0.1:8000/storage/${ruta}` : null;

async function subirArchivo(ruta, campo, archivo) {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append(campo, archivo);

  // No se pone Content-Type: el navegador lo calcula solo para archivos
  const respuesta = await fetch(`${API_URL}${ruta}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) throw datos;
  return datos;
}

export const subirImagenServicio = (id, archivo) =>
  subirArchivo(`/servicios/${id}/imagen`, "imagen", archivo);

export const subirLogoCliente = (id, archivo) =>
  subirArchivo(`/clientes/${id}/logo`, "logo", archivo);

// ---------- API externa (a través de Laravel) ----------
export const obtenerDolar = () => peticion("/externo/dolar");