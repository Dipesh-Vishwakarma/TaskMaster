from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    
    # JWT
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 43200  # Default: 30 days
    
    # Upload
    UPLOAD_DIR: str = "/app/uploads"
    MAX_UPLOAD_SIZE: int = 10485760  # 10MB
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        # Allow empty strings to use defaults
        str_strip_whitespace = True

    @classmethod
    def parse_env_var(cls, field_name: str, raw_val: str):
        if field_name == 'ACCESS_TOKEN_EXPIRE_MINUTES' and raw_val == '':
            return 43200
        return raw_val

settings = Settings()