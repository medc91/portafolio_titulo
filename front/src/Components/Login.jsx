import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/api/login/",
        formData
      );

      const { tipo_usuario } = response.data;

      if (tipo_usuario === "alumno") {
        navigate("/inicio-alumno");
      } else if (tipo_usuario === "profesor") {
        navigate("/inicio-profesor");
      } else {
        setMensaje("Tipo de usuario no reconocido.");
      }
    } catch (error) {
      setMensaje(
        "Error al iniciar sesión: " + JSON.stringify(error.response?.data || {})
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-center">Iniciar Sesión</h2>
      {mensaje && (
        <p className="text-red-600 text-center mb-4 text-sm">{mensaje}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          onChange={handleChange}
          className="w-full p-2 border rounded text-black placeholder-black"
          required
        />
        <input
          type={mostrarPassword ? "text" : "password"}
          name="password"
          placeholder="Contraseña"
          onChange={handleChange}
          className="w-full p-2 border rounded text-black placeholder-black"
          required
        />
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            onChange={() => setMostrarPassword(!mostrarPassword)}
          />
          <label className="text-sm text-black">Mostrar contraseña</label>
        </div>
        <button
          type="submit"
          className="w-full bg-pink-300 text-white font-semibold py-2 rounded shadow-md hover:bg-pink-400 transition"
        >
          Iniciar sesión
        </button>
        <p className="text-sm text-center mt-4">
          ¿Olvidaste tu contraseña?{" "}
          <a href="/recupera-contraseña" className="text-pink-500 underline">
            Recuperarla
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
