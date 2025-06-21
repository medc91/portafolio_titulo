// src/components/CrearClase.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import NavbarProfesor from "./NavbarProfesor";
import CalendarioClase from "./CalendarioClase";
import ModalCrearClase from "./ModalCrearClase";
import ClasesDisponiblesProfesor from "./ClasesDisponiblesProfesor";

const BASE_URL = "http://localhost:8000";

const CrearClase = () => {
  const { id } = useParams();
  const profesorId = id;

  const [modalAbierto, setModalAbierto] = useState(false);
  const [fechasSeleccionadas, setFechasSeleccionadas] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [niveles, setNiveles] = useState([]);
  const [contador, setContador] = useState(0); // ← Agrega esta línea ✅

  // ✅ Este es el nuevo callback que limpia el calendario
  const resetearFechasSeleccionadas = () => {
    setFechasSeleccionadas([]);
  };

  const manejarCrearClase = (fechas) => {
    setFechasSeleccionadas(fechas);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setFechasSeleccionadas([]);
  };

  const actualizarListaClases = () => {
    setContador((prev) => prev + 1);
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/materias/`)
      .then((res) => setMaterias(res.data))
      .catch((error) => console.error("Error cargando materias:", error));

    axios
      .get(`${BASE_URL}/api/niveles/`)
      .then((res) => setNiveles(res.data))
      .catch((error) => console.error("Error cargando niveles:", error));
  }, []);
  return (
    <>
      <NavbarProfesor profesorId={profesorId} />

      <div className="p-6 max-w-6xl mx-auto bg-gray-50 shadow-lg rounded-3xl mt-10">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Selecciona fechas para crear clases
            </h2>
            <CalendarioClase onCrearClase={manejarCrearClase} />
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <ClasesDisponiblesProfesor
              profesorId={profesorId}
              actualizador={contador}
            />
          </div>
        </div>
      </div>

      {modalAbierto && (
        <ModalCrearClase
          fechasSeleccionadas={fechasSeleccionadas}
          profesorId={profesorId}
          materias={materias}
          niveles={niveles}
          onClose={cerrarModal}
          onClaseCreada={actualizarListaClases}
          onResetearFechas={resetearFechasSeleccionadas}
        />
      )}
    </>
  );
};

export default CrearClase;
