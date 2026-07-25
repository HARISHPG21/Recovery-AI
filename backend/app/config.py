"""
Application Configuration Module

Loads environment variables using Pydantic Settings with strict type enforcement.
"""

import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    """Global application settings and environment configurations."""
    APP_NAME: str = "RecoveryAI Backend"
    APP_VERSION: str = "1.0.0"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "*")

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
