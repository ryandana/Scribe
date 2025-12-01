# Implementation Roadmap & Architecture

## ✅ Phase 1: Frontend Integration (COMPLETED)

### What's Been Done

1. **Authentication System**

   - Login/logout with JWT cookies
   - Role-based redirects (student → /dashboard/student, teacher → /dashboard/teacher, admin → /dashboard/admin)
   - Protected routes with useProtectedRoute & useRoleProtectedRoute hooks

2. **Dashboard Architecture**

   - DashboardLayout component with sidebar navigation
   - Role-aware menu items
   - Responsive design (mobile & desktop)

3. **Dashboard Pages**

   - Student Dashboard: View exams, results, profile
   - Teacher Dashboard: View classes, exams, results
   - Admin Dashboard: Manage users, classes, exams, results

4. **Management Pages**

   - User creation with role-based fields
   - Class creation with grade levels
   - Exam listing and management stubs
   - Question management stubs

5. **Backend Integration**
   - Added getAllUsers endpoint to backend
   - Integrated with existing class, exam, and auth endpoints
   - Proper error handling and loading states

## 📋 Phase 2: Exam Taking Interface (NEXT)

### Required Components

1. **Exam Display Page** (`/dashboard/student/exams/[id]/take`)

   - Display exam title, description, duration
   - Show question counter (e.g., "Question 3 of 20")
   - Display current question with options
   - Navigation: Previous/Next buttons

2. **Question Display**

   - Render questionText from backend
   - Display options array as radio buttons
   - Show question images if any
   - Mark questions as "doubtful" (flag)

3. **Timer Functionality**

   - Convert exam.timer (minutes) to countdown timer
   - Display time remaining
   - Auto-submit when time runs out
   - Warning alerts at 5 minutes, 1 minute remaining

4. **Answer Auto-Save**

   - POST to `/api/studentAnswers/autosave` with:
     - examId, studentId, answers array
     - Include doubtful flags
   - Save on every answer change
   - Show "Saving..." indicator
   - Handle save failures gracefully

5. **Answer Submission**
   - "Submit Exam" button
   - Confirmation dialog
   - POST final answers to `/api/studentAnswers/submit`
   - Lock exam after submission
   - Redirect to results page

### Backend Endpoints Needed

```javascript
// StudentAnswer endpoints (need to create in backend)
POST /api/studentAnswers/autosave
  Body: { examId, answers: [{questionId, selectedOption, doubtful}] }
  Response: { success, savedAt }

POST /api/studentAnswers/submit
  Body: { examId, answers: [{questionId, selectedOption}] }
  Response: { success, score, results }

GET /api/studentAnswers/:examId/:studentId
  Response: { examId, studentId, answers, score, isLocked }
```

### Frontend Components to Create

```
/src/components/
├── exam/
│   ├── ExamTimer.jsx - Countdown timer
│   ├── QuestionDisplay.jsx - Single question renderer
│   ├── AnswerOptions.jsx - Radio button group
│   ├── ExamProgress.jsx - Progress bar/counter
│   ├── DoubtfulFlag.jsx - Flag button for questions
│   └── AnswerAutoSave.jsx - Autosave indicator

/src/app/dashboard/student/exams/[id]/
├── page.jsx - Exam taking interface
└── layout.jsx - Exam-specific layout (full width, no sidebar)
```

### Implementation Steps

1. Create ExamTimer hook using setInterval
2. Create QuestionDisplay component to map question data
3. Implement autosave with debouncing (save every 3 seconds)
4. Add exam locking logic after submission
5. Calculate score based on correct answers

## 🖼️ Phase 3: Image Upload & Compression

### Required Features

1. **Question Image Upload** (Teacher)

   - Upload image when creating question
   - Store in `/public/uploads/exams/{examId}/questions/{questionId}/`
   - Save relative path to MongoDB

2. **Student Answer Images** (Student)

   - Upload image as part of answer for a question
   - Store in `/public/uploads/exams/{examId}/answers/{studentId}/`
   - Link image to specific question answer

3. **Image Compression**
   - Use Sharp or ImageMagick in backend
   - Compress on upload before storing
   - Keep aspect ratio
   - Target max 500KB per image

### Backend Setup

```bash
npm install sharp
```

### Controller Logic Needed

```javascript
// In question.controller.js
export const addQuestionWithImage = async (req, res) => {
  const { examId } = req.params;
  const { questionText, options, answerKey } = req.body;
  const imageFile = req.file; // from multer

  // 1. Create upload folder structure
  const uploadPath = `public/uploads/exams/${examId}/questions/${newQuestion._id}/`;

  // 2. Compress image with Sharp
  await sharp(imageFile.path)
    .resize(1920, 1080, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toFile(`${uploadPath}${imageFile.filename}`);

  // 3. Save relative path to MongoDB
  newQuestion.imageUrl = `/uploads/exams/${examId}/questions/${newQuestion._id}/${imageFile.filename}`;

  // 4. Clean up temp file
  fs.unlinkSync(imageFile.path);
};
```

### Frontend Components

```javascript
// /src/components/upload/
├── ImageUpload.jsx - File input with preview
├── ImageCompressor.jsx - Client-side compression
└── ProgressUpload.jsx - Upload progress bar

// Usage in question creation form
<ImageUpload
  onUpload={(file) => setFormData({...formData, image: file})}
  accept="image/*"
  maxSize={5000000}
/>
```

## 📊 Phase 4: Results & Grading

### Features

1. **Automatic Scoring**

   - Compare studentAnswer.selectedOption with question.answerKey
   - Calculate total score
   - Store in studentAnswer.score

