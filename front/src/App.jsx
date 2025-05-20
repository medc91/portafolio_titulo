import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//componentes
import Inicio from "./Components/Inicio";
import RegistroAlumno from "./Components/RegistroAlumno";
import RegistroProfesor from "./Components/RegistroProfesor";
import Login from "./Components/Login";
import BotonApi from "./Components/botonApi";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/registro-alumno" element={<RegistroAlumno />} />
        <Route path="/registro-profesor" element={<RegistroProfesor />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
