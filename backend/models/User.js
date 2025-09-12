const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  profile: {
    firstName: {
      type: String,
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    avatar: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    }
  },
  progress: {
    currentLevel: {
      type: Number,
      default: 1
    },
    totalXP: {
      type: Number,
      default: 0
    },
    streak: {
      type: Number,
      default: 0
    },
    lastActiveDate: {
      type: Date,
      default: Date.now
    },
    enrolledCourses: [{
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      },
      enrolledAt: {
        type: Date,
        default: Date.now
      },
      progress: {
        type: Number,
        default: 0 // Percentage
      },
      completedSections: [{
        sectionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Section'
        },
        completedAt: {
          type: Date,
          default: Date.now
        },
        score: {
          type: Number,
          min: 0,
          max: 100
        }
      }],
      completedLessons: [{
        lessonId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Lesson'
        },
        completedAt: {
          type: Date,
          default: Date.now
        },
        score: {
          type: Number,
          min: 0,
          max: 100
        }
      }],
      quizAttempts: [{
        quizId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Quiz'
        },
        attempts: [{
          score: Number,
          passed: Boolean,
          completedAt: {
            type: Date,
            default: Date.now
          },
          timeSpent: Number // in seconds
        }]
      }]
    }],
    achievements: [{
      type: {
        type: String,
        enum: ['first_lesson', 'first_quiz', 'streak_7', 'streak_30', 'level_up', 'course_complete', 'perfect_quiz', 'speed_demon']
      },
      earnedAt: {
        type: Date,
        default: Date.now
      },
      xpBonus: {
        type: Number,
        default: 0
      }
    }],
    weeklyXP: {
      type: Number,
      default: 0
    },
    monthlyXP: {
      type: Number,
      default: 0
    }
  },
  preferences: {
    language: {
      type: String,
      default: 'en'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    }
  },
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update streak method
userSchema.methods.updateStreak = function() {
  const today = new Date();
  const lastActive = new Date(this.progress.lastActiveDate);
  const diffTime = Math.abs(today - lastActive);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    this.progress.streak += 1;
  } else if (diffDays > 1) {
    this.progress.streak = 1;
  }
  
  this.progress.lastActiveDate = today;
};

// Add XP method with multipliers and bonuses
userSchema.methods.addXP = function(points, type = 'lesson') {
  let finalPoints = points;
  
  // Apply multipliers based on activity type
  const multipliers = {
    lesson: 1.0,
    quiz: 1.5,
    perfect_quiz: 2.0,
    streak_bonus: 0.1 * this.progress.streak, // 10% per streak day
    first_time: 1.2
  };
  
  if (multipliers[type]) {
    finalPoints = Math.round(points * multipliers[type]);
  }
  
  // Streak bonus (additional XP based on current streak)
  if (this.progress.streak > 0) {
    const streakBonus = Math.round(points * multipliers.streak_bonus);
    finalPoints += streakBonus;
  }
  
  this.progress.totalXP += finalPoints;
  this.progress.weeklyXP += finalPoints;
  this.progress.monthlyXP += finalPoints;
  
  // Advanced level up logic with increasing XP requirements
  const getXPRequiredForLevel = (level) => {
    return Math.floor(1000 * Math.pow(1.2, level - 1));
  };
  
  let currentLevelXP = 0;
  for (let i = 1; i < this.progress.currentLevel; i++) {
    currentLevelXP += getXPRequiredForLevel(i);
  }
  
  while (this.progress.totalXP >= currentLevelXP + getXPRequiredForLevel(this.progress.currentLevel)) {
    currentLevelXP += getXPRequiredForLevel(this.progress.currentLevel);
    this.progress.currentLevel += 1;
    
    // Award level up achievement
    this.addAchievement('level_up', 100);
  }
  
  return finalPoints;
};

// Add achievement method
userSchema.methods.addAchievement = function(type, xpBonus = 0) {
  const existingAchievement = this.progress.achievements.find(a => a.type === type);
  
  if (!existingAchievement) {
    this.progress.achievements.push({
      type,
      xpBonus,
      earnedAt: new Date()
    });
    
    if (xpBonus > 0) {
      this.progress.totalXP += xpBonus;
    }
    
    return true;
  }
  
  return false;
};

// Get XP required for next level
userSchema.methods.getXPForNextLevel = function() {
  const getXPRequiredForLevel = (level) => {
    return Math.floor(1000 * Math.pow(1.2, level - 1));
  };
  
  let currentLevelXP = 0;
  for (let i = 1; i < this.progress.currentLevel; i++) {
    currentLevelXP += getXPRequiredForLevel(i);
  }
  
  const nextLevelXP = currentLevelXP + getXPRequiredForLevel(this.progress.currentLevel);
  
  return {
    current: this.progress.totalXP - currentLevelXP,
    required: getXPRequiredForLevel(this.progress.currentLevel),
    remaining: nextLevelXP - this.progress.totalXP
  };
};

module.exports = mongoose.model('User', userSchema);