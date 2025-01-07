import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAPI } from "../../context/APIContext";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";

const MapsMainPage = () => {
  const { getUser } = useAuth();
  const { marcadores } = useAPI();
  const [countries, setCountries] = useState([]);
  const [center, setCenter] = useState([51.505, -0.09]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  const markerIcon = new Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const getUserEmail = () => {
    const user = getUser();
    if (user && user.email) {
      setUserEmail(user.email);
    } else {
      setErrorMsg("Información del usuario no encontrada. Intenta iniciar sesión nuevamente.");
    }
  };

  const getVisitedCountries = async () => {
    if (!userEmail) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await marcadores.getByEmail(userEmail);
      if (response.status >= 200 && response.status < 300) {
        setCountries(response.data);
        if (response.data.length > 0) {
          setCenter([response.data[0].lat, response.data[0].lon]);
        }
      } else {
        setErrorMsg("Error al obtener los países visitados.");
      }
    } catch (error) {
      setErrorMsg("Hubo un problema al obtener los países.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserEmail();
  }, []);

  useEffect(() => {
    if (userEmail) {
      getVisitedCountries();
    }
  }, [userEmail]);

  const MapCenter = () => {
    const map = useMap();

    useEffect(() => {
      map.setView(center, map.getZoom());
    }, [map, center]);

    return null;
  };

  const navigateToCreatePage = () => {
    navigate("/marcadores/create");
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Países Visitados</h1>

      <div className="text-center mb-4">
        <button className="btn btn-success" onClick={navigateToCreatePage}>
          Añadir Marcador
        </button>
      </div>

      {isLoading && <div className="text-center mt-5">Cargando...</div>}
      {errorMsg && <div className="text-center mt-5 text-danger">{errorMsg}</div>}

      {!isLoading && !errorMsg && countries.length > 0 && (
        <div className="mb-4">
          <MapContainer center={center} zoom={5} style={{ height: "400px", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapCenter />
            {countries.map((country) => (
              <Marker key={country.id} position={[country.lat, country.lon]} icon={markerIcon}>
                <Popup>{country.nombre}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      {!isLoading && !errorMsg && countries.length === 0 && (
        <div className="text-center mt-5">No se encontraron países visitados.</div>
      )}
    </div>
  );
};

export default MapsMainPage;
