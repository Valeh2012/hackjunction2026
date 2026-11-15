"""Response models for the API."""

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class HealthResponse(BaseModel):
    status: Literal["ok"]


class Technique(BaseModel):
    id: str
    name: str
    description: str


class Span(BaseModel):
    """A detected technique in the analyzed text.

    `start` is inclusive and `end` is exclusive, so `text[start:end]` is the
    matched passage. Offsets count Unicode code points (Python string indices).
    """

    model_config = ConfigDict(populate_by_name=True)

    start: int = Field(ge=0)
    end: int = Field(ge=0)
    technique: str = Field(alias="techniqueName")
    technique_id: str = Field(alias="techniqueId")
    probability: float = Field(ge=0.0, le=1.0)
    band: Literal["detected", "possible"]


class ModelInfo(BaseModel):
    span_model: str
    classifier: str


class AnalyzeResponse(BaseModel):
    # "model_info" would otherwise clash with pydantic's protected "model_" prefix.
    model_config = ConfigDict(protected_namespaces=())

    request_id: str
    text: str
    spans: list[Span]
    warnings: list[str]
    model_info: ModelInfo
