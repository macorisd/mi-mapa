from datetime import datetime
from zoneinfo import ZoneInfo
from typing import List
from fastapi import APIRouter, HTTPException, Query, Request, Path
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

from bson.objectid import ObjectId
from models.visita_model import Visita, VisitaCreate, VisitaUpdate, VisitaDeleteResponse
from db_connection import DatabaseConnection
from api_utils import APIUtils

router = APIRouter()

endpoint_name = "visitas"
version = "v1"

@router.get("/" + endpoint_name, tags=["Visitas CRUD endpoints"], response_model=List[Visita])
async def get_visitas(
    request: Request,
    usuarioVisitado: str = Query(None, description="Email del usuario visitado"),
    usuarioVisitante: str = Query(None, description="Email del usuario visitante"),
    fields: str | None = Query(None, description="Campos específicos a devolver"),
    sort: str | None = Query(None, description="Campos por los que ordenar, separados por comas"),
    offset: int = Query(default=0, description="Índice de inicio para los resultados de la paginación"),
    limit: int = Query(default=30, description="Cantidad de visitas a devolver, por defecto 10")
):
    """Obtener todas las visitas con filtros opcionales."""

    APIUtils.check_accept_json(request)

    try:
        # Construir proyección, criterio de orden y paginación
        projection = APIUtils.build_projection(fields)
        sort_criteria = APIUtils.build_sort_criteria(sort)

        # Construir la consulta para los filtros opcionales
        query = {}
        if usuarioVisitado:
            query["usuarioVisitado"] = usuarioVisitado
        if usuarioVisitante:
            query["usuarioVisitante"] = usuarioVisitante

        visitas = DatabaseConnection.query_document(
            "visita", query, projection, sort_criteria, offset, limit, hasDate=True
        )

        total_count = DatabaseConnection.count_documents("visita", query)

        return JSONResponse(
            status_code=200,
            content=visitas,
            headers={"Accept-Encoding": "gzip", "X-Total-Count": str(total_count)}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al buscar las visitas: {str(e)}")

@router.post("/" + endpoint_name, tags=["Visitas CRUD endpoints"], response_model=Visita)
async def create_visita(request: Request, visita: VisitaCreate):
    """Crear una nueva visita."""

    APIUtils.check_content_type_json(request)

    try:
        visita_dict = visita.model_dump()
        visita_dict["timestamp"] = datetime.now(ZoneInfo("Europe/Madrid"))
        visita_dict['_id'] = DatabaseConnection.create_document("visita", visita_dict, hasDate=True)

        return JSONResponse(status_code=201, content=visita_dict,
                            headers={"Content-Type": "application/json"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear la visita: {str(e)}")

@router.put("/" + endpoint_name + "/{id}", tags=["Visitas CRUD endpoints"], response_model=Visita)
async def update_visita(request: Request, visita: VisitaUpdate, id: str = Path(description="ID de la visita")):
    """Actualizar una visita por su ID."""

    APIUtils.check_content_type_json(request)

    try:
        visita_dict = visita.model_dump()

        non_none_fields = {k: v for k, v in visita_dict.items() if v is not None}
        if not non_none_fields:
            return JSONResponse(status_code=422, content={"detail": "No has especificado ningún campo de la visita"})

        updated_document = DatabaseConnection.update_document_id("visita", id, non_none_fields)
        if updated_document is None:
            return JSONResponse(status_code=404, content={"detail": "No se ha encontrado una visita con ese ID. No se ha editado nada"})

        json_serializable_document = jsonable_encoder(updated_document)

        return JSONResponse(
            status_code=200,
            content={
                "detail": "La visita se ha editado correctamente",
                "result": json_serializable_document
            }
        )

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=f"Error de formato: {str(ve)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar la visita: {str(e)}")

@router.delete("/" + endpoint_name + "/{id}", tags=["Visitas CRUD endpoints"], response_model=VisitaDeleteResponse)
async def delete_visita(id: str = Path(description="ID de la visita")):
    """Eliminar una visita por su ID."""

    try:
        count = DatabaseConnection.delete_document_id("visita", id)
        if count == 0:
            return JSONResponse(status_code=404, content={"detail": "No se ha encontrado una visita con ese ID. No se ha borrado nada."})

        return JSONResponse(status_code=200, content={"details": "La visita se ha eliminado correctamente"},
                            headers={"Content-Type": "application/json"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar la visita: {str(e)}")
