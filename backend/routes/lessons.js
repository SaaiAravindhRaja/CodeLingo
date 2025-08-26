const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Lesson = require('../models/Lesson');
const User = require('../models/User');
const { protect, instructor, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/lessons
// @desc    Get all lessons with filtering and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('language').optional().isIn(['spanish', 'french', 'german', 'italian', 'portuguese', 'japanese', 'korean', 'chinese']),
  query('level').optional().isIn(['beginner', 'intermediate', 'advanced']),
  query('category').optional().isIn(['vocabulary', 'grammar', 'conversation', 'pronunciation', 'culture'])
], optionalAuth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { isPublished: true };
    
    if (req.query.language) filter.language = req.query.language;
    if (req.query.level) filter.level = req.query.level;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }

    // Get lessons with pagination
    const lessons = await Lesson.find(filter)
      .select('-questions.correctAnswer -questions.explanation') // Hide answers for public access
      .populate('createdBy', 'username profile.firstName profile.lastName')
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Lesson.countDocuments(filter);

    // Add user progress if authenticated
    let lessonsWithProgress = lessons;
    if (req.user) {
      lessonsWithProgress = lessons.map(lesson => {
        const lessonObj = lesson.toObject();
        const completed = req.user.progress.completedLessons.find(
          cl => cl.lessonId.toString() === lesson._id.toString()
        );
        lessonObj.userProgress = completed ? {
          completed: true,
          score: completed.score,
          completedAt: completed.completedAt
        } : { completed: false };
        return lessonObj;
      });
    }

    res.json({
      lessons: lessonsWithProgress,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalLessons: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get lessons error:', error);
    res.status(500).json({ message: 'Server error fetching lessons' });
  }
});

// @route   GET /api/lessons/:id
// @desc    Get single lesson by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate('createdBy', 'username profile.firstName profile.lastName')
      .populate('prerequisites', 'title level');

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    if (!lesson.isPublished && (!req.user || req.user.role === 'student')) {
      return res.status(403).json({ message: 'Lesson not available' });
    }

    const lessonObj = lesson.toObject();

    // Add user progress if authenticated
    if (req.user) {
      const completed = req.user.progress.completedLessons.find(
        cl => cl.lessonId.toString() === lesson._id.toString()
      );
      lessonObj.userProgress = completed ? {
        completed: true,
        score: completed.score,
        completedAt: completed.completedAt
      } : { completed: false };

      // Check if prerequisites are met
      const prerequisitesMet = await Promise.all(
        lesson.prerequisites.map(async (prereq) => {
          return req.user.progress.completedLessons.some(
            cl => cl.lessonId.toString() === prereq._id.toString()
          );
        })
      );
      lessonObj.prerequisitesMet = prerequisitesMet.every(met => met);
    }

    // Hide answers for students
    if (!req.user || req.user.role === 'student') {
      lessonObj.questions = lessonObj.questions.map(q => {
        const { correctAnswer, explanation, ...questionWithoutAnswer } = q;
        return questionWithoutAnswer;
      });
    }

    res.json({ lesson: lessonObj });
  } catch (error) {
    console.error('Get lesson error:', error);
    res.status(500).json({ message: 'Server error fetching lesson' });
  }
});

// @route   POST /api/lessons
// @desc    Create a new lesson
// @access  Private (Instructor/Admin)
router.post('/', protect, instructor, [
  body('title').notEmpty().isLength({ max: 100 }).withMessage('Title is required and cannot exceed 100 characters'),
  body('description').notEmpty().isLength({ max: 500 }).withMessage('Description is required and cannot exceed 500 characters'),
  body('language').isIn(['spanish', 'french', 'german', 'italian', 'portuguese', 'japanese', 'korean', 'chinese']),
  body('level').isIn(['beginner', 'intermediate', 'advanced']),
  body('category').isIn(['vocabulary', 'grammar', 'conversation', 'pronunciation', 'culture']),
  body('order').isInt({ min: 1 }).withMessage('Order must be a positive integer'),
  body('questions').isArray({ min: 1 }).withMessage('At least one question is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const lessonData = {
      ...req.body,
      createdBy: req.user.id
    };

    const lesson = new Lesson(lessonData);
    await lesson.save();

    res.status(201).json({
      message: 'Lesson created successfully',
      lesson
    });
  } catch (error) {
    console.error('Create lesson error:', error);
    res.status(500).json({ message: 'Server error creating lesson' });
  }
});

