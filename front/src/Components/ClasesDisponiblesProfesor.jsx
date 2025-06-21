import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import ReservarClaseButton from "./BotonReservarClase";

const BASE_URL = "http://localhost:8000";

const ClasesDisponiblesProfesor = ({ profesorId, alumnoId, actualizador }) => {
  const [clases, setClases] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/profesor/${profesorId}/clases-disponibles/`
        );
        console.log("Clases recibidas:", res.data);

        const ordenadas = res.data.sort((a, b) => {
          const inicioA = dayjs(a.inicio);
          const inicioB = dayjs(b.inicio);
          return inicioA.valueOf() - inicioB.valueOf();
        });

        setClases(ordenadas);
      } catch (error) {
        console.error("Error al cargar clases disponibles:", error);
      } finally {
        setCargando(false);
      }
    };

    if (profesorId) cargar();
  }, [profesorId, actualizador]);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl mt-8 max-w-5xl mx-auto border border-emerald-200">
      <h2 className="text-2xl font-bold text-emerald-600 mb-6 text-center">
        📚 Clases Disponibles
      </h2>

      {cargando ? (
        <p className="text-gray-500 text-center">Cargando clases...</p>
      ) : clases.length === 0 ? (
        <p className="text-gray-500 text-center">
          No hay clases disponibles en este momento.
        </p>
      ) : (
        <ul className="space-y-6 max-h-[500px] overflow-y-auto">
          {clases.map((clase, index) => {
            const inicio = dayjs(clase.inicio);
            const fin = dayjs(clase.fin);
            return (
              <li
                key={index}
                className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 shadow-sm hover:shadow-md transition duration-300"
              >
                <p className="text-gray-700">
                  🗓️ <strong>Fecha:</strong>{" "}
                  {dayjs(clase.fecha).format("DD/MM/YYYY")}
                </p>
                <p className="text-gray-700">
                  ⏰ <strong>Hora:</strong>{" "}
                  {inicio.isValid() && fin.isValid()
                    ? `${inicio.format("HH:mm")} - ${fin.format("HH:mm")}`
                    : "Hora inválida"}
                </p>
                <p className="text-gray-700">
                  📘 <strong>Materia:</strong> {clase.materia}
                </p>
                <p className="text-gray-700">
                  🎓 <strong>Nivel:</strong> {clase.nivel}
                </p>

                {alumnoId && (
                  <div className="mt-4 text-center">
                    <ReservarClaseButton
                      alumnoId={alumnoId}
                      horaClaseId={clase.hora_clase_id}
                      onReservar={() => {
                        // Acción opcional
                      }}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ClasesDisponiblesProfesor;
