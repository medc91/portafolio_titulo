// NavbarAlumno.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";

const NavbarAlumno = ({ alumnoId }) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-emerald-300 py-3 px-6 flex justify-between items-center shadow-lg">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img
          src={logo}
          alt="Aula Global"
          className="h-10 w-auto object-contain"
        />
        <span className="font-bold text-white text-lg tracking-wide">
          Aula Global
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm md:text-base">
        <button
          onClick={() => navigate(`/alumno/${alumnoId}`)}
          className="text-white px-3 py-1 rounded-lg hover:bg-emerald-400 transition"
        >
          🏠 Inicio
        </button>
        <button
          onClick={() => navigate(`/alumno/${alumnoId}/buscar-clases`)}
          className="text-white px-3 py-1 rounded-lg hover:bg-emerald-400 transition"
        >
          🔍 Buscar clases
        </button>
        <button
          onClick={() =>
            navigate(`/alumno/${alumnoId}/historial`, { state: { alumnoId } })
          }
          className="text-white px-3 py-1 rounded-lg hover:bg-emerald-400 transition"
        >
          📚 Historial
        </button>
        <button
          onClick={() => navigate("/login")}
          className="text-white px-3 py-1 rounded-lg hover:bg-emerald-400 transition"
        >
          🚪 Cerrar sesión
        </button>
      </div>
    </nav>
  );
};

export default NavbarAlumno;