// @route   PUT /api/lessons/:id
// @desc    Update a lesson
// @access  Private (Instructor/Admin)
router.put('/:id', protect, instructor, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Check if user owns the lesson or is admin
    if (lesson.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this lesson' });
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'username profile.firstName profile.lastName');

    res.json({
      message: 'Lesson updated successfully',
      lesson: updatedLesson
    });
  } catch (error) {
    console.error('Update lesson error:', error);
    res.status(500).json({ message: 'Server error updating lesson' });
  }
});

// @route   DELETE /api/lessons/:id
// @desc    Delete a lesson
// @access  Private (Instructor/Admin)
router.delete('/:id', protect, instructor, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Check if user owns the lesson or is admin
    if (lesson.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this lesson' });
    }

    await Lesson.findByIdAndDelete(req.params.id);

    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Delete lesson error:', error);
    res.status(500).json({ message: 'Server error deleting lesson' });
  }
});

// @route   POST /api/lessons/:id/complete
// @desc    Mark lesson as completed and submit answers
// @access  Private
router.post('/:id/complete', protect, [
  body('answers').isArray().withMessage('Answers must be an array'),
  body('timeSpent').optional().isInt({ min: 1 }).withMessage('Time spent must be a positive integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { answers, timeSpent } = req.body;
    
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    if (!lesson.isPublished) {
      return res.status(403).json({ message: 'Lesson not available' });
    }

    // Check if already completed
    const alreadyCompleted = req.user.progress.completedLessons.find(
      cl => cl.lessonId.toString() === lesson._id.toString()
    );

    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = lesson.questions.length;
    
    lesson.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      if (question.type === 'multiple-choice') {
        const correctOption = question.options.find(opt => opt.isCorrect);
        if (correctOption && userAnswer === correctOption.text) {
          correctAnswers++;
        }
      } else if (question.correctAnswer && userAnswer === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const xpEarned = score >= 70 ? lesson.xpReward : Math.round(lesson.xpReward * 0.5);

    // Update user progress
    const user = await User.findById(req.user.id);
    
    if (alreadyCompleted) {
      // Update existing completion if score is better
      if (score > alreadyCompleted.score) {
        alreadyCompleted.score = score;
        alreadyCompleted.completedAt = new Date();
        user.addXP(xpEarned - Math.round(lesson.xpReward * (alreadyCompleted.score >= 70 ? 1 : 0.5)));
      }
    } else {
      // Add new completion
      user.progress.completedLessons.push({
        lessonId: lesson._id,
        score,
        completedAt: new Date()
      });
      user.addXP(xpEarned);
    }

    user.updateStreak();
    await user.save();

    // Update lesson stats
    lesson.updateStats(score);
    await lesson.save();

    res.json({
      message: 'Lesson completed successfully',
      results: {
        score,
        correctAnswers,
        totalQuestions,
        xpEarned,
        passed: score >= 70,
        timeSpent: timeSpent || null
      },
      userProgress: {
        currentLevel: user.progress.currentLevel,
        totalXP: user.progress.totalXP,
        streak: user.progress.streak
      }
    });
  } catch (error) {
    console.error('Complete lesson error:', error);
    res.status(500).json({ message: 'Server error completing lesson' });
  }
});

// @route   GET /api/lessons/:id/stats
// @desc    Get lesson statistics
// @access  Private (Instructor/Admin)
router.get('/:id/stats', protect, instructor, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Check if user owns the lesson or is admin
    if (lesson.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view lesson stats' });
    }

    res.json({
      stats: lesson.stats,
      lesson: {
        id: lesson._id,
        title: lesson.title,
        language: lesson.language,
        level: lesson.level,
        category: lesson.category
      }
    });
  } catch (error) {
    console.error('Get lesson stats error:', error);
    res.status(500).json({ message: 'Server error fetching lesson stats' });
  }
});

module.exports = router;