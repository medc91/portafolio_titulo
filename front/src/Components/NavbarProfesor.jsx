import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";

const NavbarProfesor = ({ profesorId }) => {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="bg-emerald-300 px-6 py-4 flex justify-between items-center shadow-md rounded-t-xl">
      <div className="flex items-center space-x-3">
        <img
          src={logo}
          alt="Aula Global"
          className="h-10 w-auto object-contain"
        />
        <span className="text-white font-bold text-xl">Aula Global</span>
      </div>

      {/* Enlaces */}
      <div className="flex space-x-4 items-center">
        <Link
          to={`/profesor/${profesorId}`}
          className="text-white hover:bg-emerald-400 px-4 py-2 rounded transition"
        >
          🏠 Inicio
        </Link>

        <Link
          to={`/profesor/${profesorId}/crear-clase`}
          className="text-white hover:bg-emerald-400 px-4 py-2 rounded transition"
        >
          📅 Crear Clase
        </Link>

        <Link
          to={`/profesor/${profesorId}/historial`}
          className="text-white hover:bg-emerald-400 px-4 py-2 rounded transition"
        >
          📚 Historial Clases
        </Link>

        <Link
          to={`/profesor/${profesorId}/pagos`}
          className="text-white hover:bg-emerald-400 px-4 py-2 rounded transition"
        >
          💰 Pagos
        </Link>

        <button
          onClick={cerrarSesion}
          className="bg-emerald-300 text-white hover:bg-emerald-400 px-4 py-2 rounded transition"
        >
          🚪 Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};

export default NavbarProfesor;
