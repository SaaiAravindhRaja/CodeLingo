const express = require('express');
const { query } = require('express-validator');
const User = require('../models/User');
const Course = require('../models/Course');
const Section = require('../models/Section');
const Quiz = require('../models/Quiz');
const Lesson = require('../models/Lesson');
const { protect, admin } = require('../middleware/auth');
const { sendSuccess, sendError, sendNotFound } = require('../utils/responseHelper');
const logger = require('../utils/logger');

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin)
router.get('/dashboard', protect, admin, async (req, res) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });

    // Course statistics
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ isPublished: true });
    const totalEnrollments = await Course.aggregate([
      { $group: { _id: null, total: { $sum: '$stats.totalEnrollments' } } }
    ]);

    // Content statistics
    const totalSections = await Section.countDocuments();
    const totalLessons = await Lesson.countDocuments();
    const totalQuizzes = await Quiz.countDocuments();

    // Recent activity
    const recentUsers = await User.find()
      .select('username email createdAt isActive')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentCourses = await Course.find()
      .select('title language level createdAt isPublished')
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 })
      .limit(5);

    // Top courses by enrollment
    const topCourses = await Course.find({ isPublished: true })
      .select('title language stats.totalEnrollments stats.averageRating')
      .sort({ 'stats.totalEnrollments': -1 })
      .limit(5);

    const dashboardData = {
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers,
        newThisMonth: newUsersThisMonth
      },
      courses: {
        total: totalCourses,
        published: publishedCourses,
        draft: totalCourses - publishedCourses,
        totalEnrollments: totalEnrollments[0]?.total || 0
      },
      content: {
        sections: totalSections,
        lessons: totalLessons,
        quizzes: totalQuizzes
      },
      recent: {
        users: recentUsers,
        courses: recentCourses
      },
      topCourses
    };

    sendSuccess(res, dashboardData, 'Dashboard data retrieved successfully');
  } catch (error) {
    logger.error('Admin dashboard error:', error);
    sendError(res, 'Server error fetching dashboard data');
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with pagination and filtering
// @access  Private (Admin)
router.get('/users', protect, admin, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('role').optional().isIn(['student', 'instructor', 'admin']),
  query('status').optional().isIn(['active', 'inactive'])
], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.status) filter.isActive = req.query.status === 'active';
    if (req.query.search) {
      filter.$or = [
        { username: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { 'profile.firstName': { $regex: req.query.search, $options: 'i' } },
        { 'profile.lastName': { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password -resetPasswordToken')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    sendSuccess(res, {
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    logger.error('Admin get users error:', error);
    sendError(res, 'Server error fetching users');
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Update user status (activate/deactivate)
// @access  Private (Admin)
router.put('/users/:id/status', protect, admin, async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return sendNotFound(res, 'User');
    }

    logger.info(`User ${user.username} status updated to ${isActive ? 'active' : 'inactive'}`, {
      adminId: req.user.id,
      userId: user._id
    });

    sendSuccess(res, { user }, `User ${isActive ? 'activated' : 'deactivated'} successfully`);
  } catch (error) {
    logger.error('Admin update user status error:', error);
    sendError(res, 'Server error updating user status');
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Private (Admin)
router.put('/users/:id/role', protect, admin, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['student', 'instructor', 'admin'].includes(role)) {
      return sendError(res, 'Invalid role specified', 400);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return sendNotFound(res, 'User');
    }

    logger.info(`User ${user.username} role updated to ${role}`, {
      adminId: req.user.id,
      userId: user._id
    });

    sendSuccess(res, { user }, `User role updated to ${role} successfully`);
  } catch (error) {
    logger.error('Admin update user role error:', error);
    sendError(res, 'Server error updating user role');
  }
});

// @route   GET /api/admin/courses
// @desc    Get all courses for admin management
// @access  Private (Admin)
router.get('/courses', protect, admin, async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('createdBy', 'username email')
      .populate('sections', 'title order')
      .sort({ createdAt: -1 });

    sendSuccess(res, { courses });
  } catch (error) {
    logger.error('Admin get courses error:', error);
    sendError(res, 'Server error fetching courses');
  }
});

// @route   PUT /api/admin/courses/:id/publish
// @desc    Publish or unpublish a course
// @access  Private (Admin)
router.put('/courses/:id/publish', protect, admin, async (req, res) => {
  try {
    const { isPublished } = req.body;
    
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { isPublished },
      { new: true }
    ).populate('createdBy', 'username');

    if (!course) {
      return sendNotFound(res, 'Course');
    }

    logger.info(`Course ${course.title} ${isPublished ? 'published' : 'unpublished'}`, {
      adminId: req.user.id,
      courseId: course._id
    });

    sendSuccess(res, { course }, `Course ${isPublished ? 'published' : 'unpublished'} successfully`);
  } catch (error) {
    logger.error('Admin publish course error:', error);
    sendError(res, 'Server error updating course status');
  }
});

// @route   GET /api/admin/analytics
// @desc    Get platform analytics
// @access  Private (Admin)
router.get('/analytics', protect, admin, async (req, res) => {
  try {
    // User growth over time (last 12 months)
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Course completion rates
    const courseStats = await Course.aggregate([
      { $match: { isPublished: true } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'progress.enrolledCourses.courseId',
          as: 'enrollments'
        }
      },
      {
        $project: {
          title: 1,
          language: 1,
          totalEnrollments: '$stats.totalEnrollments',
          averageRating: '$stats.averageRating',
          completionRate: '$stats.completionRate'
        }
      }
    ]);

    // Popular programming languages
    const languageStats = await Course.aggregate([
      { $match: { isPublished: true } },
      {
        $group: {
          _id: '$language',
          courseCount: { $sum: 1 },
          totalEnrollments: { $sum: '$stats.totalEnrollments' }
        }
      },
      { $sort: { totalEnrollments: -1 } }
    ]);

    sendSuccess(res, {
      userGrowth,
      courseStats,
      languageStats
    });
  } catch (error) {
    logger.error('Admin analytics error:', error);
    sendError(res, 'Server error fetching analytics');
  }
});

module.exports = router;