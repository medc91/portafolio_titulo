// 👇 IMPORTS
import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import ReservarClaseButton from "./BotonReservarClase";
import ModalComentariosProfesor from "./ModalComentariosProfesor";
import NavbarAlumno from "./NavbarAlumno";
import { useParams } from "react-router-dom";

const BASE_URL = "http://localhost:8000";

const BuscarClasesDisponibles = () => {
  const { alumnoId } = useParams();
  const [materias, setMaterias] = useState([]);
  const [niveles, setNiveles] = useState([]);
  const [clases, setClases] = useState([]);
  const [modalProfesorId, setModalProfesorId] = useState(null);
  const [filtros, setFiltros] = useState({
    materia: "",
    nivel: "",
    profesor: "",
  });

  useEffect(() => {
    axios.get(`${BASE_URL}/api/materias/`).then((res) => setMaterias(res.data));
    axios.get(`${BASE_URL}/api/niveles/`).then((res) => setNiveles(res.data));
  }, []);

  useEffect(() => {
    buscarClases();
  }, [filtros]);

  // ✅ Reutilizable para refrescar desde el botón
  const fetchClases = async () => {
    await buscarClases();
  };

  const buscarClases = async () => {
    try {
      const params = {
        materia: filtros.materia,
        nivel: filtros.nivel,
        profesor_nombre: filtros.profesor,
      };
      const response = await axios.get(`${BASE_URL}/api/clases-disponibles/`, {
        params,
      });
      setClases(response.data);
    } catch (error) {
      console.error("Error al buscar clases:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarAlumno alumnoId={alumnoId} />
      <div className="p-6 bg-white shadow-lg rounded-b-xl">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Buscar Clases Disponibles
        </h3>

        {/* Filtros */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <select
            className="border border-gray-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            value={filtros.materia}
            onChange={(e) =>
              setFiltros((prev) => ({ ...prev, materia: e.target.value }))
            }
          >
            <option value="">Todas las materias</option>
            {materias.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre_materia}
              </option>
            ))}
          </select>

          <select
            className="border border-gray-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            value={filtros.nivel}
            onChange={(e) =>
              setFiltros((prev) => ({ ...prev, nivel: e.target.value }))
            }
          >
            <option value="">Todos los niveles</option>
            {niveles.map((n) => (
              <option key={n.id} value={n.id}>
                {n.nombre_nivel}
              </option>
            ))}
          </select>

          <input
            type="text"
            className="border border-gray-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            placeholder="Buscar profesor..."
            value={filtros.profesor}
            onChange={(e) =>
              setFiltros((prev) => ({ ...prev, profesor: e.target.value }))
            }
          />
        </div>

        {/* Lista de clases */}
        {clases.length === 0 ? (
          <p className="text-gray-500">No se encontraron clases disponibles.</p>
        ) : (
          <ul className="space-y-4">
            {clases.map((clase) => (
              <li
                key={clase.id}
                className="p-5 border border-gray-200 rounded-xl shadow-md flex justify-between items-start bg-white"
              >
                <div className="space-y-1 text-sm">
                  <p>
                    <strong className="text-gray-700">📅 Fecha:</strong>{" "}
                    {dayjs(clase.inicio).local().format("DD/MM/YYYY")}
                  </p>
                  <p>
                    <strong className="text-gray-700">⏰ Hora:</strong>{" "}
                    {dayjs(clase.inicio).local().format("HH:mm")} -{" "}
                    {dayjs(clase.fin).local().format("HH:mm")}
                  </p>
                  <p>
                    <strong className="text-gray-700">📘 Materia:</strong>{" "}
                    {clase.materia}
                  </p>
                  <p>
                    <strong className="text-gray-700">🎓 Nivel:</strong>{" "}
                    {clase.nivel}
                  </p>
                  <p>
                    <strong className="text-gray-700">👨‍🏫 Profesor:</strong>{" "}
                    {clase.profesor}
                  </p>
                  <p>
                    <strong className="text-gray-700">💲 Monto:</strong> $
                    {clase.monto}
                  </p>

                  <button
                    className="mt-2 text-sm text-emerald-500 hover:underline"
                    onClick={() => setModalProfesorId(clase.profesor_id)}
                  >
                    Ver comentarios del profesor
                  </button>
                </div>

                <ReservarClaseButton
                  alumnoId={alumnoId}
                  horaClaseId={clase.id}
                  clase={clase}
                  onReservar={fetchClases}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition"
                />
              </li>
            ))}
          </ul>
        )}

        {/* Modal de comentarios */}
        {modalProfesorId && (
          <ModalComentariosProfesor
            profesorId={modalProfesorId}
            onClose={() => setModalProfesorId(null)}
          />
        )}
      </div>
    </div>
  );
};

export default BuscarClasesDisponibles;
