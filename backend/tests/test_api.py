from uuid import UUID

from fastapi.testclient import TestClient

from app.detector import (
    DETECTED_THRESHOLD,
    MAX_SNIPPET_WORDS,
    MAX_SNIPPETS,
    MIN_SNIPPET_WORDS,
    MIN_SNIPPETS,
)
from app.main import MAX_TEXT_LENGTH, app
from app.techniques import TECHNIQUE_NAMES, TECHNIQUES

client = TestClient(app)

# Long enough that every snippet can have its full length.
LONG_TEXT = " ".join(f"word{index}" for index in range(200))
# The detector is random, so its properties are checked over several responses.
RUNS = 50


def analyze(text: str) -> dict:
    response = client.post("/api/analyze", json={"text": text})

    assert response.status_code == 200
    return response.json()


def test_health():
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_techniques_returns_all_classes():
    response = client.get("/api/techniques")

    assert response.status_code == 200
    body = response.json()
    assert body == TECHNIQUES
    ids = [technique["id"] for technique in body]
    assert len(ids) == len(set(ids))
    loaded_language = next(t for t in body if t["id"] == "loaded_language")
    assert loaded_language["name"] == "Loaded Language"


def test_techniques_have_a_name_and_description():
    for technique in client.get("/api/techniques").json():
        assert set(technique) == {"id", "name", "description"}
        assert all(value.strip() for value in technique.values())


def test_analyze_response_shape():
    text = "This outrageous plan was written by crooks."

    response = client.post("/api/analyze", json={"text": text})

    assert response.status_code == 200
    body = response.json()
    assert set(body) == {"request_id", "text", "spans", "warnings", "model_info"}
    UUID(body["request_id"])
    assert body["text"] == text
    assert isinstance(body["warnings"], list)
    assert body["model_info"] == {
        "span_model": "gemma-lora-v1",
        "classifier": "gemini-decision-1",
    }


def test_analyze_rejects_get():
    response = client.get("/api/analyze", params={"text": "hello"})

    assert response.status_code == 405


def test_analyze_returns_5_to_10_snippets():
    counts = {len(analyze(LONG_TEXT)["spans"]) for _ in range(RUNS)}

    assert counts <= set(range(MIN_SNIPPETS, MAX_SNIPPETS + 1))
    assert len(counts) > 1


def test_analyze_snippets_are_a_few_whole_words():
    text = "  Irregular \t spacing,\nwith  punctuation! " + LONG_TEXT + " \n"

    for _ in range(RUNS):
        for span in analyze(text)["spans"]:
            snippet = text[span["start"] : span["end"]]
            assert MIN_SNIPPET_WORDS <= len(snippet.split()) <= MAX_SNIPPET_WORDS
            assert snippet == snippet.strip()
            assert span["start"] == 0 or text[span["start"] - 1].isspace()
            assert span["end"] == len(text) or text[span["end"]].isspace()


def test_analyze_snippets_are_ordered_and_do_not_overlap():
    for _ in range(RUNS):
        previous_end = 0
        for span in analyze(LONG_TEXT)["spans"]:
            assert previous_end <= span["start"] < span["end"] <= len(LONG_TEXT)
            previous_end = span["end"]


def test_analyze_snippets_differ_between_requests():
    results = {
        tuple((span["start"], span["end"]) for span in analyze(LONG_TEXT)["spans"])
        for _ in range(RUNS)
    }

    assert len(results) > 1


def test_analyze_labels_are_random_known_techniques():
    seen = set()

    for _ in range(RUNS):
        for span in analyze(LONG_TEXT)["spans"]:
            assert span["technique"] == TECHNIQUE_NAMES[span["technique_id"]]
            assert 0.0 <= span["probability"] <= 1.0
            detected = span["probability"] >= DETECTED_THRESHOLD
            assert span["band"] == ("detected" if detected else "possible")
            seen.add(span["technique_id"])

    assert len(seen) > 1


def test_analyze_short_text_gets_shorter_snippets():
    text = "one two three four five six"

    for _ in range(RUNS):
        spans = analyze(text)["spans"]
        snippets = [text[span["start"] : span["end"]] for span in spans]
        words = " ".join(snippets).split()
        assert MIN_SNIPPETS <= len(spans) <= len(text.split())
        assert len(words) == len(set(words))
        assert words == sorted(words, key=text.split().index)


def test_analyze_single_word_gets_one_snippet():
    spans = analyze("hello")["spans"]

    assert [(span["start"], span["end"]) for span in spans] == [(0, 5)]


def test_analyze_text_without_words_has_no_spans():
    assert analyze(" \n ")["spans"] == []


def test_analyze_request_ids_are_unique():
    first = analyze("hello")
    second = analyze("hello")

    assert first["request_id"] != second["request_id"]


def test_analyze_requires_text():
    assert client.post("/api/analyze").status_code == 422
    assert client.post("/api/analyze", json={}).status_code == 422
    assert client.post("/api/analyze", json={"text": ""}).status_code == 422
    assert client.post("/api/analyze", json={"text": 5}).status_code == 422


def test_analyze_accepts_text_at_the_length_limit():
    response = client.post("/api/analyze", json={"text": "a" * MAX_TEXT_LENGTH})

    assert response.status_code == 200


def test_analyze_rejects_overlong_text():
    response = client.post("/api/analyze", json={"text": "a" * (MAX_TEXT_LENGTH + 1)})

    assert response.status_code == 422
