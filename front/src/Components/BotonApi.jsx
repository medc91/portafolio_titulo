import React, { useState } from "react";
import axios from "axios";

function BotonApi() {
  const [fetchData, setFetchData] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  const [axiosData, setAxiosData] = useState(null);
  const [axiosError, setAxiosError] = useState(null);

  // Función con fetch
  const handleFetchClick = () => {
    fetch("http://localhost:8000/api/crear-videollamada/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error en fetch");
        return res.json();
      })
      .then((data) => {
        setFetchData(data);
        setFetchError(null);

        // ✅ Solo aquí puedes usar `data`
        if (data.success && data.url) {
          window.location.href = "https://" + data.url;
        }
      })
      .catch((err) => {
        setFetchError(err.message);
        setFetchData(null);
      });
  };
  // Función con axios
  const handleAxiosClick = () => {
    axios
      .post("http://localhost:8000/api/crear-videollamada/") // Cambia por tu API real
      .then((res) => {
        setAxiosData(res.data);
        setAxiosError(null);
      })
      .catch((err) => {
        setAxiosError(err.message);
        setAxiosData(null);
      });
  };

  return (
    <div>
      <h2>Consumir API con fetch</h2>
      <button onClick={handleFetchClick}>Consulta con fetch</button>
      {fetchError && <p style={{ color: "red" }}>Error: {fetchError}</p>}
      {fetchData && <pre>{JSON.stringify(fetchData, null, 2)}</pre>}

      <hr />

      <h2>Consumir API con axios</h2>
      <button onClick={handleAxiosClick}>Consulta con axios</button>
      {axiosError && <p style={{ color: "red" }}>Error: {axiosError}</p>}
      {axiosData && <pre>{JSON.stringify(axiosData, null, 2)}</pre>}
    </div>
  );
}

export default BotonApi;
