import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

const BASE_URL = "http://localhost:8000";

const VerMaterialAlumno = ({ alumnoId }) => {
  const [materialesPorClase, setMaterialesPorClase] = useState({});
  const [clasesExpandida, setClasesExpandida] = useState({});

  useEffect(() => {
    const fetchMateriales = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/alumno/${alumnoId}/materiales/`
        );
        const agrupados = {};

        (res.data || []).forEach((material) => {
          const claseId = material.clase_id;
          if (!agrupados[claseId]) agrupados[claseId] = [];
          agrupados[claseId].push(material);
        });

        setMaterialesPorClase(agrupados);
      } catch (error) {
        console.error("Error al obtener materiales:", error);
      }
    };

    fetchMateriales();
  }, [alumnoId]);

  const toggleClase = (claseId) => {
    setClasesExpandida((prev) => ({
      ...prev,
      [claseId]: !prev[claseId],
    }));
  };

  const clasesIds = Object.keys(materialesPorClase);

  if (clasesIds.length === 0) {
    return (
      <div className="bg-white p-4 rounded shadow mt-6">
        <p className="text-gray-500">No tienes materiales disponibles aún.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Materiales por Clase Reservada
      </h3>

      <ul className="space-y-4">
        {clasesIds.map((claseId) => {
          const materiales = materialesPorClase[claseId];
          const info = materiales[0]; // Todos tienen misma clase, profesor, fecha

          return (
            <li key={claseId} className="border p-4 rounded shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p>
                    <strong>Materia:</strong> {info.materia}
                  </p>
                  <p>
                    <strong>Profesor:</strong> {info.profesor}
                  </p>
                  <p>
                    <strong>Fecha de clase:</strong>{" "}
                    {dayjs(info.fecha).format("DD/MM/YYYY")}
                  </p>
                </div>
                <button
                  onClick={() => toggleClase(claseId)}
                  className="text-pink-500 hover:underline"
                >
                  {clasesExpandida[claseId]
                    ? "Ocultar materiales"
                    : "Ver materiales"}
                </button>
              </div>

              {clasesExpandida[claseId] && (
                <ul className="list-disc list-inside bg-gray-50 p-3 rounded">
                  {materiales.map((material, idx) => (
                    <li key={idx}>
                      {material.tipo === "PDF" ? (
                        <a
                          href={`${BASE_URL}${material.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          Ver PDF
                        </a>
                      ) : (
                        <a
                          href={material.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          Ver Enlace
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default VerMaterialAlumno;
