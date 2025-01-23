from datetime import datetime
from typing import List
from fastapi import APIRouter, HTTPException, Query, Request, Path
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

from bson.objectid import ObjectId
from models.marcador_model import Marcador, MarcadorCreate, MarcadorUpdate, MarcadorDeleteResponse
from db_connection import DatabaseConnection
from api_utils import APIUtils

router = APIRouter()

endpoint_name = "marcadores"
version = "v1"

@router.get("/" + endpoint_name, tags=["Marcadores CRUD endpoints"], response_model=List[Marcador])
async def get_marcadores(
    request: Request,
    creador: str = Query(None, description="Email del creador"),
    lugar: str = Query(None, description="Lugar asociado al marcador"),
    fields: str | None = Query(None, description="Campos específicos a devolver"),
    sort: str | None = Query(None, description="Campos por los que ordenar, separados por comas"),
    offset: int = Query(default=0, description="Índice de inicio para los resultados de la paginación"),
    limit: int = Query(default=10, description="Cantidad de marcadores a devolver, por defecto 10")
):
    """Obtener todos los marcadores con filtros opcionales."""

    APIUtils.check_accept_json(request)

    try:
        # Construir proyección, criterio de orden y paginación
        projection = APIUtils.build_projection(fields)
        sort_criteria = APIUtils.build_sort_criteria(sort)

        # Construir la consulta para los filtros opcionales
        query = {}
        if creador:
            query["creador"] = creador
        if lugar:
            APIUtils.add_regex(query, "lugar", lugar)

        marcadores = DatabaseConnection.query_document(
            "marcador", query, projection, sort_criteria, offset, limit
        )

        total_count = DatabaseConnection.count_documents("marcador", query)

        return JSONResponse(
            status_code=200,
            content=marcadores,
            headers={"Accept-Encoding": "gzip", "X-Total-Count": str(total_count)}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al buscar los marcadores: {str(e)}")

@router.get("/" + endpoint_name + "/{id}", tags=["Marcadores CRUD endpoints"], response_model=Marcador)
async def get_marcador_by_id(request: Request, id: str = Path(description="ID del marcador")):
    """Obtener un marcador por su ID."""

    APIUtils.check_accept_json(request)

    try:
        marcador = DatabaseConnection.read_document_id("marcador", id)
        if marcador is None:
            return JSONResponse(status_code=404, content={"detail": f"Marcador con ID {id} no encontrado"})

        return JSONResponse(status_code=200, content=marcador,
                            headers={"Content-Type": "application/json", "X-Total-Count": "1"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener el marcador: {str(e)}")

@router.post("/" + endpoint_name, tags=["Marcadores CRUD endpoints"], response_model=Marcador)
async def create_marcador(request: Request, marcador: MarcadorCreate):
    """Crear un nuevo marcador."""

    APIUtils.check_content_type_json(request)

    try:
        marcador_dict = marcador.model_dump()
        marcador_dict['_id'] = DatabaseConnection.create_document("marcador", marcador_dict)

        return JSONResponse(status_code=201, content=marcador_dict,
                            headers={"Content-Type": "application/json"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear el marcador: {str(e)}")

@router.put("/" + endpoint_name + "/{id}", tags=["Marcadores CRUD endpoints"], response_model=Marcador)
async def update_marcador(request: Request, marcador: MarcadorUpdate, id: str = Path(description="ID del marcador")):
    """Actualizar un marcador por su ID."""

    APIUtils.check_content_type_json(request)

    try:
        marcador_dict = marcador.model_dump()

        non_none_fields = {k: v for k, v in marcador_dict.items() if v is not None}
        if not non_none_fields:
            return JSONResponse(status_code=422, content={"detail": "No has especificado ningún campo del marcador"})

        updated_document = DatabaseConnection.update_document_id("marcador", id, non_none_fields)
        if updated_document is None:
            return JSONResponse(status_code=404, content={"detail": "No se ha encontrado un marcador con ese ID. No se ha editado nada"})

        json_serializable_document = jsonable_encoder(updated_document)

        return JSONResponse(
            status_code=200,
            content={
                "detail": "El marcador se ha editado correctamente",
                "result": json_serializable_document
            }
        )

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=f"Error de formato: {str(ve)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar el marcador: {str(e)}")

@router.delete("/" + endpoint_name + "/{id}", tags=["Marcadores CRUD endpoints"], response_model=MarcadorDeleteResponse)
async def delete_marcador(id: str = Path(description="ID del marcador")):
    """Eliminar un marcador por su ID."""

    try:
        count = DatabaseConnection.delete_document_id("marcador", id)
        if count == 0:
            return JSONResponse(status_code=404, content={"detail": "No se ha encontrado un marcador con ese ID. No se ha borrado nada."})

        return JSONResponse(status_code=200, content={"details": "El marcador se ha eliminado correctamente"},
                            headers={"Content-Type": "application/json"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar el marcador: {str(e)}")
