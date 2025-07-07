import React, { useState, useRef } from "react";
import { FaStar, FaBookOpen, FaQuoteLeft, FaCamera } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = "http://localhost:8000";

const PerfilProfesorInfo = ({ profesor }) => {
  const inputRef = useRef();
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const [editando, setEditando] = useState(false);
  const [descripcionTemp, setDescripcionTemp] = useState(
    profesor.descripcion || ""
  );
  const [mensaje, setMensaje] = useState("");
  const [foto, setFoto] = useState(profesor.foto);

  const subirFoto = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("foto", file);

    try {
      const res = await axios.post(
        `${BASE_URL}/api/profesor/${profesor.id}/subir-foto/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setFoto(res.data.foto_url);

      Swal.fire({
        icon: "success",
        title: "Foto actualizada",
        text: "Tu nueva foto de perfil ha sido cargada correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error al subir foto:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al subir la imagen.",
      });
    }
  };

  const guardarDescripcion = async () => {
    try {
      await axios.put(`${BASE_URL}/api/profesor/${profesor.id}/actualizar/`, {
        descripcion: descripcionTemp,
      });
      setMensaje("✅ Descripción guardada exitosamente.");
      setEditando(false);
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      console.error("Error al actualizar descripción:", error);
      setMensaje("❌ Error al guardar la descripción.");
    }
  };

  if (!profesor) {
    return <p className="text-gray-500">Cargando perfil...</p>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-8 text-center max-w-2xl mx-auto">
      {/* 🖼️ Foto con botón de cámara */}
      <div className="relative w-28 h-28 mx-auto mb-4">
        <img
          src={
            foto
              ? foto.startsWith("http")
                ? foto
                : `${BASE_URL}/${foto.replace(/^\/?media\//, "media/")}`
              : "/default-avatar.png"
          }
          alt="Foto perfil"
          className="w-full h-full rounded-full object-cover border-4 border-emerald-400 shadow"
        />
        <button
          className="absolute bottom-0 right-0 bg-emerald-400 text-white p-2 rounded-full shadow hover:bg-emerald-500 transition"
          onClick={() => inputRef.current.click()}
        >
          <FaCamera />
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={subirFoto}
        />
      </div>

      {/* 👨‍🏫 Nombre y correo */}
      <h2 className="text-2xl font-bold text-gray-800 mb-1">
        Profesor {profesor.nombre} {profesor.apellido}
      </h2>
      <p className="text-gray-600 text-sm mb-1">
        Correo: <span className="text-gray-700">{profesor.correo}</span>
      </p>
      <div className="flex items-center justify-center text-yellow-600 font-medium mb-4">
        <FaStar className="mr-1" /> Valoración promedio: {profesor.valoracion}
      </div>

      {/* ✍️ Descripción editable */}
      <div className="mt-4 text-left">
        <label className="text-gray-700 font-semibold block mb-1">
          Sobre mí:
        </label>
        <textarea
          disabled={!editando}
          className={`w-full p-3 border rounded-md ${
            editando
              ? "border-gray-300 focus:outline-none focus:ring focus:ring-emerald-300"
              : "bg-gray-100 border-transparent cursor-default"
          }`}
          rows={3}
          value={descripcionTemp}
          onChange={(e) => setDescripcionTemp(e.target.value)}
        />
        <div className="flex justify-end gap-3 mt-2">
          {!editando ? (
            <button
              onClick={() => setEditando(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded shadow"
            >
              Editar descripción
            </button>
          ) : (
            <button
              onClick={guardarDescripcion}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded shadow"
            >
              Guardar descripción
            </button>
          )}
        </div>
        {mensaje && <p className="text-sm mt-2 text-emerald-600">{mensaje}</p>}
      </div>

      {/* 📘 Materias */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center justify-center gap-2">
          <FaBookOpen /> Materias que enseña:
        </h3>
        {profesor.materias && profesor.materias.length > 0 ? (
          <ul className="mt-2 list-disc list-inside text-gray-700">
            {profesor.materias.map((materia, index) => (
              <li key={index}>{materia}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-2">
            Este profesor aún no ha agregado materias.
          </p>
        )}
      </div>

      {/* 💬 Comentarios */}
      <div className="mt-6">
        <button
          onClick={() => setMostrarComentarios(!mostrarComentarios)}
          className="bg-emerald-400 hover:bg-emerald-500 text-white px-5 py-2 rounded-full font-semibold shadow transition"
        >
          {mostrarComentarios
            ? "Ocultar comentarios"
            : "Ver comentarios de alumnos"}
        </button>
      </div>

      {mostrarComentarios && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Comentarios de alumnos:
          </h4>
          {profesor.comentarios && profesor.comentarios.length > 0 ? (
            <div className="space-y-4">
              {profesor.comentarios.map((comentario, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border-l-4 border-pink-300 rounded-md p-4 shadow-sm"
                >
                  <p className="text-gray-700 text-sm italic flex items-start gap-2">
                    <FaQuoteLeft className="text-pink-300 mt-0.5" />“
                    {comentario.comentario}”
                  </p>
                  <p className="text-sm text-yellow-600 mt-1">
                    Puntuación: <FaStar className="inline mb-0.5" />{" "}
                    {comentario.puntuacion}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aún no hay comentarios.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PerfilProfesorInfo;
