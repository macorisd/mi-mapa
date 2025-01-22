import { useNavigate } from "react-router-dom";

const Page404 = () => {

    const navigate = useNavigate();

    return <div className="d-flex flex-column align-items-center justify-content-center text-center vh-100">
        <h1>Ups... ha ocurrido un error <i className="bi bi-exclamation-circle" style={{color: "red"}}></i></h1>
        <hr className="text-black w-md-25 w-75" />
        <p>No hemos podido encontrar la página web que ha buscado :(</p>
        <button onClick={() => {navigate("/mapa")}} className="btn btn-secondary">Volver a inicio</button>
    </div>
}

export default Page404;