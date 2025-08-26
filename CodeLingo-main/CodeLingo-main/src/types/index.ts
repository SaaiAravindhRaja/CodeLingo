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

// API Error Types
export interface ApiError {
  message: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}