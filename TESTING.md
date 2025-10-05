# Testing Guide

This document explains the testing strategy and how to run tests for the Todo application.

## Test Structure

### Backend Tests

The backend has three types of tests:

1. **Unit Tests** - Test individual components in isolation
   - `TaskRepository.test.ts` - Database operations
   - `TaskService.test.ts` - Business logic

2. **Integration Tests** - Test API routes with mocked dependencies
   - `taskRoutes.test.ts` - HTTP endpoints with mocks

### Frontend Tests

Component unit tests:
- `TaskCard.test.tsx` - Task card component
- `TaskForm.test.tsx` - Task creation form
- `TaskList.test.tsx` - Task list display

## Running Tests

### Quick Start (Recommended)

```bash
# Backend - Unit tests only (fast)
cd backend
npm test

# Frontend - All component tests
cd frontend
npm test -- --watchAll=false
```

### Backend Test Commands

```bash
cd backend

# Run unit tests only (default, fastest)
npm test

# Run unit tests with coverage
npm run test:unit

# Watch mode for development
npm run test:watch
```

### Frontend Test Commands

```bash
cd frontend

# Run all tests once
npm test -- --watchAll=false

# Run with coverage
npm test -- --coverage --watchAll=false

# Watch mode for development
npm test

# Run specific test file
npm test TaskForm
```

## Test Coverage Goals

Both backend and frontend maintain **60%+ coverage** on:
- Statements
- Branches
- Functions
- Lines

## Understanding Test Output

### Successful Test Run

```
PASS  src/services/TaskService.test.ts
PASS  src/repositories/TaskRepository.test.ts
PASS  src/routes/taskRoutes.test.ts

Test Suites: 3 passed, 3 total
Tests:       25 passed, 25 total
```

### Coverage Report

```
-----------------|---------|----------|---------|---------|
File             | % Stmts | % Branch | % Funcs | % Lines |
-----------------|---------|----------|---------|---------|
All files        |   85.5  |   80.2   |   90.0  |   85.5  |
 TaskController  |   100   |   100    |   100   |   100   |
 TaskService     |   95.0  |   87.5   |   100   |   95.0  |
 TaskRepository  |   100   |   100    |   100   |   100   |
-----------------|---------|----------|---------|---------|
```

## Test Scenarios

### Backend Test Scenarios

**TaskRepository Tests:**
- ✅ Find recent incomplete tasks
- ✅ Create new task
- ✅ Mark task as completed
- ✅ Return null for non-existent task

**TaskService Tests:**
- ✅ Get recent tasks
- ✅ Create task with validation
- ✅ Reject empty title
- ✅ Reject title > 255 characters
- ✅ Trim whitespace
- ✅ Complete task
- ✅ Handle non-existent task

**Integration Tests (taskRoutes.test.ts):**
- ✅ GET /api/tasks - Return task list
- ✅ GET /api/tasks - Return empty array
- ✅ GET /api/tasks - Handle errors
- ✅ POST /api/tasks - Create task
- ✅ POST /api/tasks - Validate title
- ✅ POST /api/tasks - Trim whitespace
- ✅ PATCH /api/tasks/:id/complete - Complete task
- ✅ PATCH /api/tasks/:id/complete - Handle invalid ID
- ✅ PATCH /api/tasks/:id/complete - Return 404

### Frontend Test Scenarios

**TaskCard Tests:**
- ✅ Render task title and description
- ✅ Handle tasks without description
- ✅ Call onComplete when clicked
- ✅ Disable button when completing
- ✅ Display formatted date

**TaskForm Tests:**
- ✅ Render form inputs
- ✅ Update input values
- ✅ Submit form data
- ✅ Clear form after submission
- ✅ Prevent empty title submission
- ✅ Disable button when submitting
- ✅ Enforce max length

**TaskList Tests:**
- ✅ Show loading state
- ✅ Show empty state
- ✅ Render task list
- ✅ Display task count
- ✅ Pass props to TaskCard

## Troubleshooting

### "Jest not found"

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### "Cannot find module"

```bash
# Rebuild TypeScript
npm run build

# Run tests again
npm test
```

### Tests timeout

```bash
# Increase timeout in jest.config.js
testTimeout: 10000  // 10 seconds
```

## Continuous Integration

For CI/CD pipelines:

```bash
# Run all tests with coverage
npm test

# Verify coverage thresholds are met
# Jest will exit with error if coverage < 60%
```

## Best Practices

1. **Run unit tests frequently** during development
2. **Check coverage** to identify untested code
3. **Write tests first** for new features (TDD)
4. **Keep tests isolated** - no shared state
5. **Mock external dependencies** in unit tests

## Quick Commands Summary

```bash
# Backend
cd backend
npm test                    # Unit tests (fast)
npm run test:all           # All tests

# Frontend  
cd frontend
npm test -- --watchAll=false    # All tests once
npm test                         # Watch mode

# View coverage reports
open backend/coverage/index.html
open frontend/coverage/index.html
```