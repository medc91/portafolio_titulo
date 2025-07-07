import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "../utils/timezone";
import NavbarAlumno from "./NavbarAlumno";

const BASE_URL = "http://localhost:8000";

const HistorialClases = ({ alumnoId }) => {
  const [clases, setClases] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/alumno/${alumnoId}/historial-clases/`)
      .then((res) => setClases(res.data))
      .catch((err) => console.error("Error al cargar historial:", err));
  }, [alumnoId]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <NavbarAlumno alumnoId={alumnoId} />

      <div className="max-w-5xl mx-auto px-4 py-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
          Historial de Clases Finalizadas
        </h3>

        {clases.length === 0 ? (
          <p className="text-gray-600 text-center mt-10">
            No hay clases finalizadas aún.
          </p>
        ) : (
          <ul className="grid gap-6">
            {clases.map((clase, idx) => (
              <li
                key={idx}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
              >
                <div className="grid md:grid-cols-2 gap-2 text-gray-700">
                  <p>
                    <strong>📅 Fecha:</strong>{" "}
                    {dayjs(clase.inicio).format("DD/MM/YYYY")}
                  </p>
                  <p>
                    <strong>🕒 Hora:</strong>{" "}
                    {dayjs.tz(clase.inicio).format("HH:mm")} -{" "}
                    {dayjs.tz(clase.fin).format("HH:mm")}
                  </p>
                  <p>
                    <strong>📘 Materia:</strong> {clase.materia}
                  </p>
                  <p>
                    <strong>👨‍🏫 Profesor:</strong> {clase.profesor}
                  </p>
                </div>

                {clase.materiales.length > 0 && (
                  <div className="mt-4">
                    <p className="font-semibold text-gray-800 mb-2">
                      📎 Materiales:
                    </p>
                    <ul className="space-y-2 pl-4 list-disc">
                      {clase.materiales.map((mat, mIdx) => (
                        <li key={mIdx}>
                          <a
                            href={mat.url}
                            className="text-emerald-500 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Ver {mat.tipo}
                          </a>
                          {mat.descripcion && (
                            <p className="text-sm text-gray-600 ml-2">
                              {mat.descripcion}
                            </p>
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

export default HistorialClases;
