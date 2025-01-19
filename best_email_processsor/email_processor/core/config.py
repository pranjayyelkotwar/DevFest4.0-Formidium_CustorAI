from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    """Configuration settings for the application."""
    
    # Email configuration
    EMAIL_HOST: str = Field(..., env="EMAIL_HOST")
    EMAIL_USER: str = Field(..., env="EMAIL_USER")
    EMAIL_PASSWORD: str = Field(..., env="EMAIL_PASSWORD")
    
    # Database configuration
    DB_HOST: str = Field(..., env="DB_HOST")
    DB_PORT: int = Field(5432, env="DB_PORT")
    DB_NAME: str = Field(..., env="DB_NAME")
    DB_USER: str = Field(..., env="DB_USER")
    DB_PASSWORD: str = Field(..., env="DB_PASSWORD")
    
    class Config:
        env_file = "example.env"

settings = Settings()