import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/images/logo.png"; // Asegúrate de que esta ruta es correcta

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:8000/api/login/", {
        email,
        password,
      });

      const { tipo_usuario, id } = res.data;

      if (window.OneSignalDeferred) {
        window.OneSignalDeferred.push(async function (OneSignal) {
          const externalId =
            tipo_usuario === "profesor" ? `profesor_${id}` : `alumno_${id}`;
          try {
            await OneSignal.setExternalUserId(externalId);
            console.log("OneSignal ID asignado:", externalId);
          } catch (err) {
            console.warn("Error asignando externalUserId en OneSignal:", err);
          }
        });
      }

      if (tipo_usuario === "profesor") {
        navigate(`/profesor/${id}`);
      } else if (tipo_usuario === "alumno") {
        navigate(`/alumno/${id}`);
      } else {
        setError("Tipo de usuario no reconocido.");
      }
    } catch (err) {
      setError("Credenciales incorrectas o error del servidor.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200"
      >
        {/* Logo centrado */}
        <div className="flex justify-center mb-4">
          <img
            src={logo}
            alt="Aula Global"
            className="h-38 max-w-[200px] w-full object-contain"
          />
        </div>

        <h2 className="text-3xl font-bold mb-6 text-center text-emerald-600">
          Iniciar Sesión
        </h2>

        {error && (
          <p className="text-red-500 mb-4 text-center text-sm">{error}</p>
        )}

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 placeholder-gray-500"
        />

        <input
          type={mostrarPassword ? "text" : "password"}
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 placeholder-gray-500"
        />

        <div className="flex items-center mb-4 text-sm">
          <input
            type="checkbox"
            checked={mostrarPassword}
            onChange={() => setMostrarPassword(!mostrarPassword)}
            className="mr-2"
          />
          <label>Mostrar contraseña</label>
        </div>

        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold w-full py-2 rounded-xl shadow-md transition"
        >
          Iniciar Sesión
        </button>

        <div className="text-center mt-4">
          <Link
            to="/verificar-codigo"
            className="text-sm text-emerald-500 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
