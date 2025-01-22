from pydantic import BaseModel, Field
from datetime import datetime

class Visita(BaseModel):
    usuarioVisitado: str = Field(default=None, description="Email del usuario visitado")
    usuarioVisitante: str = Field(default=None, description="Email del usuario visitante")
    oauthToken: str = Field(default=None, description="Token de autenticación OAuth")
    timestamp: str = Field(default=datetime.now().isoformat(), description="Fecha y hora de la visita en formato ISO")

class VisitaCreate(BaseModel):
    usuarioVisitado: str = Field(default=None, description="Email del usuario visitado")
    usuarioVisitante: str = Field(default=None, description="Email del usuario visitante")
    oauthToken: str = Field(default=None, description="Token de autenticación OAuth")

class VisitaUpdate(BaseModel):
    usuarioVisitado: str | None = Field(None, description="Email del usuario visitado")
    usuarioVisitante: str | None = Field(None, description="Email del usuario visitante")
    oauthToken: str | None = Field(None, description="Token de autenticación OAuth")

class VisitaDeleteResponse(BaseModel):
    details: str = "Mensaje de confirmación de la eliminación"
