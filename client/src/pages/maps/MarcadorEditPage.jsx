import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAPI } from "../../context/APIContext";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";

const MarcadorEditPage = () => {
  const { marcadores, media } = useAPI();
  const { getActualMarker, setActualMarker } = useData();
  const { isLogged } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [marcador, setMarcador] = useState(getActualMarker());
  const [lugar, setLugar] = useState(marcador?.lugar || "");
  const [imagen, setImagen] = useState(null);
  const [imagenURL, setImagenURL] = useState(marcador?.imagen || "");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!marcador) {
      const fetchMarcador = async () => {
        try {
          const response = await marcadores.getById(id);
          if (response.status >= 200 && response.status < 300) {
            setMarcador(response.data);
            setActualMarker(response.data);
            setLugar(response.data.lugar);
            setImagenURL(response.data.imagen);
          } else {
            setError("Error al obtener el marcador");
          }
        } catch (error) {
          setError("Error al obtener el marcador");
        }
      };
      fetchMarcador();
    }
  }, [id, marcador, marcadores, setActualMarker]);

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

  const handleUpdateMarcador = async () => {
    if (!isLogged()) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${lugar}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];

        const updatedMarcador = {
          ...marcador,
          lugar,
          lat: parseFloat(lat),
          lon: parseFloat(lon),
          imagen: imagenURL,
        };

        const marcadorResponse = await marcadores.update(marcador._id, updatedMarcador);
        if (marcadorResponse.status >= 200 && marcadorResponse.status < 300) {
          setActualMarker(updatedMarcador);
          navigate(`/marcadores/${marcador._id}`);
        } else {
          setError("Error al actualizar el marcador");
        }
      } else {
        setError("Dirección no encontrada");
      }
    } catch (error) {
      setError("Error al actualizar el marcador");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Editar Marcador</h1>
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
      <button className="btn btn-primary" onClick={handleUpdateMarcador} disabled={loading}>
        {loading ? "Actualizando..." : "Actualizar Marcador"}
      </button>
    </div>
  );
};

export default MarcadorEditPage;