const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['multiple-choice', 'fill-blank', 'translate', 'match', 'speaking'],
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  correctAnswer: String,
  explanation: String,
  points: {
    type: Number,
    default: 10
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  }
});

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Lesson description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  language: {
    type: String,
    required: [true, 'Programming language is required'],
    enum: ['python', 'javascript', 'java', 'cpp', 'csharp', 'go', 'rust', 'swift', 'kotlin', 'php', 'ruby', 'typescript']
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  category: {
    type: String,
    enum: ['basics', 'data-structures', 'algorithms', 'oop', 'web-development', 'databases', 'testing', 'advanced'],
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  estimatedTime: {
    type: Number, // in minutes
    default: 15
  },
  xpReward: {
    type: Number,
    default: 50
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  content: {
    introduction: {
      type: String,
      maxlength: [2000, 'Introduction cannot exceed 2000 characters']
    },
    concepts: [{
      concept: String,
      explanation: String,
      codeExample: String,
      output: String
    }],
    exercises: [{
      title: String,
      description: String,
      starterCode: String,
      solution: String,
      hints: [String]
    }]
  },
  questions: [questionSchema],
  resources: [{
    type: {
      type: String,
      enum: ['audio', 'video', 'image', 'document']
    },
    url: String,
    title: String,
    description: String
  }],
  tags: [String],
  isPublished: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stats: {
    totalAttempts: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index for efficient querying
lessonSchema.index({ language: 1, level: 1, category: 1 });
lessonSchema.index({ order: 1 });
lessonSchema.index({ isPublished: 1 });

// Update stats method
lessonSchema.methods.updateStats = function(score) {
  this.stats.totalAttempts += 1;
  
  // Update average score
  const totalScore = (this.stats.averageScore * (this.stats.totalAttempts - 1)) + score;
  this.stats.averageScore = totalScore / this.stats.totalAttempts;
  
  // Update completion rate (assuming score >= 70 is completion)
  if (score >= 70) {
    this.stats.completionRate = ((this.stats.completionRate * (this.stats.totalAttempts - 1)) + 100) / this.stats.totalAttempts;
  } else {
    this.stats.completionRate = (this.stats.completionRate * (this.stats.totalAttempts - 1)) / this.stats.totalAttempts;
  }
};

module.exports = mongoose.model('Lesson', lessonSchema);