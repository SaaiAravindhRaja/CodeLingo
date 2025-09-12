const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
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
  thumbnail: {
    type: String,
    default: ''
  },
  estimatedHours: {
    type: Number,
    default: 10
  },
  totalXP: {
    type: Number,
    default: 0
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  sections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section'
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
    totalEnrollments: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0
    }
  },
  pricing: {
    isFree: {
      type: Boolean,
      default: true
    },
    price: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index for efficient querying
courseSchema.index({ language: 1, level: 1 });
courseSchema.index({ isPublished: 1 });
courseSchema.index({ 'stats.averageRating': -1 });

module.exports = mongoose.model('Course', courseSchema);