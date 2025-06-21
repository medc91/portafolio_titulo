// src/components/RegistroProfesor.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const RegistroProfesor = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    rut: "",
    dv: "",
    email: "",
    password: "",
    confirmarPassword: "",
    titulo: null,
  });

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "titulo") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (formData.password !== formData.confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const datos = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      datos.append(
        key === "confirmarPassword" ? "confirmar_password" : key,
        value
      );
    });

    try {
      const response = await axios.post(
        "http://localhost:8000/api/profesor/registro",
        datos
      );
      setMensaje("Registro exitoso. Redirigiendo...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setError(
        error.response?.data?.error || "Error al registrar. Intenta nuevamente."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans px-4">
      <form
        onSubmit={handleSubmit}
        data-aos="fade-up"
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200"
      >
        <div className="flex justify-center mb-4">
          <img
            src={logo}
            alt="Aula Global"
            className="h-20 max-w-[200px] w-full object-contain"
          />
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center text-emerald-600">
          Registro de Profesor
        </h2>

        {mensaje && (
          <p className="text-green-600 text-center mb-4 text-sm">{mensaje}</p>
        )}
        {error && (
          <p className="text-red-500 text-center mb-4 text-sm">{error}</p>
        )}

        <div className="flex gap-4 mb-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-1/2 border px-3 py-2 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            required
          />
          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            value={formData.apellido}
            onChange={handleChange}
            className="w-1/2 border px-3 py-2 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            required
          />
        </div>

        <div className="flex gap-4 mb-4">
          <input
            type="text"
            name="rut"
            placeholder="RUT"
            value={formData.rut}
            onChange={handleChange}
            className="w-2/3 border px-3 py-2 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            required
          />
          <input
            type="text"
            name="dv"
            placeholder="DV"
            value={formData.dv}
            onChange={handleChange}
            className="w-1/3 border px-3 py-2 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            required
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="Correo"
          value={formData.email}
          onChange={handleChange}
          className="w-full border px-3 py-2 mb-4 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          required
        />

        <input
          type={mostrarPassword ? "text" : "password"}
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          className="w-full border px-3 py-2 mb-4 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          required
        />

        <input
          type={mostrarPassword ? "text" : "password"}
          name="confirmarPassword"
          placeholder="Confirmar Contraseña"
          value={formData.confirmarPassword}
          onChange={handleChange}
          className="w-full border px-3 py-2 mb-4 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          required
        />

        <div className="flex items-center mb-4 text-sm">
          <input
            type="checkbox"
            id="mostrarPassword"
            checked={mostrarPassword}
            onChange={() => setMostrarPassword(!mostrarPassword)}
            className="mr-2"
          />
          <label htmlFor="mostrarPassword" className="text-gray-700">
            Mostrar contraseña
          </label>
        </div>

        {/* Título profesional (PDF) */}
        <label className="block text-sm mb-1 text-gray-600">
          Título profesional (PDF)
        </label>
        <div className="flex items-center gap-2 mb-6">
          <label
            htmlFor="titulo"
            className="cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white text-sm py-1.5 px-3 rounded-md shadow-md transition flex items-center gap-2"
          >
            <span className="text-lg">📂</span> Subir archivo
          </label>
          <span className="text-sm text-gray-700 truncate max-w-[160px]">
            {formData.titulo
              ? formData.titulo.name
              : "Ningún archivo seleccionado"}
          </span>
        </div>
        <input
          type="file"
          name="titulo"
          id="titulo"
          accept="application/pdf"
          onChange={handleChange}
          className="hidden"
          required
        />

        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-xl shadow-md transition flex items-center justify-center gap-2"
        >
          <span className="text-lg">✅</span> Registrarse
        </button>
      </form>
    </div>
  );
};

export default RegistroProfesor;
