import React, { useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8000";

const ReservarClaseButton = ({ alumnoId, horaClaseId, onReservar, clase }) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensajeAlumno, setMensajeAlumno] = useState("");
  const [estadoPago, setEstadoPago] = useState("esperando"); // esperando | procesando | realizado
  const [mensaje, setMensaje] = useState("");

  const manejarReservaConPago = async () => {
    setEstadoPago("procesando");

    setTimeout(async () => {
      try {
        const response = await axios.post(`${BASE_URL}/api/reservar-clase/`, {
          alumno_id: alumnoId,
          hora_clase_id: horaClaseId,
          mensaje_alumno: mensajeAlumno,
        });

        if (response.status === 201) {
          setEstadoPago("realizado");
          setMensaje("✅ Clase reservada exitosamente.");
          if (onReservar) onReservar();
          setTimeout(() => setMostrarModal(false), 1200);
        }
      } catch (error) {
        setMensaje(
          error?.response?.data?.error || "❌ No se pudo completar la reserva."
        );
        setEstadoPago("esperando");
      }
    }, 2000);
  };

  return (
    <div className="mt-4 space-y-3">
      <button
        onClick={() => setMostrarModal(true)}
        className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-2 px-5 rounded-full shadow-lg transition duration-200 ease-in-out"
      >
        Reservar Clase
      </button>

      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96 relative">
            <h3 className="text-xl font-semibold text-emerald-600 mb-4">
              Confirmar Reserva
            </h3>

            <textarea
              value={mensajeAlumno}
              onChange={(e) => setMensajeAlumno(e.target.value)}
              placeholder="¿Qué te gustaría revisar en esta clase?"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none mb-4"
              rows={3}
            />

            {estadoPago === "procesando" ? (
              <p className="text-center text-emerald-600 font-medium">
                💳 Procesando pago...
              </p>
            ) : estadoPago === "realizado" ? (
              <p className="text-center text-green-600 font-semibold">
                ✅ Pago realizado y clase reservada
              </p>
            ) : (
              <div className="space-y-2 text-sm text-gray-700 mb-4">
                <p>
                  <strong>Fecha:</strong> {clase?.fecha}
                </p>
                <p>
                  <strong>Hora:</strong> {clase?.inicio} - {clase?.fin}
                </p>
                <p>
                  <strong>Materia:</strong> {clase?.materia}
                </p>
                <p>
                  <strong>Nivel:</strong> {clase?.nivel}
                </p>
                <p>
                  <strong>Monto:</strong> ${clase?.monto}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              {estadoPago === "esperando" && (
                <>
                  <button
                    onClick={() => setMostrarModal(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={manejarReservaConPago}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg"
                  >
                    Confirmar Pago
                  </button>
                </>
              )}
            </div>

            {mensaje && (
              <p
                className={`text-sm mt-3 font-medium ${
                  mensaje.startsWith("✅") ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {mensaje}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservarClaseButton;
