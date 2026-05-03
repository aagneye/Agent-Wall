from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Agent Firewall API"
    VERSION: str = "0.1.0"
    API_V1_PREFIX: str = "/api/v1"

    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    DATABASE_URL: str = ""

    # Comma-separated origins for browser CORS (preflight OPTIONS). Frontend dev server by default.
    BACKEND_CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )


settings = Settings()
