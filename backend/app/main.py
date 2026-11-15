"""FastAPI application: health check, technique list and text analysis."""

import json
import logging
from typing import Annotated
from uuid import uuid4

from fastapi import Body, FastAPI
from fastapi.responses import StreamingResponse

from . import detector
from .config import MAX_TEXT_LENGTH, MODEL_INFO
from .schemas import AnalyzeResponse, HealthResponse, ModelInfo, Technique
from .techniques import TECHNIQUES

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)

# Same limit as the web app's editor (CHARACTER_LIMIT in its src/data/techniques.ts).

app = FastAPI(title="Technique Detection API", version="0.1.0")


@app.get("/api/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok")


@app.get("/api/techniques", response_model=list[Technique])
def list_techniques() -> list[dict[str, str]]:
    return TECHNIQUES


@app.post("/api/analyze", response_model=AnalyzeResponse)
def analyze(
    text: Annotated[
        str,
        Body(
            embed=True,
            min_length=1,
            max_length=MAX_TEXT_LENGTH,
            description="Text to analyze.",
        ),
    ],
) -> AnalyzeResponse:
    return AnalyzeResponse(
        request_id=str(uuid4()),
        text=text,
        spans=detector.detect_spans(text),
        warnings=[],
        model_info=ModelInfo(**MODEL_INFO),
    )


@app.post("/api/analyze/stream")
def analyze_stream(
    text: Annotated[
        str,
        Body(
            embed=True,
            min_length=1,
            max_length=MAX_TEXT_LENGTH,
            description="Text to analyze.",
        ),
    ],
):
    """Stream classification progress as SSE."""
    
    def event_generator():
        request_id = str(uuid4())
        
        # Send start event
        yield f"data: {json.dumps({'type': 'start', 'request_id': request_id})}\n\n"
        
        try:
            # Identify spans (blocking)
            ranges = detector.identify_spans(text)
            
            if not ranges:
                yield f"data: {json.dumps({'type': 'complete', 'spans': []})}\n\n"
                return
            
            # Send detected spans immediately with pending classification
            pending_spans = [
                {
                    "start": start,
                    "end": end,
                    "technique": "Pending classification",
                    "techniqueId": "pending",
                    "probability": 0.0,
                    "band": "pending",
                }
                for start, end in ranges
            ]
            yield f"data: {json.dumps({'type': 'spans_detected', 'spans': pending_spans, 'total': len(ranges)})}\n\n"
            
            # Classify each span and stream updates
            for i, (start, end) in enumerate(ranges):
                span = detector.classify_single_passage(text, start, end, i + 1, len(ranges))
                if span:
                    yield f"data: {json.dumps({'type': 'span_classified', 'index': i, 'span': span.model_dump(by_alias=True), 'progress': i + 1, 'total': len(ranges)})}\n\n"
            
            yield f"data: {json.dumps({'type': 'complete'})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'error': str(e)})}\n\n"
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
