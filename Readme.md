# TaskMaster 🎯

A modern, colorful task management web application built with React, FastAPI, and PostgreSQL.

![TaskMaster](./screenshot.png)

## Features ✨

- 🔐 User authentication with JWT
- 📝 Create, edit, and delete tasks
- 🏷️ Task status and priority management
- ✅ Checklists and subtasks
- 📎 File and image attachments
- 📌 Pin and archive tasks
- 🔍 Search and filter tasks
- 🎨 20+ beautiful color themes
- 🌓 Light/dark mode support
- 📱 Fully responsive design
- 💾 Persistent data storage

## Technology Stack

### Frontend
- React 18
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Zustand (State Management)
- Lucide Icons
- React Hot Toast
- Date-fns

### Backend
- Python 3.12
- FastAPI
- SQLAlchemy ORM
- PostgreSQL 16
- JWT Authentication
- Uvicorn

### Deployment
- Docker
- Docker Compose

## Requirements

- Docker
- Docker Compose
- (Optional) Git

## Quick Start

### 1. Clone or Extract

```bash
# If cloning
git clone <repository-url>
cd taskmaster

# Or extract the files to a directory

2. Configure Environment
# Copy the example environment file
cp .env.example .env

# Edit .env with your settings (optional)
# The defaults are fine for local development
nano .env

3. Start the Application
# Build and start all services
docker compose up -d --build

# Wait for services to start (30-60 seconds)
docker compose logs -f

4. Access the Application
Frontend: http://localhost:3000
Backend API: http://localhost:8000
API Documentation: http://localhost:8000/docs
Database: localhost:5432
Creating an Account
Open http://localhost:3000
Click "Create Account"
Fill in your details
Click "Create Account"
You'll be logged in automatically

Project Structure
taskmaster/
├── frontend/                  # React application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── stores/           # Zustand stores
│   │   ├── types/            # TypeScript types
│   │   └── styles/           # Global styles
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                   # FastAPI application
│   ├── app/
│   │   ├── main.py          # Entry point
│   │   ├── models.py         # Database models
│   │   ├── schemas.py        # Request/response schemas
│   │   ├── database.py       # Database configuration
│   │   ├── config.py         # App configuration
│   │   ├── routes/           # API routes
│   │   └── utils/            # Utility functions
│   ├── requirements.txt
│   └── Dockerfile
│
├── database/
│   └── init.sql              # Database initialization
│
├── docker-compose.yml        # Docker Compose config
├── .env.example              # Example environment variables
├── .gitignore
└── README.md

Usage
Dashboard
View task statistics
See recent tasks
Quick access to all tasks
Tasks Page
View all tasks
Search by title or description
Filter by status, priority, pinned, archived
Click a task to view/edit details
Create Task
Click "+ Create Task"
Fill in title, description, status, priority
(Optional) Add points, due date, checklist items, files
Click "Save"
Edit Task
Click on any task card to open editor
Modify details
Add/remove checklists
Upload/remove attachments
Click "Save"
Pin Task
Click the pin icon on a task card
Pinned tasks appear in the "Pinned" section
Archive Task
Click the archive icon
Archived tasks appear in "Archive" section
Restore by clicking archive icon again
Delete Task
Click the delete icon
Confirm deletion
Task and all attachments are removed
Change Theme
Go to Settings
Select color theme and dark mode preference
Theme saves automatically
API Endpoints
Authentication
POST /api/auth/register - Create account
POST /api/auth/login - Login
GET /api/auth/me - Get current user
Tasks
GET /api/tasks - List tasks (with filters)
POST /api/tasks - Create task
GET /api/tasks/{id} - Get task
PUT /api/tasks/{id} - Update task
DELETE /api/tasks/{id} - Delete task
PATCH /api/tasks/{id}/status - Update status
PATCH /api/tasks/{id}/pin - Toggle pin
PATCH /api/tasks/{id}/archive - Toggle archive
Checklists
POST /api/tasks/{id}/checklist - Add checklist
PUT /api/tasks/checklist/{id} - Update checklist
DELETE /api/tasks/checklist/{id} - Delete checklist
Attachments
POST /api/tasks/{id}/attachments - Upload file
DELETE /api/tasks/attachments/{id} - Delete attachment
GET /api/tasks/attachments/{id}/download - Download file