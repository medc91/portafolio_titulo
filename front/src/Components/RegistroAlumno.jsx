import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../assets/images/logo.png";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";

const RegistroAlumno = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    rut: "",
    dv: "",
    correo: "",
    password: "",
    confirmar_password: "",
  });

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (formData.password !== formData.confirmar_password) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/alumnos/registro/", formData);
      setMensaje("✅ Registro exitoso. Redirigiendo al login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error(error.response?.data);
      setError("❌ Error en el registro. Verifica los datos ingresados.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans px-4">
      <form
        onSubmit={handleSubmit}
        data-aos="fade-up"
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
          Registro de Alumno
        </h2>

        {/* Mensajes */}
        {mensaje && (
          <p className="text-green-600 text-center mb-4 text-sm">{mensaje}</p>
        )}
        {error && (
          <p className="text-red-500 text-center mb-4 text-sm">{error}</p>
        )}

        {/* Nombre y Apellido */}
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

        {/* RUT y DV */}
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

        {/* Correo */}
        <input
          type="email"
          name="correo"
          placeholder="Correo"
          value={formData.correo}
          onChange={handleChange}
          className="w-full border px-3 py-2 mb-4 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          required
        />

        {/* Contraseña */}
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
          name="confirmar_password"
          placeholder="Confirmar Contraseña"
          value={formData.confirmar_password}
          onChange={handleChange}
          className="w-full border px-3 py-2 mb-4 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          required
        />

        {/* Mostrar contraseña */}
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

        {/* Botón con ícono 📥 */}
        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-xl shadow-md transition flex items-center justify-center gap-2"
        >
          <span className="text-lg">📥</span> Registrarse
        </button>
      </form>
    </div>
  );
};

export default RegistroAlumno;
