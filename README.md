# Todo Application - Full Stack

A modern, full-stack todo application built with React, Node.js/Express, PostgreSQL, and Docker.

## 🚀 Features

- ✅ Create tasks with title and description
- ✅ View the 5 most recent incomplete tasks
- ✅ Mark tasks as complete
- ✅ Beautiful, responsive UI with Tailwind CSS
- ✅ Comprehensive unit and integration tests
- ✅ Fully containerized with Docker
- ✅ Clean architecture with SOLID principles

## 🛠 Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Axios for API calls
- React Testing Library for tests

### Backend
- Node.js with Express.js
- TypeScript
- PostgreSQL database
- Jest & Supertest for testing

### DevOps
- Docker & Docker Compose
- Multi-stage builds for optimization
- Nginx for serving frontend

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)
- Git

## 🏃 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd todo-app
```

### 2. Build and Run with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up --build -d
```

This single command will:
- Build the backend Docker image
- Build the frontend Docker image
- Start PostgreSQL database
- Initialize the database schema
- Start the backend API server
- Start the frontend web server

### 3. Access the Application

Once all containers are running:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Database**: PostgreSQL on localhost:5432

### 4. Stop the Application

```bash
# Stop all containers
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v
```

## 🧪 Running Tests

### Quick Test (Recommended)

**Windows:**
```powershell
.\run-tests-local.ps1
```

**Linux/Mac:**
```bash
chmod +x run-tests-local.sh
./run-tests-local.sh
```

### Manual Testing

#### Backend Tests

```bash
cd backend
npm install
npm test

# With coverage
npm test -- --coverage
```

**Expected Output:**
- All test suites should pass
- Coverage: 60%+ on all metrics (branches, functions, lines, statements)

#### Frontend Tests

```bash
cd frontend
npm install
npm test -- --watchAll=false

# With coverage
npm test -- --coverage --watchAll=false
```

**Expected Output:**
- All test suites should pass
- All component tests passing (TaskCard, TaskForm, TaskList)

### Docker Testing (Alternative)

```bash
# Build test images
docker build -t todo-backend-test -f backend/Dockerfile.test backend/
docker build -t todo-frontend-test -f frontend/Dockerfile.test frontend/

# Run tests
docker run --rm --network host -e DATABASE_URL=postgresql://todouser:todopass@localhost:5432/tododb todo-backend-test
docker run --rm todo-frontend-test
```

### Test Coverage Reports

After running tests with coverage, view detailed HTML reports:

```bash
# Backend
open backend/coverage/index.html

# Frontend  
open frontend/coverage/index.html
```

## 📁 Project Structure

```
todo-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts          # Database configuration
│   │   ├── models/
│   │   │   └── Task.ts               # Task model and DTOs
│   │   ├── repositories/
│   │   │   ├── TaskRepository.ts     # Data access layer
│   │   │   └── TaskRepository.test.ts
│   │   ├── services/
│   │   │   ├── TaskService.ts        # Business logic
│   │   │   └── TaskService.test.ts
│   │   ├── controllers/
│   │   │   └── TaskController.ts     # Request handlers
│   │   ├── routes/
│   │   │   ├── taskRoutes.ts         # API routes
│   │   │   └── taskRoutes.test.ts
│   │   └── server.ts                 # Application entry point
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskCard.test.tsx
│   │   │   ├── TaskForm.tsx
│   │   │   ├── TaskForm.test.tsx
│   │   │   ├── TaskList.tsx
│   │   │   └── TaskList.test.tsx
│   │   ├── services/
│   │   │   └── api.ts                # API client
│   │   ├── App.tsx                   # Main component
│   │   ├── index.tsx                 # Entry point
│   │   └── index.css                 # Global styles
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── tsconfig.json
│   └── tailwind.config.js
├── docker-compose.yml
└── README.md
```

## 🔧 API Endpoints

### Tasks

- `GET /api/tasks` - Get the 5 most recent incomplete tasks
- `POST /api/tasks` - Create a new task
  ```json
  {
    "title": "Task title",
    "description": "Task description"
  }
  ```
- `PATCH /api/tasks/:id/complete` - Mark a task as completed

## 🗄 Database Schema

### Task Table

```sql
CREATE TABLE task (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_task_completed_created 
ON task(completed, created_at DESC);
```

## 🏗 Architecture

The application follows a layered architecture:

### Backend Layers
1. **Controller Layer**: Handles HTTP requests and responses
2. **Service Layer**: Contains business logic and validation
3. **Repository Layer**: Manages database operations
4. **Model Layer**: Defines data structures and DTOs

### Design Principles
- **SOLID Principles**: Single Responsibility, Dependency Injection
- **Clean Code**: Meaningful names, small functions, proper error handling
- **Test Coverage**: Unit tests and integration tests for all layers

## 🐳 Docker Configuration

### Services

1. **Database (PostgreSQL)**
   - Image: `postgres:15-alpine`
   - Port: 5432
   - Health checks enabled

2. **Backend (Node.js/Express)**
   - Multi-stage build
   - TypeScript compilation in build stage
   - Production dependencies only in final image
   - Port: 5000

3. **Frontend (React/Nginx)**
   - Multi-stage build
   - React build in build stage
   - Nginx serves static files
   - Port: 3000 (mapped to 80 in container)

## 🔍 Development Mode

For local development without Docker:

### Backend

```bash
cd backend
npm install
npm run dev  # Starts with hot-reload
```

### Frontend

```bash
cd frontend
npm install
npm start  # Starts development server
```

Make sure PostgreSQL is running locally and update the `DATABASE_URL` in `backend/src/config/database.ts`.

## 📊 Test Coverage

The project maintains high test coverage:
- Backend: 60%+ coverage (branches, functions, lines, statements)
- Frontend: Unit tests for all components
- Integration tests for API endpoints

## 🚀 Production Deployment

For production deployment:

1. Set appropriate environment variables
2. Use secrets management for sensitive data
3. Configure proper networking and security groups
4. Set up monitoring and logging
5. Use orchestration tools like Kubernetes for scaling


## .env.local (frontend)

REACT_APP_API_URL = 'http://localhost:5000'

## .env (backend)

DATABASE_URL = 'postgresql://todouser:todopass@localhost:5432/tododb'
NODE_ENV = 'development'
PORT = 5000 

