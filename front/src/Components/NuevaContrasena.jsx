import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";

const NuevaContrasena = () => {
  const [nuevaContraseña, setNuevaContraseña] = useState("");
  const [confirmarContraseña, setConfirmarContraseña] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const correo = location.state?.correo || "";
  const codigo = location.state?.codigo || "";

  useEffect(() => {
    if (!correo || !codigo) {
      navigate("/recuperar-contraseña");
    }
  }, [correo, codigo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (nuevaContraseña.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (nuevaContraseña !== confirmarContraseña) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/api/restablecer-contraseña/",
        {
          correo,
          codigo,
          nueva_contraseña: nuevaContraseña,
        }
      );

      if (res.status === 200) {
        setMensaje("Contraseña restablecida con éxito.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Error al restablecer la contraseña. Intenta nuevamente."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
      <form
        onSubmit={handleSubmit}
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

        <h2 className="text-2xl font-bold mb-6 text-center text-emerald-600">
          Restablecer Contraseña
        </h2>

        {mensaje && (
          <p className="text-green-600 text-center mb-4 text-sm">{mensaje}</p>
        )}
        {error && (
          <p className="text-red-500 text-center mb-4 text-sm">{error}</p>
        )}

        <input
          type="password"
          placeholder="Nueva contraseña"
          value={nuevaContraseña}
          onChange={(e) => setNuevaContraseña(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 placeholder-gray-500"
          required
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmarContraseña}
          onChange={(e) => setConfirmarContraseña(e.target.value)}
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 placeholder-gray-500"
          required
        />

        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold w-full py-2 rounded-xl shadow-md transition"
        >
          Cambiar Contraseña
        </button>
      </form>
    </div>
  );
};

export default NuevaContrasena;
