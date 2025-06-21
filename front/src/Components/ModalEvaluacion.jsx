import React, { useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8000";

const ModalEvaluacion = ({ isOpen, onClose, reservaId, evaluador }) => {
  const [rating, setRating] = useState(0);
  const [comentario, setComentario] = useState("");
  const [error, setError] = useState(""); // Nuevo estado para mensaje de error

  const handleSubmit = async () => {
    if (rating < 1 || rating > 5) {
      setError("Por favor selecciona una calificación de 1 a 5 estrellas.");
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/api/evaluar-clase/`,
        {
          reserva: reservaId,
          evaluador: evaluador,
          puntuacion: rating,
          comentario: comentario,
        },
        {
          headers: {
            "Content-Type": "application/json", // <---- importante
          },
        }
      );
      setError("");
      onClose();
    } catch (error) {
      console.error("Error al enviar evaluación:", error);
      setError("Hubo un problema al enviar tu evaluación.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">
          {evaluador === "alumno" ? "Evalúa al Profesor" : "Evalúa al Alumno"}
        </h2>

        <div className="mb-4">
          <p className="mb-1 text-center">Calificación:</p>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => {
                  setRating(star);
                  setError(""); // Quitar mensaje si ya selecciona estrella
                }}
                className={`text-3xl ${
                  star <= rating ? "text-yellow-400" : "text-gray-300"
                } focus:outline-none transition-all duration-200`}
              >
                ★
              </button>
            ))}
          </div>
          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}
        </div>

        <div className="mb-4">
          <p className="mb-1">Comentario:</p>
          <textarea
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            rows={4}
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Escribe tu opinión sobre la clase..."
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-emerald-400 hover:bg-emerald-500 text-white px-4 py-2 rounded shadow transition-all duration-300"
          >
            Enviar evaluación
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEvaluacion;
