import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavbarAlumno from "./NavbarAlumno";
import PerfilAlumnoInfo from "./PerfilAlumnoInfo";
import ClasesReservadas from "./ClasesReservadas";

const BASE_URL = "http://localhost:8000";

const PerfilAlumno = ({ alumnoId }) => {
  const [alumno, setAlumno] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchReservas = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/alumno/${alumnoId}/clases-reservadas/`
      );
      setReservas(res.data || []);
    } catch (error) {
      console.error("Error al obtener clases reservadas:", error);
    }
  };

  useEffect(() => {
    const fetchAlumno = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/alumno/${alumnoId}/`);
        setAlumno(response.data);
        await fetchReservas();
      } catch (err) {
        console.error("Error al obtener datos del alumno:", err);
        setError("No se pudo cargar la información del alumno.");
      } finally {
        setLoading(false);
      }
    };
    fetchAlumno();
  }, [alumnoId]);

  if (loading)
    return <p className="text-center text-gray-600 mt-4">Cargando perfil...</p>;
  if (error) return <p className="text-center text-red-500 mt-4">{error}</p>;
  if (!alumno)
    return (
      <p className="text-center text-gray-600 mt-4">
        No se encontró el alumno.
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <NavbarAlumno alumnoId={alumnoId} />

      <div className="max-w-6xl mx-auto p-4 sm:p-6 mt-6 space-y-6">
        <div className="grid md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-1">
            <PerfilAlumnoInfo alumnoId={alumnoId} />
          </div>
          <div className="md:col-span-2">
            <ClasesReservadas
              alumnoId={alumnoId}
              reservas={reservas}
              refrescarReservas={fetchReservas}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilAlumno;
