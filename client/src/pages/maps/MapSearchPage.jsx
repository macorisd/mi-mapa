import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAPI } from "../../context/APIContext";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";

const MapSearchPage = () => {
  const { marcadores } = useAPI();
  const { getUser } = useAuth();
  const [emailToSearch, setEmailToSearch] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [countries, setCountries] = useState([]);
  const [center, setCenter] = useState([51.505, -0.09]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const navigate = useNavigate();

  const markerIcon = new Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const getVisitedCountries = async (email) => {
    if (!email) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await marcadores.getByEmail(email);
      if (response.status >= 200 && response.status < 300) {
        setCountries(response.data);
        if (response.data.length > 0) {
          setCenter([response.data[0].lat, response.data[0].lon]);
        } else {
          setCenter([51.505, -0.09]); // Center map if no markers
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

  const handleSearch = () => {
    if (!emailToSearch) {
      setSearchError("Por favor, ingresa un email para buscar.");
      return;
    }

    setSearchError(null);
    setUserEmail(emailToSearch);
  };

  useEffect(() => {
    if (userEmail) {
      getVisitedCountries(userEmail);
    }
  }, [userEmail]);

  const MapCenter = () => {
    const map = useMap();

    useEffect(() => {
      map.setView(center, map.getZoom());
    }, [map, center]);

    return null;
  };

  const handleViewDetails = (id) => {
    navigate(`/marcadores/${id}`);
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Buscar Mapas de Usuario</h1>

      <div className="text-center mb-4">
        <input
          type="email"
          className="form-control mb-2"
          placeholder="Ingresa el email del usuario"
          value={emailToSearch}
          onChange={(e) => setEmailToSearch(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Buscar
        </button>
      </div>

      {searchError && <div className="text-center mt-3 text-danger">{searchError}</div>}

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
                      onClick={() => navigate(`/marcadores/${marcador._id}`)}
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

      {!isLoading && !errorMsg && countries.length === 0 && userEmail && (
        <div className="text-center mt-5">No se encontraron marcadores para este usuario.</div>
      )}

      {selectedMarker && (
        <div className="card mt-4 mx-auto" style={{ maxWidth: "500px", textAlign: "center" }}>
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
    </div>
  );
};

export default MapSearchPage;
