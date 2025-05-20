import React from "react";
import { useNavigate } from "react-router-dom";

function Inicio() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-10">Bienvenido</h1>

      <button
        onClick={() => navigate("/registro-alumno")}
        className="mb-4 px-6 py-3 bg-pink-300 text-white rounded-xl shadow-md hover:bg-pink-400 transition"
      >
        Registrar Alumno
      </button>

      <button
        onClick={() => navigate("/registro-profesor")}
        className="mb-4 px-6 py-3 bg-pink-300 text-white rounded-xl shadow-md hover:bg-pink-400 transition"
      >
        Registrar Profesor
      </button>

      <button
        onClick={() => navigate("/login")}
        className="px-6 py-3 bg-pink-300 text-white rounded-xl shadow-md hover:bg-pink-400 transition"
      >
        Iniciar Sesión
      </button>
    </div>
  );
}

export default Inicio;
