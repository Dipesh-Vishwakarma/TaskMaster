from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# User Schemas
class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=100)
    email: EmailStr
    full_name: str = Field(..., min_length=1, max_length=255)
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[int] = None

# Checklist Schemas
class ChecklistItemCreate(BaseModel):
    text: str = Field(..., min_length=1, max_length=500)
    position: int = 0

class ChecklistItemUpdate(BaseModel):
    text: Optional[str] = None
    is_completed: Optional[bool] = None
    position: Optional[int] = None

class ChecklistItemResponse(BaseModel):
    id: int
    task_id: int
    text: str
    is_completed: bool
    position: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Attachment Schemas
class AttachmentResponse(BaseModel):
    id: int
    task_id: int
    filename: str
    original_filename: str
    file_type: Optional[str]
    file_size: Optional[int]
    created_at: datetime
    
    class Config:
        from_attributes = True

# Task Schemas
class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    status: str = "To Do"
    priority: str = "Medium"
    points: int = 0
    due_date: Optional[datetime] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    points: Optional[int] = None
    due_date: Optional[datetime] = None
    is_pinned: Optional[bool] = None
    is_archived: Optional[bool] = None

class TaskResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str]
    status: str
    priority: str
    points: int
    due_date: Optional[datetime]
    is_pinned: bool
    is_archived: bool
    created_at: datetime
    updated_at: datetime
    checklists: List[ChecklistItemResponse] = []
    attachments: List[AttachmentResponse] = []
    
    class Config:
        from_attributes = True

class TaskStatusUpdate(BaseModel):
    status: str

class TaskPinUpdate(BaseModel):
    is_pinned: bool

class TaskArchiveUpdate(BaseModel):
    is_archived: bool