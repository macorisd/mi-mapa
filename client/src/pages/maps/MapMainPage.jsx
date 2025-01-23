import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAPI } from "../../context/APIContext";
import { useData } from "../../context/DataContext";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";

const MapMainPage = () => {
  const { getUser } = useAuth();
  const { marcadores, visitas } = useAPI();
  const [countries, setCountries] = useState([]);
  const [center, setCenter] = useState([51.505, -0.09]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [visits, setVisits] = useState([]);
  const { setActualMarker } = useData();
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
      const response = await marcadores.getAll("?creador=" + userEmail);
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

  const getVisitsToMyMap = async () => {
    if (!userEmail) return;

    try {
      const response = await visitas.getAll("?usuarioVisitado=" + userEmail);
      if (response.status >= 200 && response.status < 300) {
        setVisits(response.data);
      } else {
        setErrorMsg("Error al obtener las visitas al mapa.");
      }
    } catch (error) {
      setErrorMsg("Hubo un problema al obtener las visitas.");
    }
  };

  useEffect(() => {
    getUserEmail();
  }, []);

  useEffect(() => {
    if (userEmail) {
      getVisitedCountries();
      getVisitsToMyMap();
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

  const handleViewDetails = (id) => {
    setActualMarker(selectedMarker);
    navigate(`/marcadores/${id}`);
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
            {countries.map((marcador) => (
              <Marker
                key={marcador._id}
                position={[marcador.lat, marcador.lon]}
                icon={markerIcon}
                eventHandlers={{
                  click: () => setSelectedMarker(marcador),
                }}
              >
                <Popup>
                  <div>
                    <p>{marcador.lugar}</p>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleViewDetails(selectedMarker._id)}
                    >
                      Ver Detalles
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      {!isLoading && !errorMsg && countries.length === 0 && (
        <div className="text-center mt-5">No se encontraron países visitados.</div>
      )}

      {selectedMarker && (
        <div
          className="card mt-4 mx-auto"
          style={{ maxWidth: "500px", textAlign: "center" }}
        >
          <h2 className="text-center mt-4">Marcador seleccionado:</h2>
          <div className="card-body">
            <h3 className="card-title">{selectedMarker.lugar}</h3>
            {selectedMarker.imagen && (
              <img
                src={selectedMarker.imagen}
                alt={selectedMarker.lugar}
                className="img-fluid mb-3"
                style={{ maxWidth: "400px", margin: "0 auto", display: "block" }}
              />
            )}
            <button
              className="btn btn-primary"
              onClick={() => handleViewDetails(selectedMarker._id)}
            >
              Ver Detalles
            </button>
          </div>
        </div>
      )}

      <div className="mt-5">
        <h2 className="text-center mb-4">Visitas a mi mapa</h2>
        {visits.length > 0 ? (
          <table className="table table-striped text-center">
            <thead>
              <tr>
                <th>Usuario Visitante</th>
                <th>Token OAuth</th>
                <th>Fecha y Hora</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((visit) => (
                <tr key={visit._id}>
                  <td>{visit.usuarioVisitante}</td>
                  <td>{visit.oauthToken ? `${visit.oauthToken.substring(0, 40)}...` : "No disponible"}</td>
                  <td>{new Date(visit.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center">No hay visitas registradas a tu mapa.</p>
        )}
      </div>
    </div>
  );
};

export default MapMainPage;
