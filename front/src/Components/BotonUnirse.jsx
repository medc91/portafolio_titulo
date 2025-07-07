import React, { useState } from "react";
import JitsiModal from "./JitsiModal";
import ModalEvaluacion from "./ModalEvaluacion";

const BotonUnirse = ({
  videollamadaId,
  reservaId,
  evaluador,
  nombreUsuario,
}) => {
  const [modalJitsi, setModalJitsi] = useState(false);
  const [modalEvaluacion, setModalEvaluacion] = useState(false);

  const iniciarLlamada = () => {
    setModalJitsi(true);
  };

  const cerrarLlamada = () => {
    setModalJitsi(false);
    // Al cerrar la llamada, mostramos la evaluación
    setModalEvaluacion(true);
  };

  const cerrarEvaluacion = () => {
    setModalEvaluacion(false);
  };

  return (
    <>
      <button
        onClick={iniciarLlamada}
        className="bg-emerald-400 hover:bg-emerald-500 text-white font-semibold px-5 py-2 rounded-lg shadow transition-all duration-300"
      >
        Unirse
      </button>

      {modalJitsi && (
        <JitsiModal
          roomName={`Tutoria${videollamadaId}`}
          userDisplayName={nombreUsuario || "Usuario"}
          onClose={cerrarLlamada}
        />
      )}

      <ModalEvaluacion
        isOpen={modalEvaluacion}
        onClose={cerrarEvaluacion}
        reservaId={reservaId}
        evaluador={evaluador}
      />
    </>
  );
};

export default BotonUnirse;
