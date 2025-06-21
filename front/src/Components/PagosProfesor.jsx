import React, { useEffect, useState } from "react";
import axios from "axios";
import NavbarProfesor from "./NavbarProfesor";

const BASE_URL = "http://localhost:8000";

const PagosProfesor = ({ profesorId }) => {
  const [pagos, setPagos] = useState([]);
  const [totalMes, setTotalMes] = useState(0);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/profesor/${profesorId}/pagos/`
        );
        setPagos(res.data.pagos);
        setTotalMes(res.data.total_mes);
      } catch (error) {
        console.error("Error al obtener pagos:", error);
      } finally {
        setCargando(false);
      }
    };

    if (profesorId) {
      fetchPagos();
    }
  }, [profesorId]);

  return (
    <div>
      <NavbarProfesor profesorId={profesorId} />

      <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow mt-8">
        <h2 className="text-2xl font-bold text-emerald-600 mb-6 text-center">
          Detalle de Pagos Recibidos
        </h2>

        {cargando ? (
          <div className="flex justify-center items-center py-8">
            <div className="w-6 h-6 border-4 border-emerald-300 border-dashed rounded-full animate-spin"></div>
            <span className="ml-2 text-emerald-600">Cargando pagos...</span>
          </div>
        ) : pagos.length === 0 ? (
          <p className="text-gray-500 text-center">
            No se han recibido pagos aún.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lista de pagos */}
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-700">
                Pagos Recibidos
              </h3>
              <div className="space-y-4">
                {pagos.map((pago, index) => (
                  <div
                    key={index}
                    className="border border-emerald-300 rounded-lg p-4 bg-white shadow transition hover:shadow-md"
                  >
                    <p>
                      <strong>📅 Fecha:</strong> {pago.fecha_pago}
                    </p>
                    <p>
                      <strong>👨‍🎓 Alumno:</strong> {pago.alumno}
                    </p>
                    <p>
                      <strong>💰 Monto:</strong> ${pago.monto.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumen del mes */}
            <div className="flex flex-col items-center justify-center border border-emerald-300 bg-green-50 p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold text-emerald-700 mb-4">
                💼 Resumen del Mes
              </h3>
              <p className="text-lg text-gray-700">
                Total Ganado:{" "}
                <span className="font-semibold text-emerald-600">
                  ${totalMes.toLocaleString()}
                </span>
              </p>
              <button
                aria-label="Cobrar ganancias del mes"
                className="mt-4 bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-400 transition"
                onClick={() => alert("Funcionalidad de cobro en desarrollo")}
              >
                💸 Cobrar Monto del Mes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PagosProfesor;
