import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAPI } from "../../context/APIContext";
import { useAuth } from "../../context/AuthContext";

const MarcadorCreatePage = () => {
  const { marcadores, media } = useAPI();
  const { isLogged, getUser } = useAuth();
  const navigate = useNavigate();
  const [lugar, setLugar] = useState("");
  const [imagen, setImagen] = useState(null);
  const [imagenURL, setImagenURL] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await media.create(formData);
      if (response.status >= 200 && response.status < 300) {
        setImagenURL(response.data.result.url);
      } else {
        setError("Error al subir la imagen");
      }
    } catch (error) {
      setError("Error al subir la imagen");
    }
  };

  const handleCreateMarcador = async () => {
    if (!isLogged()) {
      setError("Debes estar logueado para crear un marcador");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Obtener lat y lon de OpenStreetMap
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${lugar}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const user = getUser();

        const newMarcador = {
          lugar,
          lat: parseFloat(lat),
          lon: parseFloat(lon),
          creador: user.email,
          imagen: imagenURL,
        };

        const marcadorResponse = await marcadores.create(newMarcador);
        if (marcadorResponse.status >= 200 && marcadorResponse.status < 300) {
          navigate("/home");
        } else {
          setError("Error al crear el marcador");
        }
      } else {
        setError("Dirección no encontrada");
      }
    } catch (error) {
      setError("Error al crear el marcador");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Crear Marcador</h1>
      <div className="mb-3">
        <label className="form-label">Lugar</label>
        <input
          type="text"
          className="form-control"
          value={lugar}
          onChange={(e) => setLugar(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Imagen del Lugar</label>
        <input
          type="file"
          className="form-control"
          onChange={(e) => {
            setImagen(e.target.files[0]);
            handleImageUpload(e.target.files[0]);
          }}
        />
        {imagenURL && (
          <img
            src={imagenURL}
            alt="Previsualización Imagen del Lugar"
            className="img-thumbnail mt-3"
            style={{ maxHeight: "200px" }}
          />
        )}
      </div>
      {error && <div className="text-danger mb-3">{error}</div>}
      <button className="btn btn-primary" onClick={handleCreateMarcador} disabled={loading}>
        {loading ? "Creando..." : "Crear Marcador"}
      </button>
    </div>
  );
};

export default MarcadorCreatePage;