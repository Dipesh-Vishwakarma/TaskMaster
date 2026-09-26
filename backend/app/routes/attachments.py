from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from pathlib import Path
import uuid
import os

from ..database import get_db
from ..models import User, Task, Attachment
from ..schemas import AttachmentResponse
from ..dependencies import get_current_user
from ..config import settings

router = APIRouter()

ALLOWED_EXTENSIONS = {
    'png', 'jpg', 'jpeg', 'webp', 'gif',
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'txt', 'zip'
}

def allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@router.post("/tasks/{task_id}/attachments", response_model=AttachmentResponse, status_code=status.HTTP_201_CREATED)
async def upload_attachment(
    task_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify task ownership
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == current_user.id
    ).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Validate file
    if not allowed_file(file.filename):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File type not allowed"
        )
    
    # Read file
    contents = await file.read()
    file_size = len(contents)
    
    if file_size > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds limit"
        )
    
    # Generate unique filename
    file_ext = file.filename.rsplit('.', 1)[1].lower()
    unique_filename = f"{uuid.uuid4()}.{file_ext}"
    
    # Save file
    upload_dir = Path(settings.UPLOAD_DIR)
    upload_dir.mkdir(parents=True, exist_ok=True)
    file_path = upload_dir / unique_filename
    
    with open(file_path, "wb") as f:
        f.write(contents)
    
    # Create attachment record
    db_attachment = Attachment(
        task_id=task_id,
        filename=unique_filename,
        original_filename=file.filename,
        file_path=str(file_path),
        file_type=file.content_type,
        file_size=file_size
    )
    
    db.add(db_attachment)
    db.commit()
    db.refresh(db_attachment)
    
    return db_attachment

@router.delete("/{attachment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_attachment(
    attachment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    attachment = db.query(Attachment).join(Task).filter(
        Attachment.id == attachment_id,
        Task.user_id == current_user.id
    ).first()
    
    if not attachment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attachment not found"
        )
    
    # Delete file
    try:
        if os.path.exists(attachment.file_path):
            os.remove(attachment.file_path)
    except Exception as e:
        print(f"Error deleting file: {e}")
    
    # Delete record
    db.delete(attachment)
    db.commit()
    
    return None