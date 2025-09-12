const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['multiple-choice', 'code-completion', 'true-false', 'fill-blank', 'code-output'],
    required: true
  },
  question: {
    type: String,
    required: true
  },
  code: {
    type: String, // For code-related questions
    default: ''
  },
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  correctAnswer: String,
  explanation: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    default: 10
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    trim: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
    required: true
  },
  questions: [quizQuestionSchema],
  passingScore: {
    type: Number,
    default: 70 // Percentage
  },
  timeLimit: {
    type: Number, // in minutes
    default: 15
  },
  maxAttempts: {
    type: Number,
    default: 3
  },
  xpReward: {
    type: Number,
    default: 50
  },
  isRequired: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Quiz', quizSchema);