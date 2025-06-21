import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import BotonUnirse from "./BotonUnirse";

const BASE_URL = "http://localhost:8000";

const ClasesReservadas = ({ reservas, alumnoId }) => {
  const [materialesPorClase, setMaterialesPorClase] = useState({});
  const [claseExpandida, setClaseExpandida] = useState(null);

  const toggleMateriales = async (claseId) => {
    if (claseExpandida === claseId) {
      setClaseExpandida(null);
      return;
    }

    if (!materialesPorClase[claseId]) {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/alumno/${alumnoId}/materiales/`
        );
        const agrupados = {};
        res.data.forEach((m) => {
          if (!agrupados[m.clase_id]) agrupados[m.clase_id] = [];
          agrupados[m.clase_id].push(m);
        });
        setMaterialesPorClase(agrupados);
      } catch (error) {
        console.error("Error al obtener materiales:", error);
      }
    }

    setClaseExpandida(claseId);
  };

  if (!reservas || reservas.length === 0) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-md mt-6">
        <p className="text-gray-500 text-center">
          No tienes clases reservadas.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">
        Clases Reservadas
      </h3>

      <ul className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
        {reservas.map((clase, index) => (
          <li
            key={index}
            className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl shadow-sm"
          >
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div className="text-sm text-gray-800 space-y-1">
                <p>
                  🗓 <strong>Fecha:</strong>{" "}
                  {dayjs(clase.inicio).local().format("DD/MM/YYYY")}
                </p>
                <p>
                  ⏰ <strong>Hora:</strong>{" "}
                  {dayjs(clase.inicio).local().format("HH:mm")}
                </p>
                <p>
                  📘 <strong>Materia:</strong> {clase.materia}
                </p>
                <p>
                  👨‍🏫 <strong>Profesor:</strong> {clase.profesor}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <BotonUnirse
                  videollamadaId={clase.videollamada_id}
                  reservaId={clase.reserva_id}
                  evaluador="alumno"
                  nombreUsuario={clase.profesor}
                />

                <button
                  className="text-emerald-600 text-sm font-medium hover:underline"
                  onClick={() => toggleMateriales(clase.videollamada_id)}
                >
                  {claseExpandida === clase.videollamada_id
                    ? "Ocultar materiales"
                    : "Ver materiales"}
                </button>
              </div>
            </div>

            {claseExpandida === clase.videollamada_id &&
              materialesPorClase[clase.videollamada_id] && (
                <ul className="bg-gray-50 p-3 rounded mt-3 space-y-2 text-sm">
                  {materialesPorClase[clase.videollamada_id].length === 0 ? (
                    <li className="text-gray-500">
                      Sin materiales disponibles.
                    </li>
                  ) : (
                    materialesPorClase[clase.videollamada_id].map(
                      (material, idx) => (
                        <li key={idx}>
                          <p className="italic mb-1">
                            {material.descripcion || "Sin descripción"}
                          </p>
                          <a
                            href={
                              material.tipo === "PDF"
                                ? `${BASE_URL}${material.url}`
                                : material.url
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-500 underline"
                          >
                            Ver {material.tipo}
                          </a>
                        </li>
                      )
                    )
                  )}
                </ul>
              )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClasesReservadas;
