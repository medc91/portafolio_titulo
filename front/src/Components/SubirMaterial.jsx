import React, { useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8000";

const SubirMaterial = ({ reservaId }) => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [tipo, setTipo] = useState("PDF");
  const [archivo, setArchivo] = useState(null);
  const [link, setLink] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("reserva_id", reservaId);
    formData.append("descripcion", descripcion);

    if (tipo === "PDF" && archivo) {
      formData.append("archivo", archivo);
    } else if (tipo === "LINK" && link.trim()) {
      formData.append("link", link);
    } else {
      alert("Completa el campo correspondiente al tipo seleccionado.");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/material/subir/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Material subido correctamente");
      setMostrarFormulario(false);
      setArchivo(null);
      setLink("");
      setDescripcion("");
    } catch (error) {
      console.error("Error al subir material:", error);
      alert("Error al subir material.");
    }
  };

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setMostrarFormulario(!mostrarFormulario)}
        className="text-emerald-400 hover:text-emerald-500 text-sm font-semibold"
      >
        {mostrarFormulario ? "Ocultar formulario" : "Subir material"}
      </button>

      {mostrarFormulario && (
        <form
          onSubmit={handleSubmit}
          className="space-y-2 mt-2 border border-gray-200 rounded p-3 bg-gray-50"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <label className="text-sm font-medium">Tipo:</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="PDF">PDF</option>
              <option value="LINK">Link</option>
            </select>
          </div>

          {tipo === "PDF" && (
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setArchivo(e.target.files[0])}
              className="text-sm"
            />
          )}

          {tipo === "LINK" && (
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
              className="border rounded px-2 py-1 w-full text-sm"
            />
          )}

          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción (opcional)"
            rows={2}
            className="border rounded px-2 py-1 w-full text-sm"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-emerald-400 hover:bg-emerald-500 text-white text-sm px-4 py-1 rounded"
            >
              Subir
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SubirMaterial;
