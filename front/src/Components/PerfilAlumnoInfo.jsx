import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8000";

const PerfilAlumnoInfo = ({ alumnoId }) => {
  const [alumno, setAlumno] = useState(null);
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const [promedio, setPromedio] = useState(null);

  useEffect(() => {
    const fetchAlumnoYComentarios = async () => {
      try {
        // Obtener datos del alumno
        const resAlumno = await axios.get(
          `${BASE_URL}/api/alumno/${alumnoId}/`
        );
        setAlumno(resAlumno.data);

        // Obtener comentarios y calcular promedio
        const resComentarios = await axios.get(
          `${BASE_URL}/api/alumno/${alumnoId}/comentarios-profesores/`
        );
        setComentarios(resComentarios.data);

        if (resComentarios.data.length > 0) {
          const total = resComentarios.data.reduce(
            (sum, item) => sum + item.puntuacion,
            0
          );
          const avg = total / resComentarios.data.length;
          setPromedio(avg.toFixed(1));
        } else {
          setPromedio(null);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchAlumnoYComentarios();
  }, [alumnoId]);

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert("Funcionalidad de carga de imagen aún no implementada.");
    }
  };

  const toggleComentarios = () => {
    setMostrarComentarios(!mostrarComentarios);
  };

  if (!alumno)
    return <p className="text-gray-500">Cargando datos del alumno...</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl mx-auto mb-6 text-center">
      {/* 📷 Foto */}
      <div className="relative w-32 h-32 mx-auto mb-4">
        <img
          src={alumno.foto || "/default-avatar.png"}
          alt="Foto del alumno"
          className="w-full h-full rounded-full object-cover border-4 border-emerald-400 shadow"
        />
        <label className="absolute bottom-0 right-0 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full cursor-pointer shadow hover:bg-emerald-600">
          📸
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImagenChange}
          />
        </label>
      </div>

      {/* 🧑 Info personal */}
      <h2 className="text-2xl font-bold text-gray-800">
        {alumno.nombre} {alumno.apellido}
      </h2>
      <p className="text-gray-600">{alumno.correo}</p>
      <p className="text-yellow-500 mt-1 text-sm">
        ⭐ Promedio de calificación:{" "}
        {promedio !== null ? promedio : "No disponible"}
      </p>

      {/* 🔘 Botón comentarios */}
      <button
        onClick={toggleComentarios}
        className="mt-5 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full shadow-md transition"
      >
        {mostrarComentarios
          ? "Ocultar comentarios"
          : "Ver comentarios de profesores"}
      </button>

      {/* 💬 Comentarios */}
      {mostrarComentarios && (
        <div className="mt-6 text-left">
          {comentarios.length > 0 ? (
            <ul className="space-y-3">
              {comentarios.map((comentario, idx) => (
                <li
                  key={idx}
                  className="bg-gray-50 p-4 rounded shadow border border-gray-200"
                >
                  <p className="text-sm italic leading-relaxed text-gray-700">
                    “{comentario.comentario}”
                  </p>
                  <div className="text-xs text-gray-500 mt-2 flex justify-between">
                    <span>👨‍🏫 Profesor: {comentario.profesor}</span>
                    <span className="text-yellow-500">
                      ⭐ {comentario.puntuacion}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm text-center">
              No hay comentarios aún.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PerfilAlumnoInfo;
