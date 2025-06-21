// src/components/CalendarioClase.jsx
import React, { useState } from "react";
import DatePicker from "react-multi-date-picker";
import "react-multi-date-picker/styles/colors/purple.css";

const CalendarioClase = ({ onCrearClase }) => {
  const [fechasSeleccionadas, setFechasSeleccionadas] = useState([]);

  const manejarCrearClase = () => {
    if (fechasSeleccionadas.length === 0) {
      alert("Debes seleccionar al menos una fecha.");
      return;
    }

    const fechasFormateadas = fechasSeleccionadas.map((fecha) =>
      fecha.format("YYYY-MM-DD")
    );
    onCrearClase(fechasFormateadas);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg max-w-xl mx-auto">
      <h3 className="text-2xl font-bold text-emerald-600 mb-4 text-center">
        Selecciona las fechas para tus clases
      </h3>

      <div className="flex justify-center mb-4">
        <DatePicker
          multiple
          value={fechasSeleccionadas}
          onChange={setFechasSeleccionadas}
          format="YYYY-MM-DD"
          className="purple"
          placeholder="Selecciona una o más fechas"
        />
      </div>

      <div className="flex justify-center">
        <button
          onClick={manejarCrearClase}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-2 rounded-xl shadow transition duration-300"
        >
          Crear clase
        </button>
      </div>
    </div>
  );
};

export default CalendarioClase;
