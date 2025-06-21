import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import NavbarProfesor from "./NavbarProfesor";

const BASE_URL = "http://localhost:8000";

const HistorialClasesProfesor = ({ profesorId }) => {
  const [clases, setClases] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/profesor/${profesorId}/historial-clases/`)
      .then((res) => setClases(res.data))
      .catch((err) =>
        console.error("Error al cargar historial del profesor:", err)
      );
  }, [profesorId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarProfesor profesorId={profesorId} />

      <div className="max-w-5xl mx-auto p-6 mt-8 bg-white rounded-xl shadow">
        <h2 className="text-2xl font-bold text-emerald-600 mb-6 text-center">
          Historial de Clases Finalizadas
        </h2>

        {clases.length === 0 ? (
          <p className="text-gray-500 text-center">
            No hay clases finalizadas aún.
          </p>
        ) : (
          <ul className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
            {clases.map((clase, idx) => (
              <li
                key={idx}
                className="border border-gray-200 rounded-lg p-5 shadow-sm"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                  <p>
                    <strong>📅 Fecha:</strong>{" "}
                    {dayjs(clase.inicio).format("DD/MM/YYYY")}
                  </p>
                  <p>
                    <strong>🕒 Hora:</strong>{" "}
                    {dayjs(clase.inicio).format("HH:mm")} -{" "}
                    {dayjs(clase.fin).format("HH:mm")}
                  </p>
                  <p>
                    <strong>📘 Materia:</strong> {clase.materia}
                  </p>
                  <p>
                    <strong>👨‍🎓 Alumno:</strong> {clase.alumno}
                  </p>
                </div>

                {clase.materiales.length > 0 && (
                  <div className="mt-4">
                    <p className="font-semibold text-gray-800 mb-1">
                      Materiales enviados:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      {clase.materiales.map((mat, mIdx) => (
                        <li key={mIdx} className="text-sm">
                          <a
                            href={mat.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pink-600 font-medium hover:underline"
                          >
                            📎 Ver {mat.tipo}
                          </a>
                          {mat.descripcion && (
                            <span className="ml-2 text-gray-600">
                              ({mat.descripcion})
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HistorialClasesProfesor;
