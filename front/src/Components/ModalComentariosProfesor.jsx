import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8000";

const ModalComentariosProfesor = ({ profesorId, onClose }) => {
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/profesor/${profesorId}/perfil/`
        );
        setDatos(res.data);
      } catch (error) {
        console.error("Error al obtener comentarios:", error);
      }
    };
    fetchComentarios();
  }, [profesorId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-pink-500 text-xl"
        >
          &times;
        </button>
        {!datos ? (
          <p className="text-gray-600">Cargando comentarios...</p>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-2 text-gray-800">
              Valoración y comentarios
            </h2>
            <p className="text-yellow-600 font-semibold mb-4">
              Valoración promedio: ⭐ {datos.valoracion}
            </p>
            {datos.comentarios.length > 0 ? (
              <div className="space-y-4 max-h-72 overflow-y-auto">
                {datos.comentarios.map((comentario, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 p-3 rounded border-l-4 border-pink-300"
                  >
                    <p className="text-sm italic text-gray-700">
                      “{comentario.comentario}”
                    </p>
                    <p className="text-sm text-yellow-600">
                      Puntuación: ⭐ {comentario.puntuacion}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Aún no hay comentarios.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ModalComentariosProfesor;
