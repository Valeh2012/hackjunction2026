"""Span detection.

Uses gemma-4-31b to identify propaganda spans, then jev-latest to classify them.
"""

import logging

from .config import API_BASE_URL, API_KEY, MODEL_INFO, DETECTED_THRESHOLD
from .schemas import Span
from .techniques import TECHNIQUE_NAMES
from openai import OpenAI
from typesafe_sdk import Choice, Score, TypeSafeClient

# Set up logging
logger = logging.getLogger(__name__)


oc = OpenAI(
    base_url=f"{API_BASE_URL}/v1",
    api_key=API_KEY,
)

tc = TypeSafeClient(
    base_url=API_BASE_URL,
    api_key=API_KEY,
    model=MODEL_INFO["classifier"],
)


_SPAN_PROMPT = """You are annotating a news article for passages that push the reader toward
a particular feeling or interpretation, using techniques such as:
exaggeration or minimisation, appeal to fear, loaded or emphatic language,
repetition or emphasis, doubt or hedging, and framing a risk as bigger,
worse or more urgent than the facts alone establish.

Rules:
- Mark every passage that does this, including short ones (a single word is allowed).
- Copy each passage EXACTLY as it appears in the article, character for character.
  Do not paraphrase, shorten with "...", fix spelling, or add quotation marks.
- Each passage must be contiguous text,
- Output one passage per line, in order of appearance, with no numbering,
  bullets, labels or commentary. If there are none, output NONE.

ARTICLE:
\"\"\"
{article_text}
\"\"\"
"""


def band_for(probability: float) -> str:
    return "detected" if probability >= DETECTED_THRESHOLD else "possible"


def identify_spans(text: str) -> list[tuple[int, int]]:
    """Ask the model for propaganda passages and return (start, end) ranges.

    The model returns quotes, one per line. Each quote is located in `text`
    to get character offsets (end exclusive). Quotes that do not appear in
    the text are dropped, and ranges never overlap.
    """
    if not text.strip():
        return []

    logger.info("Calling gemma-4-31b to identify propaganda spans (text length: %d chars)", len(text))
    response = oc.chat.completions.create(
        model=MODEL_INFO['span_model'],
        messages=[{"role": "user", "content": _SPAN_PROMPT.replace("{article_text}", text)}],
        temperature=0,
        max_tokens=1500,
    )
    logger.info("Received %d lines from span identification model", len(response.choices[0].message.content or ""))
    raw = response.choices[0].message.content or ""

    ranges: list[tuple[int, int]] = []
    for line in raw.splitlines():
        quote = line.strip()
        if len(quote) > 1 and quote[0] == quote[-1] and quote[0] in "\"'":
            quote = quote[1:-1]
        if not quote or quote.upper() == "NONE":
            continue

        position = 0
        while True:
            start = text.find(quote, position)
            if start == -1:
                break
            end = start + len(quote)
            if not any(start < e and end > s for s, e in ranges):
                ranges.append((start, end))
                break
            position = start + 1

    return sorted(ranges)


def classify_single_passage(text: str, start: int, end: int, index: int, total: int) -> Span | None:
    """Classify a single passage and return a Span."""
    passage = text[start:end]
    logger.info("Calling jev-latest to classify passage %d/%d (length: %d chars)", index, total, len(passage))
    
    # Build criteria dict from TECHNIQUE_NAMES for the Choice question
    technique_criteria = {tid: name for tid, name in TECHNIQUE_NAMES.items()}
    
    try:
        # Call jev-latest with structured questions
        response = tc.system_one(
            state=passage,
            questions={
                "technique": Choice(
                    instructions="What propaganda technique is used in this passage?",
                    criteria=technique_criteria,
                ),
                "confidence": Score(
                    instructions="How confident are you this is propaganda?",
                    criteria=["low", "medium", "high"],
                ),
            },
        )
        
        logger.info("Received classification for passage %d/%d", index, total)
        
        # Extract results
        technique_id = response.choices["technique"].choice
        confidence_label = response.scores["confidence"].score
        technique_name = TECHNIQUE_NAMES[technique_id]
        
        logger.info("Passage %d/%d classified as: %s (confidence: %s)", index, total, technique_name, confidence_label)
        
        # Map confidence labels to probabilities
        prob_map = {"low": 0.4, "medium": 0.7, "high": 0.9}
        probability = prob_map.get(confidence_label, 0.5)
        
        return Span(
            start=start,
            end=end,
            technique=technique_name,
            technique_id=technique_id,
            probability=probability,
            band=band_for(probability),
        )
    except Exception as e:
        logger.error("Failed to classify passage %d/%d: %s", index, total, str(e))
        return None


def classify_techniques(text: str, ranges: list[tuple[int, int]]) -> list[Span]:
    """Classify each range using jev-latest via TypeSafe SDK."""
    if not ranges:
        return []

    spans = []
    for i, (start, end) in enumerate(ranges):
        span = classify_single_passage(text, start, end, i + 1, len(ranges))
        if span:
            spans.append(span)
    
    return spans


def detect_spans(text: str) -> list[Span]:
    """Return random technique spans for `text`, ordered by position."""
    return classify_techniques(text, identify_spans(text))
