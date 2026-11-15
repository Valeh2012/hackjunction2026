# Propaganda Technique Highlighter — Project Description

## Overview

The **Propaganda Technique Highlighter** is a full-stack web application that analyzes user-submitted text for rhetorical and propaganda techniques using AI-powered detection and classification. It provides a real-time, visual experience where suspected propaganda passages are progressively highlighted with labeled annotations as the AI processes them.

The tool is designed as an **educational instrument** — it does not judge the truth of the text, but rather flags passages that employ persuasive or manipulative rhetorical strategies, helping readers develop critical media literacy.

---

## What It Does

1. **Accepts text input** — Users paste an article, paragraph, or any text (up to 10,000 characters) into a fixed-height text editor.
2. **Detects propaganda spans** — An AI model (`gemma-4-31b`) scans the text and identifies passages that employ propaganda techniques such as loaded language, appeal to fear, flag-waving, name-calling, doubt, and others.
3. **Classifies each span** — A second AI model (`jev-latest`) classifies each detected passage into one of 14 specific propaganda technique categories.
4. **Streams results in real time** — As each span is classified, the result is pushed to the frontend via Server-Sent Events (SSE), creating a live, progressive analysis experience.
5. **Highlights with animation** — Each classified span is highlighted in the text with a left-to-right sweep animation (simulating a physical highlighter pen), accompanied by a numbered annotation marker and an underline sweep.
6. **Auto-scrolls to each highlight** — As spans are classified, the view smoothly scrolls to center each newly highlighted passage.
7. **Displays technique definitions** — A three-column layout shows the detected text in the center, with technique definitions and their corresponding span numbers displayed in sidebars.

---

## Architecture

### Frontend (`frontend/`)

- **Framework**: React Router v8 with SSR (Server-Side Rendering) on Node.js/Express
- **Language**: TypeScript
- **Package Manager**: Bun
- **Styling**: Tailwind CSS with custom CSS animations
- **Key Components**:
  - `Introduction` — Page header with title
  - `TextEditor` — Fixed-height textarea with character count, loading overlay, and submit/clear actions
  - `AnalysisResults` — Displays highlighted text with sequential animations, technique badges, and a clear button
  - `MethodNote` — Explains the detection methodology
- **Real-time Communication**: SSE (Server-Sent Events) for streaming classification progress
- **Animations**: CSS `::before` pseudo-element with `transform: scaleX(0→1)` for the highlighter sweep effect, synchronized with a `::after` underline sweep

### Backend (`backend/`)

- **Framework**: FastAPI (Python)
- **Language**: Python 3.12
- **AI Models**:
  - **Span Detection**: `gemma-4-31b` via OpenAI-compatible API — identifies propaganda passages by extracting exact quotes from the text
  - **Technique Classification**: `jev-latest` via TypeSafe SDK — classifies each passage into a specific propaganda technique category with confidence scoring
- **Endpoints**:
  - `GET /api/health` — Health check
  - `GET /api/techniques` — Returns the list of 14 propaganda technique definitions
  - `POST /api/analyze` — Non-streaming analysis (returns all results at once)
  - `POST /api/analyze/stream` — Streaming analysis via SSE (progressive classification)
- **Configuration**: All settings (API keys, model names, thresholds) managed through environment variables in `config.py`

---

## Propaganda Techniques Detected

The system classifies passages into 14 technique categories (based on SemEval-2020 Task 11):

1. **Loaded Language** — Emotionally charged words that steer reactions
2. **Name Calling, Labeling** — Derogatory labels replacing arguments
3. **Repetition** — Repeating words or phrases to establish ideas
4. **Exaggeration, Minimisation** — Hyperbole or downplaying to distort scale
5. **Doubt** — Questioning facts or sources without evidence
6. **Appeal to Fear/Prejudice** — Threats or prejudice to pressure agreement
7. **Flag-Waving** — Invoking national identity to frame agreement as loyalty
8. **Causal Oversimplification** — Attributing complex situations to single causes
9. **Slogans** — Catchy phrases substituting for argument
10. **Appeal to Authority** — Using unnamed authority to lend weight to claims
11. **Black-and-White Fallacy** — Either-or framing that leaves out other options
12. **Thought-Terminating Cliches** — Familiar phrases that shut down questioning
13. **Whataboutism, Straw Man, Red Herring** — Deflecting or misrepresenting to avoid the actual point
14. **Bandwagon, Reductio ad Hitlerum** — Popularity appeals or Nazi comparisons to shut down debate

### Citation

The 14 propaganda technique taxonomy and detection approach are based on:

> Da San Martino, G., Barrón-Cedeño, A., Wachsmuth, H., Petrov, R., & Nakov, P. (2020). SemEval-2020 Task 11: Detection of Propaganda Techniques in News Articles. *Proceedings of the 14th International Workshop on Semantic Evaluation (SemEval-2020)*. arXiv:2009.02696 [cs.CL] https://arxiv.org/abs/2009.02696

The system implements both subtasks from the paper:
- **Subtask SI (Span Identification)**: Locating text fragments containing propaganda
- **Subtask TC (Technique Classification)**: Classifying each fragment into one of the 14 propaganda techniques

---

## Key Technical Features

### Streaming Pipeline

The analysis uses a two-stage pipeline streamed via SSE:

1. **Stage 1 — Span Identification**: The entire text is sent to `gemma-4-31b`, which returns exact quote passages. These are immediately sent to the frontend as "pending" spans.
2. **Stage 2 — Progressive Classification**: Each span is individually sent to `jev-latest` for technique classification. Results are streamed one-by-one as they complete.

---

## AI Usage & Limitations

### Development

This application was developed with AI assistance. The codebase, architecture decisions, and documentation were created using AI tools, with human oversight and refinement.

### Detection Model Limitations

The propaganda detection system uses two AI models:
- **gemma-4-31b** for identifying suspicious passages
- **jev-latest** for classifying technique categories


### Model Flexibility & Improvement Potential

The current models (`gemma-4-31b` and `jev-latest`) are used as general-purpose foundation models with prompt-based instructions. However:

- **Models are easily switchable**: The architecture is designed for modularity. Both models are configured via environment variables in `config.py`, so they can be swapped for any other LLM or classification model that supports the OpenAI-compatible API or TypeSafe SDK interface. No code changes are required — just update the model names in the environment configuration.

- **Fine-tuning could significantly improve performance**: The SemEval-2020 Task 11 paper provides a curated dataset of news articles annotated with propaganda spans and their technique classifications. The current models are not fine-tuned on this dataset. Fine-tuning them (or training specialized models) on this labeled data would likely yield substantially better accuracy, precision, and consistency in both span identification and technique classification. This is a clear path for future improvement.

**Use this tool as a starting point for analysis, not as a definitive verdict.**

---

## Tech Stack Summary

| Layer | Technology |
|---|---|
| Frontend Framework | React Router v8 (SSR) |
| Frontend Runtime | Bun / Node.js 20+ |
| Frontend Styling | Tailwind CSS + Custom CSS |
| Backend Framework | FastAPI (Python 3.12) |
| Span Detection Model | gemma-4-31b |
| Classification Model | jev-latest (TypeSafe SDK) |
| Real-time Protocol | Server-Sent Events (SSE) |
| Containerization | Docker (multi-stage builds) |
| AI Router | Hostinger Router |
