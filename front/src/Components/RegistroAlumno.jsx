import React, { useState } from "react";
import axios from "axios";

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/alumnos/registro/", formData);
      alert("Registro exitoso");
      setFormData({
        nombre: "",
        apellido: "",
        rut: "",
        dv: "",
        correo: "",
        password: "",
        confirmar_password: "",
      });
    } catch (error) {
      console.error(error.response.data);
      alert("Error en el registro");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 mt-10 rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Registro de Alumno</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { name: "nombre", label: "Nombre" },
          { name: "apellido", label: "Apellido" },
          { name: "rut", label: "RUT" },
          { name: "dv", label: "Dígito Verificador" },
          { name: "correo", label: "Correo", type: "email" },
          {
            name: "password",
            label: "Contraseña",
            type: mostrarPassword ? "text" : "password",
          },
          {
            name: "confirmar_password",
            label: "Confirmar Contraseña",
            type: mostrarPassword ? "text" : "password",
          },
        ].map(({ name, label, type = "text" }) => (
          <div key={name}>
            <label className="block text-gray-700">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              placeholder={label}
              className="w-full border px-3 py-2 rounded-lg text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        ))}

        <div className="flex items-center">
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

        <button
          type="submit"
          className="w-full bg-pink-300 text-white py-2 rounded-lg shadow-md hover:bg-pink-400 transition"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default RegistroAlumno;
