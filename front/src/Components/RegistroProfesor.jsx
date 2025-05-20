// RegistroProfesor.jsx
import React, { useState } from "react";
import axios from "axios";

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
    const datos = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "confirmarPassword") {
        datos.append("confirmar_password", value); // nombre que espera el backend
      } else {
        datos.append(key, value);
      }
    });

    try {
      const response = await axios.post(
        "http://localhost:8000/api/profesor/registro",
        datos
      );
      setMensaje(response.data.mensaje);
    } catch (error) {
      setMensaje("Error al registrar: " + JSON.stringify(error.response.data));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Registro de Profesor
      </h2>
      {mensaje && <p className="text-center text-sm mb-4">{mensaje}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {["nombre", "apellido", "rut", "dv", "email"].map((campo) => (
          <input
            key={campo}
            name={campo}
            placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
            onChange={handleChange}
            className="w-full p-2 border rounded text-black placeholder-black"
            required
          />
        ))}
        <input
          type={mostrarPassword ? "text" : "password"}
          name="password"
          placeholder="Contraseña"
          onChange={handleChange}
          className="w-full p-2 border rounded text-black placeholder-black"
          required
        />
        <input
          type={mostrarPassword ? "text" : "password"}
          name="confirmarPassword"
          placeholder="Confirmar Contraseña"
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
        <label className="text-sm">Título formato PDF</label>
        <input
          type="file"
          name="titulo"
          accept="application/pdf"
          onChange={handleChange}
          className="w-full"
        />
        <button
          type="submit"
          className="w-full bg-pink-300 text-white font-semibold py-2 rounded shadow-md hover:bg-pink-400 transition"
        >
          Registrar
        </button>
      </form>
    </div>
  );
};

export default RegistroProfesor;
