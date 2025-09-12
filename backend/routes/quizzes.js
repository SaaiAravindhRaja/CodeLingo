const express = require('express');
const { body, validationResult } = require('express-validator');
const Quiz = require('../models/Quiz');
const Section = require('../models/Section');
const Course = require('../models/Course');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/quizzes/:id
// @desc    Get quiz questions (without answers)
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('sectionId', 'title courseId');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check if user is enrolled in the course
    const section = await Section.findById(quiz.sectionId._id);
    const user = await User.findById(req.user.id);
    
    const enrollment = user.progress.enrolledCourses.find(
      ec => ec.courseId.toString() === section.courseId.toString()
    );

    if (!enrollment) {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }

    // Check quiz attempts
    const quizAttempt = enrollment.quizAttempts.find(
      qa => qa.quizId.toString() === quiz._id.toString()
    );

    const attemptsUsed = quizAttempt ? quizAttempt.attempts.length : 0;
    
    if (attemptsUsed >= quiz.maxAttempts) {
      return res.status(403).json({ 
        message: 'Maximum attempts reached for this quiz',
        maxAttempts: quiz.maxAttempts,
        attemptsUsed
      });
    }

    // Remove correct answers from questions
    const quizObj = quiz.toObject();
    quizObj.questions = quizObj.questions.map(q => {
      const { correctAnswer, ...questionWithoutAnswer } = q;
      if (q.options) {
        questionWithoutAnswer.options = q.options.map(opt => ({
          text: opt.text
          // Remove isCorrect flag
        }));
      }
      return questionWithoutAnswer;
    });

    quizObj.userAttempts = {
      attemptsUsed,
      maxAttempts: quiz.maxAttempts,
      canRetake: attemptsUsed < quiz.maxAttempts
    };

    res.json({ quiz: quizObj });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ message: 'Server error fetching quiz' });
  }
});

// @route   POST /api/quizzes/:id/submit
// @desc    Submit quiz answers and get results
// @access  Private
router.post('/:id/submit', protect, [
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
    
    const quiz = await Quiz.findById(req.params.id)
      .populate('sectionId');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Verify enrollment and attempts
    const user = await User.findById(req.user.id);
    const enrollment = user.progress.enrolledCourses.find(
      ec => ec.courseId.toString() === quiz.sectionId.courseId.toString()
    );

    if (!enrollment) {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }

    let quizAttempt = enrollment.quizAttempts.find(
      qa => qa.quizId.toString() === quiz._id.toString()
    );

    if (!quizAttempt) {
      quizAttempt = {
        quizId: quiz._id,
        attempts: []
      };
      enrollment.quizAttempts.push(quizAttempt);
    }

    if (quizAttempt.attempts.length >= quiz.maxAttempts) {
      return res.status(403).json({ message: 'Maximum attempts reached' });
    }

    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = quiz.questions.length;
    const questionResults = [];

    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      let isCorrect = false;

      if (question.type === 'multiple-choice') {
        const correctOption = question.options.find(opt => opt.isCorrect);
        isCorrect = correctOption && userAnswer === correctOption.text;
      } else if (question.correctAnswer) {
        isCorrect = userAnswer && userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
      }

      if (isCorrect) {
        correctAnswers++;
      }

      questionResults.push({
        questionIndex: index,
        userAnswer,
        isCorrect,
        correctAnswer: question.correctAnswer || question.options.find(opt => opt.isCorrect)?.text,
        explanation: question.explanation
      });
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = score >= quiz.passingScore;

    // Record attempt
    const attempt = {
      score,
      passed,
      completedAt: new Date(),
      timeSpent: timeSpent || null
    };

    quizAttempt.attempts.push(attempt);

    // Calculate XP earned
    let xpEarned = 0;
    if (passed) {
      xpEarned = quiz.xpReward;
      
      // Bonus XP for perfect score
      if (score === 100) {
        xpEarned = Math.round(xpEarned * 1.5);
        user.addAchievement('perfect_quiz', 100);
      }
      
      // Speed bonus (if completed in less than half the time limit)
      if (timeSpent && timeSpent < (quiz.timeLimit * 60 / 2)) {
        xpEarned = Math.round(xpEarned * 1.2);
        user.addAchievement('speed_demon', 50);
      }

      // Add XP with quiz multiplier
      const finalXP = user.addXP(xpEarned, 'quiz');
      
      // Mark section as completed if this is the section quiz and user passed
      const existingCompletion = enrollment.completedSections.find(
        cs => cs.sectionId.toString() === quiz.sectionId._id.toString()
      );

      if (!existingCompletion) {
        enrollment.completedSections.push({
          sectionId: quiz.sectionId._id,
          completedAt: new Date(),
          score
        });

        // Update course progress
        const course = await Course.findById(quiz.sectionId.courseId);
        const totalSections = await Section.countDocuments({ courseId: course._id });
        enrollment.progress = Math.round((enrollment.completedSections.length / totalSections) * 100);

        // Check if course is completed
        if (enrollment.progress === 100) {
          user.addAchievement('course_complete', 500);
        }
      }

      // First quiz achievement
      if (user.progress.enrolledCourses.every(ec => 
        ec.quizAttempts.every(qa => qa.attempts.length === 0)
      )) {
        user.addAchievement('first_quiz', 100);
      }
    }

    user.updateStreak();
    await user.save();

    res.json({
      message: passed ? 'Quiz completed successfully!' : 'Quiz completed. Try again to improve your score.',
      results: {
        score,
        correctAnswers,
        totalQuestions,
        passed,
        passingScore: quiz.passingScore,
        xpEarned,
        timeSpent,
        attemptsUsed: quizAttempt.attempts.length,
        maxAttempts: quiz.maxAttempts,
        canRetake: quizAttempt.attempts.length < quiz.maxAttempts && !passed
      },
      questionResults: passed ? questionResults : null, // Only show detailed results if passed
      userProgress: {
        currentLevel: user.progress.currentLevel,
        totalXP: user.progress.totalXP,
        streak: user.progress.streak,
        xpForNextLevel: user.getXPForNextLevel()
      }
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ message: 'Server error submitting quiz' });
  }
});

// @route   GET /api/quizzes/:id/results
// @desc    Get quiz attempt history
// @access  Private
router.get('/:id/results', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('sectionId', 'title courseId');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const user = await User.findById(req.user.id);
    const enrollment = user.progress.enrolledCourses.find(
      ec => ec.courseId.toString() === quiz.sectionId.courseId.toString()
    );

    if (!enrollment) {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }

    const quizAttempt = enrollment.quizAttempts.find(
      qa => qa.quizId.toString() === quiz._id.toString()
    );

    const attempts = quizAttempt ? quizAttempt.attempts : [];
    const bestScore = attempts.length > 0 ? Math.max(...attempts.map(a => a.score)) : 0;
    const passed = attempts.some(a => a.passed);

    res.json({
      quiz: {
        id: quiz._id,
        title: quiz.title,
        passingScore: quiz.passingScore,
        maxAttempts: quiz.maxAttempts
      },
      attempts,
      summary: {
        totalAttempts: attempts.length,
        bestScore,
        passed,
        canRetake: attempts.length < quiz.maxAttempts && !passed
      }
    });
  } catch (error) {
    console.error('Get quiz results error:', error);
    res.status(500).json({ message: 'Server error fetching quiz results' });
  }
});

module.exports = router;