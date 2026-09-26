from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .routes import auth, tasks, checklists, attachments
import os

app = FastAPI(title="TaskMaster API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory
os.makedirs("/app/uploads", exist_ok=True)

# Mount uploads
app.mount("/uploads", StaticFiles(directory="/app/uploads"), name="uploads")

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["Tasks"])
app.include_router(checklists.router, prefix="/api/checklist", tags=["Checklists"])
app.include_router(attachments.router, prefix="/api/attachments", tags=["Attachments"])

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/")
def root():
    return {"message": "TaskMaster API", "version": "1.0.0"}