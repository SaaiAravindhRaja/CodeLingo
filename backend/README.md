# CodeLingo Backend API

A Node.js/Express backend for the CodeLingo language learning platform with user authentication, lesson management, and progress tracking.

## Features

- **User Authentication**: JWT-based auth with registration, login, and profile management
- **Lesson Management**: CRUD operations for language lessons with different question types
- **Progress Tracking**: User XP, levels, streaks, and completion tracking
- **Role-based Access**: Student, Instructor, and Admin roles with appropriate permissions
- **Security**: Helmet, CORS, rate limiting, and input validation
- **Database**: MongoDB with Mongoose ODM

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/codelingo
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /me` - Get current user profile
- `PUT /profile` - Update user profile
- `POST /change-password` - Change password
- `POST /logout` - Logout user

### Lessons (`/api/lessons`)
- `GET /` - Get all lessons (with filtering)
- `GET /:id` - Get single lesson
- `POST /` - Create lesson (Instructor/Admin)
- `PUT /:id` - Update lesson (Instructor/Admin)
- `DELETE /:id` - Delete lesson (Instructor/Admin)
- `POST /:id/complete` - Complete lesson and submit answers
- `GET /:id/stats` - Get lesson statistics (Instructor/Admin)

### Users (`/api/users`)
- `GET /leaderboard` - Get user leaderboard
- `GET /progress` - Get current user's progress
- `GET /stats` - Get user statistics (Admin)
- `GET /:id` - Get user by ID (Admin)
- `PUT /:id/status` - Update user status (Admin)
- `PUT /:id/role` - Update user role (Admin)

### Health Check
- `GET /api/health` - Server health status

## Data Models

### User Model
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    bio: String
  },
  progress: {
    currentLevel: Number,
    totalXP: Number,
    streak: Number,
    lastActiveDate: Date,
    completedLessons: [...]
  },
  preferences: {
    language: String,
    notifications: {...},
    theme: String
  },
  role: String, // 'student', 'instructor', 'admin'
  isActive: Boolean,
  emailVerified: Boolean
}
```

### Lesson Model
```javascript
{
  title: String,
  description: String,
  language: String, // 'spanish', 'french', etc.
  level: String, // 'beginner', 'intermediate', 'advanced'
  category: String, // 'vocabulary', 'grammar', etc.
  order: Number,
  estimatedTime: Number,
  xpReward: Number,
  prerequisites: [ObjectId],
  content: {
    introduction: String,
    vocabulary: [...],
    grammarRules: [...]
  },
  questions: [{
    type: String, // 'multiple-choice', 'fill-blank', etc.
    question: String,
    options: [...],
    correctAnswer: String,
    explanation: String,
    points: Number,
    difficulty: String
  }],
  resources: [...],
  tags: [String],
  isPublished: Boolean,
  createdBy: ObjectId,
  stats: {
    totalAttempts: Number,
    averageScore: Number,
    completionRate: Number
  }
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Error Handling

The API returns consistent error responses:

```json
{
  "message": "Error description",
  "errors": [...] // Validation errors if applicable
}
```

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Express-validator for request validation
- **Password Hashing**: bcryptjs with salt rounds
- **JWT**: Secure token-based authentication

## Development

### Running Tests
```bash
npm test
```

### Code Structure
```
backend/
├── models/          # Mongoose models
├── routes/          # Express routes
├── middleware/      # Custom middleware
├── server.js        # Main server file
├── package.json     # Dependencies
└── README.md        # This file
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/codelingo |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRE` | JWT expiration time | 7d |
| `NODE_ENV` | Environment mode | development |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License