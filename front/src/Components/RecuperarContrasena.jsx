import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";

const RecuperarContrasena = () => {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEnviarCodigo = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    try {
      const res = await axios.post("http://localhost:8000/api/enviar-codigo/", {
        correo,
      });

      if (res.status === 200) {
        setMensaje("Código enviado. Revisa tu correo.");
        setTimeout(() => {
          navigate("/verificar-codigo", { state: { correo } });
        }, 2000);
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Error al enviar el código. Verifica el correo ingresado."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
      <form
        onSubmit={handleEnviarCodigo}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200"
      >
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src={logo}
            alt="Aula Global"
            className="h-30 max-w-[200px] w-full object-contain"
          />
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center text-emerald-600">
          Recuperar Contraseña
        </h2>

        {mensaje && (
          <p className="text-green-600 text-center mb-4 text-sm">{mensaje}</p>
        )}
        {error && (
          <p className="text-red-500 text-center mb-4 text-sm">{error}</p>
        )}

        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 placeholder-gray-500"
          required
        />

        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold w-full py-2 rounded-xl shadow-md transition"
        >
          Enviar Código
        </button>
      </form>
    </div>
  );
};

export default RecuperarContrasena;
