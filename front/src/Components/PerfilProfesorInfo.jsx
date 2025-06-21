import React, { useState } from "react";
import { FaStar, FaBookOpen, FaQuoteLeft } from "react-icons/fa";

const PerfilProfesorInfo = ({ profesor }) => {
  const [mostrarComentarios, setMostrarComentarios] = useState(false);

  if (!profesor) {
    return <p className="text-gray-500">Cargando perfil...</p>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-8 text-center max-w-2xl mx-auto">
      <div className="flex flex-col items-center">
        <img
          src="https://via.placeholder.com/120"
          alt="Foto perfil"
          className="w-28 h-28 rounded-full border-4 border-emerald-300 shadow mb-4"
        />
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Profesor {profesor.nombre} {profesor.apellido}
        </h2>
        <p className="text-gray-600 text-sm mb-1">
          Correo: <span className="text-gray-700">{profesor.correo}</span>
        </p>
        <div className="flex items-center justify-center text-yellow-600 font-medium mb-4">
          <FaStar className="mr-1" /> Valoración promedio: {profesor.valoracion}
        </div>
      </div>

      <div className="mt-4">
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
