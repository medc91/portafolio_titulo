import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import BotonUnirse from "./BotonUnirse";
import SubirMaterial from "./SubirMaterial";

const BASE_URL = "http://localhost:8000";

const ClasesReservadasProfesor = ({ profesorId }) => {
  const [clases, setClases] = useState([]);

  useEffect(() => {
    const fetchReservadas = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/profesor/${profesorId}/clases-reservadas/`
        );
        setClases(res.data || []);
      } catch (error) {
        console.error("Error al cargar clases reservadas:", error);
      }
    };

    fetchReservadas();
  }, [profesorId]);

  if (clases.length === 0) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-md mt-6">
        <p className="text-gray-600 text-center font-medium">
          No tienes clases reservadas actualmente.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">
        Clases Reservadas
      </h3>

      <div className="max-h-[500px] overflow-y-auto space-y-6">
        {clases.map((clase) => (
          <div
            key={clase.reserva_id}
            className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl shadow-sm"
          >
            <div className="flex justify-between items-center">
              <div className="space-y-1 text-gray-800 text-sm font-medium">
                <p>
                  🗓 <strong>Fecha:</strong>{" "}
                  {dayjs(clase.fecha).format("DD/MM/YYYY")}
                </p>
                <p>
                  ⏰ <strong>Hora:</strong>{" "}
                  {dayjs(clase.inicio).format("HH:mm")} -{" "}
                  {dayjs(clase.fin).format("HH:mm")}
                </p>
                <p>
                  📘 <strong>Materia:</strong> {clase.materia}
                </p>
                <p>
                  🎓 <strong>Nivel:</strong> {clase.nivel}
                </p>
                <p>
                  👤 <strong>Alumno:</strong> {clase.alumno}
                </p>
                <p>
                  📧 <strong>Correo:</strong> {clase.correo_alumno}
                </p>
              </div>

              <div className="ml-4">
                <BotonUnirse
                  videollamadaId={clase.videollamada_id}
                  reservaId={clase.reserva_id}
                  evaluador="profesor"
                  nombreUsuario={clase.alumno}
                />
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-1">
                Subir material para esta clase
              </h4>
              <SubirMaterial reservaId={clase.reserva_id} />
            </div>

            {clase.mensaje_alumno && (
              <details className="mt-3">
                <summary className="text-emerald-600 font-semibold cursor-pointer">
                  📩 Ver mensaje del alumno
                </summary>
                <p className="text-sm text-gray-700 mt-1">
                  {clase.mensaje_alumno}
                </p>
              </details>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClasesReservadasProfesor;
