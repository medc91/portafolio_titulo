import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "http://localhost:8000";

const AdminDashboard = () => {
  const [profesores, setProfesores] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [vista, setVista] = useState("profesores");
  const [filtroValidacion, setFiltroValidacion] = useState("todos");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroAlumnos, setFiltroAlumnos] = useState("todos");

  useEffect(() => {
    fetchProfesores();
    fetchAlumnos();
  }, []);

  const fetchProfesores = async () => {
    const res = await axios.get(`${BASE_URL}/api/admin/profesores/`);
    const ordenados = res.data.sort((a, b) => a.validado - b.validado);
    setProfesores(ordenados);
  };

  const fetchAlumnos = async () => {
    const res = await axios.get(`${BASE_URL}/api/admin/alumnos/`);
    setAlumnos(res.data);
  };

  const validarProfesor = async (id) => {
    try {
      await axios.post(`${BASE_URL}/api/admin/profesores/${id}/validar/`);
      fetchProfesores();
      toast.success("Título validado y correo enviado correctamente.");
    } catch (error) {
      console.error("Error al validar el título:", error);
      toast.error("Error al validar el título o enviar el correo.");
    }
  };

  const rechazarTitulo = async (id) => {
    try {
      await axios.post(`${BASE_URL}/api/admin/profesores/${id}/rechazar/`);
      fetchProfesores();
      toast.success("Correo enviado correctamente al profesor.");
    } catch (error) {
      console.error("Error al rechazar el título:", error);
      toast.error("Error al enviar el correo. Intenta nuevamente.");
    }
  };

  const toggleBloqueoProfesor = async (id, activo) => {
    const ruta = activo ? "bloquear" : "activar";
    await axios.post(`${BASE_URL}/api/admin/profesores/${id}/${ruta}/`);
    fetchProfesores();
  };

  const toggleBloqueoAlumno = async (id, activo) => {
    const ruta = activo ? "bloquear" : "activar";
    await axios.post(`${BASE_URL}/api/admin/alumnos/${id}/${ruta}/`);
    fetchAlumnos();
  };

  const profesoresFiltrados = profesores.filter((p) => {
    let validacionOK = true;
    let estadoOK = true;

    if (filtroValidacion === "no_validados") validacionOK = !p.validado;
    else if (filtroValidacion === "validados") validacionOK = p.validado;

    if (filtroEstado === "activos") estadoOK = p.activo;
    else if (filtroEstado === "bloqueados") estadoOK = !p.activo;

    return validacionOK && estadoOK;
  });

  const alumnosFiltrados = alumnos.filter((a) => {
    if (filtroAlumnos === "activos") return a.activo;
    if (filtroAlumnos === "bloqueados") return !a.activo;
    return true;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-10 text-emerald-700">
        Panel de Administración
      </h1>

      <div className="flex justify-center mb-8 gap-4">
        <button
          className={`px-6 py-2 rounded-xl font-semibold transition ${
            vista === "profesores"
              ? "bg-emerald-500 text-white"
              : "bg-white border border-emerald-500 text-emerald-500"
          }`}
          onClick={() => setVista("profesores")}
        >
          Profesores
        </button>
        <button
          className={`px-6 py-2 rounded-xl font-semibold transition ${
            vista === "alumnos"
              ? "bg-emerald-500 text-white"
              : "bg-white border border-emerald-500 text-emerald-500"
          }`}
          onClick={() => setVista("alumnos")}
        >
          Alumnos
        </button>
      </div>

      {vista === "profesores" && (
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <select
              className="border rounded-xl px-4 py-1"
              value={filtroValidacion}
              onChange={(e) => setFiltroValidacion(e.target.value)}
            >
              <option value="todos">Todos (Validación)</option>
              <option value="no_validados">No validados</option>
              <option value="validados">Validados</option>
            </select>

            <select
              className="border rounded-xl px-4 py-1"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="todos">Todos (Estado)</option>
              <option value="activos">Activos</option>
              <option value="bloqueados">Bloqueados</option>
            </select>
          </div>

          <div className="max-h-[600px] overflow-y-auto space-y-6">
            {profesoresFiltrados.map((p) => (
              <div
                key={p.id}
                className="bg-white p-6 rounded-2xl shadow-md border"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <p className="text-xl font-bold">{p.nombre}</p>
                    <p className="text-sm text-gray-600 mb-1">{p.correo}</p>
                    <div className="flex gap-4 text-sm mt-1">
                      <span>Validado: {p.validado ? "✔️ Sí" : "❌ No"}</span>
                      <span>Activo: {p.activo ? "🟢 Sí" : "🔴 No"}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {p.titulo_url && (
                      <button
                        className="bg-emerald-300 hover:bg-emerald-400 text-white px-3 py-1 rounded-xl"
                        onClick={() =>
                          window.open(BASE_URL + p.titulo_url, "_blank")
                        }
                      >
                        Ver título
                      </button>
                    )}
                    {!p.validado && (
                      <>
                        <button
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-xl"
                          onClick={() => validarProfesor(p.id)}
                        >
                          Validar título
                        </button>
                        <button
                          className="bg-red-300 hover:bg-red-400 text-white px-3 py-1 rounded-xl"
                          onClick={() => rechazarTitulo(p.id)}
                        >
                          Rechazar título
                        </button>
                      </>
                    )}
                    <button
                      className={`${
                        p.activo
                          ? "bg-red-400 hover:bg-red-500"
                          : "bg-green-400 hover:bg-green-500"
                      } text-white px-3 py-1 rounded-xl`}
                      onClick={() => toggleBloqueoProfesor(p.id, p.activo)}
                    >
                      {p.activo ? "Bloquear" : "Activar"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {vista === "alumnos" && (
        <div className="max-w-4xl mx-auto">
          <select
            className="border rounded-xl px-4 py-1 mb-4"
            value={filtroAlumnos}
            onChange={(e) => setFiltroAlumnos(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="activos">Activos</option>
            <option value="bloqueados">Bloqueados</option>
          </select>

          <div className="max-h-[600px] overflow-y-auto space-y-6">
            {alumnosFiltrados.map((a) => (
              <div
                key={a.id}
                className="bg-white p-6 rounded-2xl shadow-md border"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <p className="text-xl font-bold">{a.nombre}</p>
                    <p className="text-sm text-gray-600 mb-1">{a.correo}</p>
                    <p className="text-sm">
                      Activo: {a.activo ? "🟢 Sí" : "🔴 No"}
                    </p>
                  </div>
                  <button
                    className={`${
                      a.activo
                        ? "bg-red-400 hover:bg-red-500"
                        : "bg-green-400 hover:bg-green-500"
                    } text-white px-4 py-1 rounded-xl`}
                    onClick={() => toggleBloqueoAlumno(a.id, a.activo)}
                  >
                    {a.activo ? "Bloquear" : "Activar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
