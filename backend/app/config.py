"""Configuration management for the application.

Loads configuration from environment variables with sensible defaults.
"""

import os
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()


# API Configuration
API_BASE_URL = os.getenv("API_BASE_URL", "https://router.hostinger.com")
API_KEY = os.getenv("API_KEY", "")

# Model Configuration
SPAN_MODEL = os.getenv("SPAN_MODEL", "gemma-4-31b")
CLASSIFIER_MODEL = os.getenv("CLASSIFIER_MODEL", "jev-latest")

# Detection Configuration
DETECTED_THRESHOLD = float(os.getenv("DETECTED_THRESHOLD", "0.7"))

# Text limits
MAX_TEXT_LENGTH = 10_000

# Model info for API responses
MODEL_INFO: dict[str, str] = {
    "span_model": SPAN_MODEL,
    "classifier": CLASSIFIER_MODEL,
}
