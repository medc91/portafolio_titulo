import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/images/logo.png";

const VerificarCodigo = () => {
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const correo = location.state?.correo || "";

  useEffect(() => {
    if (!correo) {
      navigate("/recuperar-contraseña");
    }
  }, [correo, navigate]);

  const handleVerificar = async (e) => {
    e.preventDefault();
    setError("");

    if (!codigo.trim()) {
      setError("Por favor, ingresa el código.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/api/verificar-codigo/",
        { correo, codigo }
      );

      if (res.status === 200) {
        navigate("/nueva-contraseña", { state: { correo, codigo } });
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Error al verificar el código. Intenta nuevamente."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
      <form
        onSubmit={handleVerificar}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200"
      >
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src={logo}
            alt="Aula Global"
            className="h-20 max-w-[200px] w-full object-contain"
          />
        </div>

        <h2 className="text-2xl font-bold mb-4 text-center text-emerald-600">
          Verificar Código
        </h2>

        <p className="mb-4 text-sm text-gray-600 text-center">
          Revisa tu correo y escribe el código de verificación:
        </p>

        {error && (
          <p className="text-red-500 mb-4 text-center text-sm">{error}</p>
        )}

        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Código"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 placeholder-gray-500"
          required
        />

        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold w-full py-2 rounded-xl shadow-md transition"
        >
          Verificar Código
        </button>
      </form>
    </div>
  );
};

export default VerificarCodigo;
