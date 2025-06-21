import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useParams, useLocation } from "react-router-dom";
import { useEffect } from "react";
import RegistroAlumno from "./Components/RegistroAlumno";
import RegistroProfesor from "./Components/RegistroProfesor";
import Login from "./Components/Login";
import PerfilProfesor from "./Components/ProfesorPerfil";
import PerfilAlumno from "./Components/PerfilAlumno";
import VerificarCodigo from "./Components/VerificarCodigo";
import NuevaContrasena from "./Components/NuevaContrasena";
import RecuperarContrasena from "./Components/RecuperarContrasena";
import OneSignalInitializer from "./Components/OneSignalInitializer";
import BuscarClasesDisponibles from "./Components/BuscarClase";
import HistorialClases from "./Components/HistorialClases";
import CrearClase from "./Components/CrearClase";
import HistorialClasesProfesor from "./Components/HistorialClasesProfesor";
import PagosProfesor from "./Components/PagosProfesor";
import AOS from "aos";
import "aos/dist/aos.css";
import HomePage from "./Components/HomePage";

const PerfilProfesorWrapper = () => {
  const { id } = useParams(); // 👈 obtenemos el id desde la URL

  return <PerfilProfesor profesorId={id} />;
};

const PerfilAlumnoWrapper = () => {
  const { id } = useParams();
  return <PerfilAlumno alumnoId={id} />;
};

const HistorialClasesWrapper = () => {
  const { alumnoId: paramId } = useParams();
  const location = useLocation();

  const alumnoId = location.state?.alumnoId || paramId;

  return <HistorialClases alumnoId={alumnoId} />;
};

const HistorialClasesProfesorWrapper = () => {
  const { id } = useParams();
  return <HistorialClasesProfesor profesorId={id} />;
};

const PagosProfesorWrapper = () => {
  const { id } = useParams();
  return <PagosProfesor profesorId={id} />;
};

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // duración de las animaciones en ms
      once: true, // true = animar solo la primera vez
    });
  }, []);

  return (
    <>
      <OneSignalInitializer /> {/* 👈 se ejecuta al inicio */}
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/registro-alumno" element={<RegistroAlumno />} />
          <Route path="/registro-profesor" element={<RegistroProfesor />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profesor/:id" element={<PerfilProfesorWrapper />} />
          <Route path="/alumno/:id" element={<PerfilAlumnoWrapper />} />
          <Route
            path="/alumno/:alumnoId/buscar-clases"
            element={<BuscarClasesDisponibles />}
          />
          <Route path="/verificar-codigo" element={<VerificarCodigo />} />
          <Route path="/nueva-contraseña" element={<NuevaContrasena />} />
          <Route
            path="/recuperar-contraseña"
            element={<RecuperarContrasena />}
          />
          <Route
            path="/alumno/:alumnoId/historial"
            element={<HistorialClasesWrapper />}
          />
          <Route path="/profesor/:id/crear-clase" element={<CrearClase />} />
          <Route
            path="/profesor/:id/historial"
            element={<HistorialClasesProfesorWrapper />}
          />
          <Route
            path="/profesor/:id/pagos"
            element={<PagosProfesorWrapper />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