2. **Student Results View**

   - Show overall score and percentage
   - List each question with:
     - Student's answer
     - Correct answer (after submission)
     - Mark as correct/incorrect
   - Show images for reference

3. **Teacher Results Dashboard**

   - List all students in class with scores
   - Filter by exam
   - Sort by score
   - Export results to CSV

4. **Admin Results View**
   - All classes, all exams
   - Detailed analytics
   - Score distribution charts

### Backend Endpoints

```javascript
GET /api/studentAnswers/:examId/:studentId
  - Get student's answers and score

GET /api/exams/:examId/results
  - Get all results for an exam

GET /api/classes/:classId/results
  - Get all results for a class
```

## 🔒 Phase 5: Advanced Security & Features

### Security

1. **Admin-Only Actions**

   - Add middleware to check admin role before user/class creation
   - Add middleware to check teacher/admin for exam creation

2. **Data Validation**

   - Validate all form inputs server-side
   - Sanitize inputs
   - Rate limiting on auth endpoints

3. **Exam Integrity**
   - Verify student belongs to exam's class
   - Prevent multiple submissions
   - Log all exam activities

### Advanced Features

1. **Bulk User Import**

   - CSV file upload
   - Parse and create multiple users
   - Generate temporary passwords
   - Send credentials via email

2. **Exam Scheduling**

   - Set exam start and end times
   - Auto-lock exam outside time window
   - Show "not started" or "ended" status

3. **Email Notifications**
   - Send exam invitations to students
   - Notify results
   - Teacher notifications for submissions

## 📁 File Structure After All Phases

```
frontend/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── student/
│   │   │   │   ├── exams/
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   ├── page.jsx (EXAM TAKING)
│   │   │   │   │   │   └── layout.jsx
│   │   │   │   │   └── page.jsx
│   │   │   ├── teacher/
│   │   │   │   ├── exams/
│   │   │   │   │   ├── create/page.jsx (PHASE 2)
│   │   │   │   │   └── [id]/edit/page.jsx (PHASE 2)
│   │   ├── register/ (Disable this - admin creates users)
│   ├── components/
│   │   ├── exam/ (PHASE 2)
│   │   ├── upload/ (PHASE 3)
│   │   └── charts/ (PHASE 4)
│   └── hooks/
│       └── useExamTimer.js (PHASE 2)
└── public/
    └── uploads/ (PHASE 3)
       ├── exams/
       │   ├── [examId]/
       │   │   ├── questions/
       │   │   │   └── [questionId]/
       │   │   └── answers/
       │   │       └── [studentId]/
```

## 💾 Database Schema Validation

### Verify these collections exist:

```javascript
// User
{
  nis: Number (nullable),
  username: String,
  nickname: String,
  email: String,
  password: String (hashed),
  role: String ("student", "teacher", "admin"),
  classId: ObjectId (ref Class),
  createdAt: Date,
  updatedAt: Date
}

// Class
{
  className: String,
  gradeLevel: String ("X", "XI", "XII"),
  major: String,
  createdAt: Date,
  updatedAt: Date
}

// Exam
{
  examTitle: String,
  classId: ObjectId (ref Class),
  createdBy: ObjectId (ref User),
  category: String ("PTS", "PAS", "Daily", "Practice"),
  timer: Number (minutes),
  status: String ("draft", "ongoing", "finished"),
  startTime: Date (optional),
  endTime: Date (optional),
  shuffleQuestions: Boolean,
  createdAt: Date,
  updatedAt: Date
}

// Question
{
  examId: ObjectId (ref Exam),
  questionText: String,
  options: [String],
  answerKey: String,
  imageUrl: String (optional),
  points: Number,
  shuffleOptions: Boolean,
  createdAt: Date,
  updatedAt: Date
}

// StudentAnswer
{
  examId: ObjectId (ref Exam),
  studentId: ObjectId (ref User),
  answers: [{
    questionId: ObjectId,
    selectedOption: String,
    isCorrect: Boolean
  }],
  submittedAt: Date,
  score: Number,
  gradingStatus: String ("pending", "graded"),
  createdAt: Date,
  updatedAt: Date
}
```

## ⚡ Quick Commands

### Development

```bash
# Terminal 1 - Backend
cd backend && pnpm dev

# Terminal 2 - Frontend
cd frontend && pnpm dev

# Browser
open http://localhost:3000
```

### Testing

```bash
# Check for lint errors
cd frontend && pnpm lint
cd backend && pnpm lint

# Build for production
cd frontend && pnpm build
```

## 🎯 Success Criteria for Each Phase

**Phase 1 (DONE)**:

- [x] Login/logout working
- [x] Dashboard role redirects working
- [x] Protected routes enforcing role access
- [x] Admin can create users and classes

**Phase 2 (TODO)**:

- [ ] Student can take exam with timer
- [ ] Questions display correctly
- [ ] Answer autosave working
- [ ] Exam submission locks answers

**Phase 3 (TODO)**:

- [ ] Teachers can upload images with questions
- [ ] Students can upload answer images
- [ ] Images are compressed on upload
- [ ] Images serve correctly

**Phase 4 (TODO)**:

- [ ] Automatic score calculation
- [ ] Results display for students
- [ ] Results dashboard for teachers
- [ ] Export results functionality

**Phase 5 (TODO)**:

- [ ] Bulk user import working
- [ ] Exam scheduling enforced
- [ ] Email notifications sent
- [ ] All security validations in place

## 📞 Support & Questions

Refer to QUICKSTART.md for running the app and FRONTEND_IMPLEMENTATION.md for current architecture.
