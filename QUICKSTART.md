# Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- MongoDB running locally or remote connection
- pnpm package manager

## Environment Setup

### Backend (.env)

Create `/backend/.env`:

```
MONGODB_URI=mongodb://localhost:27017/exam-system
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h
NODE_ENV=development
PORT=8000
CLIENT_URL=http://localhost:3000
```

### Frontend (.env.local)

Create `/frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Installation & Running

### Terminal 1 - Backend

```bash
cd backend
pnpm install
pnpm dev
# Server runs on http://localhost:8000
```

### Terminal 2 - Frontend

```bash
cd frontend
pnpm install
pnpm dev
# Frontend runs on http://localhost:3000
```

## Test Credentials

Create test users via the admin dashboard:

### Admin User (Seed this manually first)

Email: admin@school.com
Password: admin123

### Creating Users

1. Login as admin
2. Go to Dashboard → Users → Create User
3. Select role (Student, Teacher, Admin)
4. For students: require NIS and Class assignment

### Test Flow

1. **Admin Login** → Create classes, users, exams
2. **Teacher Login** → Create exams, view student results
3. **Student Login** → View assigned exams, take exam

## Available Routes

### Public Routes

- `/` - Redirects to appropriate dashboard if logged in
- `/login` - Login page
- `/register` - Registration page (currently disabled, use admin to create users)

### Student Routes (Protected)

- `/dashboard/student` - Main dashboard
- `/dashboard/student/exams` - View exams
- `/dashboard/student/results` - View results
- `/dashboard/student/profile` - Profile

### Teacher Routes (Protected)

- `/dashboard/teacher` - Main dashboard
- `/dashboard/teacher/classes` - Manage classes
- `/dashboard/teacher/exams` - Manage exams
- `/dashboard/teacher/questions` - Manage questions
- `/dashboard/teacher/results` - View results
- `/dashboard/teacher/profile` - Profile

### Admin Routes (Protected)

- `/dashboard/admin` - Main dashboard
- `/dashboard/admin/users` - Manage users
- `/dashboard/admin/users/create` - Create user
- `/dashboard/admin/classes` - Manage classes
- `/dashboard/admin/classes/create` - Create class
- `/dashboard/admin/exams` - Manage exams
- `/dashboard/admin/questions` - Manage questions
- `/dashboard/admin/results` - View results
- `/dashboard/admin/profile` - Profile

## API Endpoints Used

### Authentication

- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Current user
- `PUT /api/auth/me` - Update profile
- `POST /api/auth/register` - Register/Create user
- `GET /api/auth` - Get all users (admin)

### Classes

- `GET /api/classes` - Get all classes
- `POST /api/classes` - Create class
- `GET /api/classes/:id` - Get class details
- `PUT /api/classes/:id` - Update class
- `DELETE /api/classes/:id` - Delete class
- `GET /api/classes/:id/students` - Get class students

### Exams

- `GET /api/exams/class/:classId` - Get exams for class
- `POST /api/exams` - Create exam
- (More endpoints available in backend)

## Troubleshooting

### MongoDB Connection Error

- Ensure MongoDB is running: `mongod`
- Check connection string in .env

### CORS Error

- Ensure backend is running on port 8000
- Check NEXT_PUBLIC_API_URL in frontend .env.local

### Login Not Working

- Check if backend is running
- Verify user exists in database
- Check password is correct

### Data Not Loading

- Check browser console for API errors
- Verify backend endpoints are responding: `curl http://localhost:8000/api/classes`
- Check auth token is valid

## Next Steps

### Phase 2 - Exam Taking Interface

- Create exam taking page with timer
- Implement answer autosave
- Display progress tracking

### Phase 3 - Image Upload

- Implement image upload for questions
- Add image upload for student answers
- Add image compression using Sharp

### Phase 4 - Results & Grading

- Calculate exam scores automatically
- Display detailed results
- Admin grading interface

### Phase 5 - Advanced Features

- Bulk user import
- Export results to CSV
- Email notifications
- Exam scheduling

## Database Schema

The application uses MongoDB with these main collections:

- `users` - User accounts (students, teachers, admins)
- `classes` - Class information
- `exams` - Exam definitions
- `questions` - Exam questions
- `studentanswers` - Student responses and scores

See backend/src/models for full schema definitions.
