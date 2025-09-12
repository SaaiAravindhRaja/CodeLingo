# CodeLingo API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [...], // Optional validation errors
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "login": "johndoe", // username or email
  "password": "Password123!"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

### Courses

#### Get All Courses
```http
GET /courses?language=python&level=beginner&search=intro
```

**Query Parameters:**
- `language`: Filter by programming language
- `level`: Filter by difficulty level
- `search`: Search in title/description
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

#### Get Course Details
```http
GET /courses/:courseId
```

#### Enroll in Course
```http
POST /courses/:courseId/enroll
Authorization: Bearer <token>
```

#### Get Section Details
```http
GET /courses/:courseId/sections/:sectionId
Authorization: Bearer <token>
```

### Quizzes

#### Get Quiz Questions
```http
GET /quizzes/:quizId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "quiz": {
    "id": "quiz_id",
    "title": "Python Basics Quiz",
    "description": "Test your Python knowledge",
    "timeLimit": 15,
    "questions": [
      {
        "type": "multiple-choice",
        "question": "What is Python?",
        "options": [
          { "text": "A programming language" },
          { "text": "A snake" }
        ]
      }
    ],
    "userAttempts": {
      "attemptsUsed": 1,
      "maxAttempts": 3,
      "canRetake": true
    }
  }
}
```

#### Submit Quiz Answers
```http
POST /quizzes/:quizId/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "answers": ["A programming language", "True"],
  "timeSpent": 300
}
```

**Response:**
```json
{
  "message": "Quiz completed successfully!",
  "results": {
    "score": 85,
    "correctAnswers": 8,
    "totalQuestions": 10,
    "passed": true,
    "xpEarned": 150
  },
  "userProgress": {
    "currentLevel": 3,
    "totalXP": 2150,
    "streak": 7
  }
}
```

### Users

#### Get Leaderboard
```http
GET /users/leaderboard?limit=10
```

#### Get User Progress
```http
GET /users/progress
Authorization: Bearer <token>
```

### Admin (Admin Only)

#### Get Dashboard Stats
```http
GET /admin/dashboard
Authorization: Bearer <admin_token>
```

#### Get All Users
```http
GET /admin/users?page=1&limit=20&role=student&status=active
```

#### Update User Status
```http
PUT /admin/users/:userId/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "isActive": false
}
```

#### Update User Role
```http
PUT /admin/users/:userId/role
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "role": "instructor"
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Headers**: Rate limit info in response headers

## Validation Rules

### User Registration
- **Username**: 3-30 characters, alphanumeric + underscore
- **Email**: Valid email format
- **Password**: Min 6 chars, must contain uppercase, lowercase, and number

### Course Enrollment
- User must not be already enrolled
- Course must be published

### Quiz Submission
- User must be enrolled in course
- Must not exceed maximum attempts
- Answers array must match question count

## Sample Data

After running `npm run seed`, you can use these test accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@codelingo.com | Admin123! |
| Instructor | python.instructor@codelingo.com | Instructor123! |
| Student | student1@example.com | Student123! |

## Testing the API

### Using curl

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"Test123!"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"testuser","password":"Test123!"}'

# Get courses (with token from login response)
curl -X GET http://localhost:5000/api/courses \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

1. Import the API endpoints
2. Set up environment variables for base URL and token
3. Use the authentication endpoints to get a token
4. Test protected endpoints with the token

## WebSocket Events (Future)

The API is designed to support real-time features:

- Live quiz sessions
- Real-time progress updates
- Collaborative coding sessions
- Chat functionality

## Pagination

List endpoints support pagination:

```json
{
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Filtering and Sorting

Most list endpoints support:

- **Filtering**: Query parameters for specific fields
- **Sorting**: `sort` parameter with field names
- **Search**: `search` parameter for text search
- **Date ranges**: `startDate` and `endDate` parameters