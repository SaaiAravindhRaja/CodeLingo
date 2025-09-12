// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  profile: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    bio?: string;
  };
  role: 'student' | 'instructor' | 'admin';
  progress: {
    currentLevel: number;
    totalXP: number;
    streak: number;
    lastActiveDate: string;
    completedLessons: CompletedLesson[];
  };
  preferences: {
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
    };
    theme: 'light' | 'dark' | 'auto';
  };
  emailVerified?: boolean;
  createdAt?: string;
}

export interface CompletedLesson {
  lessonId: string;
  score: number;
  completedAt: string;
}

// Lesson Types
export interface Question {
  _id: string;
  type: 'multiple-choice' | 'fill-blank' | 'translate' | 'match' | 'speaking';
  question: string;
  options?: QuestionOption[];
  correctAnswer?: string;
  explanation?: string;
  points: number;
  difficulty: string;
}

export interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

export interface Lesson {
  _id: string;
  title: string;
  description: string;
  language: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  order: number;
  estimatedTime: number;
  xpReward: number;
  prerequisites?: string[];
  content: {
    introduction?: string;
    vocabulary?: VocabularyItem[];
    grammarRules?: GrammarRule[];
  };
  questions: Question[];
  resources?: Resource[];
  tags?: string[];
  isPublished: boolean;
  createdBy: string;
  stats?: {
    totalAttempts: number;
    averageScore: number;
    completionRate: number;
  };
  userProgress?: {
    completed: boolean;
    score?: number;
    completedAt?: string;
  };
  prerequisitesMet?: boolean;
}

export interface VocabularyItem {
  word: string;
  translation: string;
  pronunciation?: string;
  example?: string;
}

export interface GrammarRule {
  rule: string;
  explanation: string;
  examples: string[];
}

export interface Resource {
  type: 'audio' | 'video' | 'image' | 'document';
  url: string;
  title: string;
  description?: string;
}

// API Response Types
export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

export interface UserResponse {
  user: User;
}

export interface LessonsResponse {
  lessons: Lesson[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalLessons: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface LessonResponse {
  lesson: Lesson;
}

export interface LessonCompleteResponse {
  results: {
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    xpEarned: number;
    passed: boolean;
    timeSpent?: number;
  };
  userProgress?: {
    currentLevel: number;
    totalXP: number;
    streak: number;
  };
  message?: string;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  totalXP: number;
  level: number;
  streak: number;
}

// Course Types
export interface Course {
  _id: string;
  title: string;
  description: string;
  language: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  thumbnail?: string;
  estimatedHours: number;
  totalXP: number;
  prerequisites?: string[];
  sections: Section[];
  tags: string[];
  isPublished: boolean;
  createdBy: string;
  stats: {
    totalEnrollments: number;
    averageRating: number;
    completionRate: number;
  };
  pricing: {
    isFree: boolean;
    price: number;
  };
  userProgress?: {
    enrolled: boolean;
    progress: number;
    enrolledAt?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Section {
  _id: string;
  title: string;
  description?: string;
  courseId: string;
  order: number;
  estimatedMinutes: number;
  xpReward: number;
  lessons: Lesson[];
  quiz?: Quiz;
  isLocked: boolean;
  prerequisites?: string[];
  userProgress?: {
    completed: boolean;
    completedAt?: string;
    score?: number;
  };
}

export interface Quiz {
  _id: string;
  title: string;
  description?: string;
  sectionId: string;
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit: number;
  maxAttempts: number;
  xpReward: number;
  isRequired: boolean;
  userAttempts?: {
    attemptsUsed: number;
    maxAttempts: number;
    canRetake: boolean;
  };
}

export interface QuizQuestion {
  _id: string;
  type: 'multiple-choice' | 'code-completion' | 'true-false' | 'fill-blank' | 'code-output';
  question: string;
  code?: string;
  options?: QuizOption[];
  correctAnswer?: string;
  explanation: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizOption {
  text: string;
  isCorrect?: boolean; // Hidden from students
}

// Course API Response Types
export interface CoursesResponse {
  courses: Course[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalCourses: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CourseResponse {
  course: Course;
}

export interface QuizResponse {
  quiz: Quiz;
}

export interface QuizSubmitResponse {
  message: string;
  results: {
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    passed: boolean;
    passingScore: number;
    xpEarned: number;
    timeSpent?: number;
    attemptsUsed: number;
    maxAttempts: number;
    canRetake: boolean;
  };
  questionResults?: QuestionResult[];
  userProgress: {
    currentLevel: number;
    totalXP: number;
    streak: number;
    xpForNextLevel: {
      current: number;
      required: number;
      remaining: number;
    };
  };
}

export interface QuestionResult {
  questionIndex: number;
  userAnswer: string;
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
}

// API Error Types
export interface ApiError {
  message: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}