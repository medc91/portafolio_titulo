// src/components/PerfilProfesor.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import NavbarProfesor from "./NavbarProfesor";
import ModalCrearClase from "./ModalCrearClase";
import ClasesReservadasProfesor from "./ClasesReservadasProfesor";
import PerfilProfesorInfo from "./PerfilProfesorInfo";

const BASE_URL = "http://localhost:8000";

const PerfilProfesor = () => {
  const { id } = useParams();
  const profesorId = id;

  const [profesor, setProfesor] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [fechasSeleccionadas, setFechasSeleccionadas] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [niveles, setNiveles] = useState([]);

  useEffect(() => {
    const fetchProfesor = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/profesor/${profesorId}/perfil/`
        );
        setProfesor(res.data);
      } catch (error) {
        console.error("Error al cargar datos del profesor:", error);
      }
    };

    if (profesorId) {
      fetchProfesor();

      axios
        .get(`${BASE_URL}/api/materias/`)
        .then((res) => setMaterias(res.data))
        .catch((error) => console.error("Error al cargar materias:", error));

      axios
        .get(`${BASE_URL}/api/niveles/`)
        .then((res) => setNiveles(res.data))
        .catch((error) => console.error("Error al cargar niveles:", error));
    }
  }, [profesorId]);

  const manejarCrearClase = (fechas) => {
    setFechasSeleccionadas(fechas);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setFechasSeleccionadas([]);
  };

  return (
    <>
      <NavbarProfesor profesorId={profesorId} />

      <div className="p-6 max-w-7xl mx-auto bg-gray-50 shadow-lg rounded-b-3xl ">
        {profesor ? (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Perfil del profesor a la izquierda */}
            <div>
              <PerfilProfesorInfo profesor={profesor} />
            </div>

            {/* Clases reservadas a la derecha */}
            <div>
              <ClasesReservadasProfesor profesorId={profesorId} />
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">Cargando perfil...</p>
        )}
      </div>

      {modalAbierto && (
        <ModalCrearClase
          fechasSeleccionadas={fechasSeleccionadas}
          profesorId={profesorId}
          materias={materias}
          niveles={niveles}
          onClose={cerrarModal}
        />
      )}
    </>
  );
};

export default PerfilProfesor;
