import React, { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import Swal from "sweetalert2";

const BASE_URL = "http://localhost:8000";

const PerfilAlumnoInfo = ({ alumnoId }) => {
  const [alumno, setAlumno] = useState(null);
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const [promedio, setPromedio] = useState(null);
  const [mensajeGuardado, setMensajeGuardado] = useState("");
  const [editando, setEditando] = useState(false);
  const [descripcionTemp, setDescripcionTemp] = useState("");

  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    const fetchAlumnoYComentarios = async () => {
      try {
        const resAlumno = await axios.get(
          `${BASE_URL}/api/alumno/${alumnoId}/`
        );
        setAlumno(resAlumno.data);
        setDescripcionTemp(resAlumno.data.descripcion || "");

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

  const handleImagenChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("foto", file);

    try {
      const res = await axios.post(
        `${BASE_URL}/api/alumno/${alumnoId}/subir-foto/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // ✅ Actualiza el estado con la nueva foto
      setAlumno((prev) => ({
        ...prev,
        foto: res.data.foto_url.replace(`${BASE_URL}/`, ""),
      }));

      // ✅ Muestra notificación de éxito
      Swal.fire({
        icon: "success",
        title: "Foto actualizada",
        text: "Tu foto de perfil ha sido cambiada exitosamente.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error al subir la imagen:", error);

      // ❌ Notificación de error
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo subir la imagen. Intenta nuevamente.",
      });
    }
  };

  const toggleComentarios = () => {
    setMostrarComentarios(!mostrarComentarios);
  };

  const guardarDescripcion = async () => {
    try {
      await axios.put(`${BASE_URL}/api/alumno/${alumnoId}/actualizar/`, {
        descripcion: descripcionTemp,
      });
      setAlumno({ ...alumno, descripcion: descripcionTemp });
      setMensajeGuardado("✅ Descripción actualizada con éxito.");
      setEditando(false);
      setTimeout(() => setMensajeGuardado(""), 3000);
    } catch (error) {
      console.error("Error al actualizar descripción:", error);
      setMensajeGuardado("❌ Error al guardar la descripción.");
    }
  };

  if (!alumno)
    return (
      <div className="text-center text-gray-500 py-10 animate-pulse">
        Cargando perfil...
      </div>
    );

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl mx-auto mb-6 text-center">
      {/* 📷 Foto */}
      <div className="relative w-32 h-32 mx-auto mb-4">
        <img
          src={
            alumno.foto
              ? alumno.foto.startsWith("http")
                ? alumno.foto
                : `${BASE_URL}/${alumno.foto.replace(/^\/?media\//, "media/")}`
              : "/default-avatar.png"
          }
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

      {/* ✍️ Descripción editable */}
      <div className="mt-4 text-left" data-aos="fade-up">
        <label className="text-gray-700 font-semibold block mb-1">
          Sobre mí:
        </label>
        {!editando ? (
          <div className="bg-gray-100 p-3 rounded-md text-gray-800">
            {alumno.descripcion || "Sin descripción"}
          </div>
        ) : (
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-emerald-300"
            rows={3}
            placeholder="Escribe una breve descripción sobre ti..."
            value={descripcionTemp}
            onChange={(e) => setDescripcionTemp(e.target.value)}
          ></textarea>
        )}
        <div className="mt-2 flex flex-col sm:flex-row gap-2">
          {!editando ? (
            <button
              onClick={() => setEditando(true)}
              className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded shadow"
            >
              Editar descripción
            </button>
          ) : (
            <>
              <button
                onClick={guardarDescripcion}
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded shadow"
              >
                Guardar descripción
              </button>
              <button
                onClick={() => setEditando(false)}
                className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
              >
                Cancelar
              </button>
            </>
          )}
        </div>
        {mensajeGuardado && (
          <p className="text-sm mt-2 text-emerald-600">{mensajeGuardado}</p>
        )}
      </div>

      {/* 🔘 Botón comentarios */}
      <button
        onClick={toggleComentarios}
        className="mt-6 w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full shadow-md transition"
      >
        {mostrarComentarios
          ? "Ocultar comentarios"
          : "Ver comentarios de profesores"}
      </button>

      {/* 💬 Comentarios */}
      {mostrarComentarios && (
        <div className="mt-6 text-left" data-aos="fade-up">
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
