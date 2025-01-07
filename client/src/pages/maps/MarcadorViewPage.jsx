import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useAPI } from "../../context/APIContext";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { Icon } from "leaflet";
import 'leaflet/dist/leaflet.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const MarcadorViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { marcadores } = useAPI();
  const { getActualMarker, setActualMarker } = useData();
  const { isLogged, getUser } = useAuth();
  const [marcador, setMarcador] = useState(getActualMarker());
  const [loading, setLoading] = useState(!marcador);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchMarcador = async () => {
      try {
        const response = await marcadores.getById(id);
        if (response.status >= 200 && response.status < 300) {
          setMarcador(response.data);
          setActualMarker(response.data);
        } else {
          setError("Error al obtener el marcador");
        }
      } catch (error) {
        setError("Error al obtener el marcador");
      } finally {
        setLoading(false);
      }
    };

    if (!marcador) {
      fetchMarcador();
    }
  }, [id, marcador, marcadores, setActualMarker]);

  const handleDeleteMarcador = async () => {
    try {
      const response = await marcadores.delete(id);
      if (response.status >= 200 && response.status < 300) {
        navigate("/mapa"); // Redirigir a la lista de marcadores
      } else {
        setError("Error al eliminar el marcador");
      }
    } catch (error) {
      setError("Error al eliminar el marcador");
    } finally {
      setShowModal(false); // Cerrar el modal
    }
  };

  const handleEditMarcador = () => {
    navigate(`/marcadores/${id}/edit`);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  const marcadorIcon = new Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const user = isLogged() ? getUser() : null;
  const isCreator = user && user.email === marcador.creador;

  return (
    <div className="container py-5">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>Volver</button>
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h1 className="card-title mb-4">{marcador.lugar}</h1>
          {isCreator && (
            <div className="mb-3">
              <button className="btn btn-primary me-2" onClick={handleEditMarcador}>Editar</button>
              <button className="btn btn-danger" onClick={() => setShowModal(true)}>Eliminar</button>
            </div>
          )}
          <p className="card-text"><strong>Latitud:</strong> {marcador.lat}</p>
          <p className="card-text"><strong>Longitud:</strong> {marcador.lon}</p>
          <p className="card-text"><strong>Creador:</strong> {marcador.creador}</p>
          <div className="mb-4">
            <img src={marcador.imagen || "https://via.placeholder.com/400x250"} alt={marcador.lugar} className="img-fluid" />
          </div>
          <div className="mb-4">
            <MapContainer center={[marcador.lat, marcador.lon]} zoom={13} style={{ height: "400px", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[marcador.lat, marcador.lon]} icon={marcadorIcon}>
                <Popup>{marcador.lugar}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>

      {/* Modal de confirmación para eliminar el marcador */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que deseas eliminar este marcador?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteMarcador}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MarcadorViewPage;
