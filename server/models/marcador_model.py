from pydantic import BaseModel, Field

class Marcador(BaseModel):
    id: str = Field(default=None)
    lugar: str = Field(default=None)
    lat: float = Field(default=None)
    lon: float = Field(default=None)
    creador: str = Field(default=None)
    imagen: str = Field(default=None)

class MarcadorCreate(BaseModel):
    lugar: str = Field(default=None)
    lat: float = Field(default=None)
    lon: float = Field(default=None)
    creador: str = Field(default=None)
    imagen: str = Field(default=None)

class MarcadorUpdate(BaseModel):
    lugar: str | None = Field(default=None)
    lat: float | None = Field(default=None)
    lon: float | None = Field(default=None)
    creador: str | None = Field(default=None)
    imagen: str | None = Field(default=None)

class MarcadorDeleteResponse(BaseModel):
    details: str = "El lugar se ha eliminado correctamente."
