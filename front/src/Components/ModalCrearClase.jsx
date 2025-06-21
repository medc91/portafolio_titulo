import React, { useState } from "react";
import axios from "axios";
import dayjs from "../utils/timezone.js";

const BASE_URL = "http://localhost:8000";

const ModalCrearClase = ({
  fechasSeleccionadas,
  profesorId,
  materias,
  niveles,
  onClose,
  onClaseCreada,
  resetearFechas,
}) => {
  const [materiaId, setMateriaId] = useState("");
  const [nivelId, setNivelId] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [monto, setMonto] = useState("");
  const [intervalo, setIntervalo] = useState(15); // Nuevo campo para intervalo
  const [error, setError] = useState("");
  const [mostrarExito, setMostrarExito] = useState(false);

  const limpiarCampos = () => {
    setMateriaId("");
    setNivelId("");
    setHoraInicio("");
    setHoraFin("");
    setMonto("");
    setIntervalo(15);
    setError("");
  };

  const crearClases = async () => {
    try {
      if (
        !materiaId ||
        !nivelId ||
        !horaInicio ||
        !horaFin ||
        !monto ||
        fechasSeleccionadas.length === 0
      ) {
        setError("Todos los campos son obligatorios.");
        return;
      }

      const clases = [];
      fechasSeleccionadas.forEach((fecha) => {
        let inicio = dayjs.tz(
          `${fecha} ${horaInicio}`,
          "YYYY-MM-DD HH:mm",
          "America/Santiago"
        );
        const fin = dayjs.tz(
          `${fecha} ${horaFin}`,
          "YYYY-MM-DD HH:mm",
          "America/Santiago"
        );
        const duracion = 90;

        while (
          inicio.add(duracion, "minute").isBefore(fin) ||
          inicio.add(duracion, "minute").isSame(fin)
        ) {
          const finClase = inicio.add(duracion, "minute");

          clases.push({
            fecha: inicio.format("YYYY-MM-DD"),
            hora_inicio: inicio.utc().format("HH:mm"),
            hora_fin: finClase.utc().format("HH:mm"),
            monto: parseInt(monto),
            materia_id: parseInt(materiaId),
            nivel_id: parseInt(nivelId),
            profesor_id: parseInt(profesorId),
          });

          inicio = finClase.add(intervalo, "minute");
        }
      });

      const response = await axios.post(`${BASE_URL}/api/crear-clases/`, {
        clases,
      });

      if (response.status === 201) {
        limpiarCampos();
        setMostrarExito(true);
        if (resetearFechas) resetearFechas();
      }
    } catch (err) {
      console.error("Error al crear clases:", err);
      setError("Hubo un problema al crear la clase.");
    }
  };

  const cerrarYRecargar = () => {
    setMostrarExito(false);
    if (onClaseCreada) onClaseCreada();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl">
        <h2 className="text-2xl font-bold text-center text-emerald-600 mb-6">
          Crear Clases
        </h2>

        {error && (
          <p className="text-red-500 font-medium text-center mb-4">{error}</p>
        )}

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Materia:
          </label>
          <select
            value={materiaId}
            onChange={(e) => setMateriaId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-emerald-300 focus:outline-none"
          >
            <option value="">Seleccione una materia</option>
            {materias.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre_materia}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nivel:
          </label>
          <select
            value={nivelId}
            onChange={(e) => setNivelId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-emerald-300 focus:outline-none"
          >
            <option value="">Seleccione un nivel</option>
            {niveles.map((n) => (
              <option key={n.id} value={n.id}>
                {n.nombre_nivel}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hora de inicio:
          </label>
          <input
            type="time"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-emerald-300 focus:outline-none"
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hora de término:
          </label>
          <input
            type="time"
            value={horaFin}
            onChange={(e) => setHoraFin(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-emerald-300 focus:outline-none"
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Intervalo entre clases (min):
          </label>
          <input
            type="number"
            value={intervalo}
            onChange={(e) => setIntervalo(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-emerald-300 focus:outline-none"
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monto:
          </label>
          <input
            type="number"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-emerald-300 focus:outline-none"
            placeholder="Ingrese el monto en CLP"
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={onClose}
            className="px-5 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            onClick={crearClases}
            className="px-5 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition shadow-md"
          >
            Crear
          </button>
        </div>
      </div>

      {mostrarExito && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl text-center w-full max-w-sm">
            <h3 className="text-xl font-bold text-emerald-600 mb-4">
              ✅ Clase creada correctamente
            </h3>
            <button
              onClick={cerrarYRecargar}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-5 rounded transition"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalCrearClase;
