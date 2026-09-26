from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User, Task, TaskChecklist
from ..schemas import ChecklistItemCreate, ChecklistItemUpdate, ChecklistItemResponse
from ..dependencies import get_current_user

router = APIRouter()

@router.post("/tasks/{task_id}/checklist", response_model=ChecklistItemResponse, status_code=status.HTTP_201_CREATED)
def create_checklist_item(
    task_id: int,
    item_data: ChecklistItemCreate,
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
    
    db_item = TaskChecklist(
        task_id=task_id,
        **item_data.model_dump()
    )
    
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    
    return db_item

@router.put("/{item_id}", response_model=ChecklistItemResponse)
def update_checklist_item(
    item_id: int,
    item_data: ChecklistItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(TaskChecklist).join(Task).filter(
        TaskChecklist.id == item_id,
        Task.user_id == current_user.id
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Checklist item not found"
        )
    
    update_data = item_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(item, field, value)
    
    db.commit()
    db.refresh(item)
    
    return item

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_checklist_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(TaskChecklist).join(Task).filter(
        TaskChecklist.id == item_id,
        Task.user_id == current_user.id
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Checklist item not found"
        )
    
    db.delete(item)
    db.commit()
    
    return None