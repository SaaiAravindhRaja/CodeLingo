const express = require('express');
const { query } = require('express-validator');
const User = require('../models/User');
const Lesson = require('../models/Lesson');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/leaderboard
// @desc    Get user leaderboard
// @access  Public
router.get('/leaderboard', [
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const users = await User.find({ isActive: true })
      .select('username profile.firstName profile.lastName profile.avatar progress.totalXP progress.currentLevel progress.streak')
      .sort({ 'progress.totalXP': -1 })
      .limit(limit);

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      id: user._id,
      username: user.username,
      displayName: user.profile.firstName && user.profile.lastName 
        ? `${user.profile.firstName} ${user.profile.lastName}`
        : user.username,
      avatar: user.profile.avatar,
      totalXP: user.progress.totalXP,
      level: user.progress.currentLevel,
      streak: user.progress.streak
    }));

    res.json({ leaderboard });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Server error fetching leaderboard' });
  }
});

// @route   GET /api/users/progress
// @desc    Get current user's detailed progress
// @access  Private
router.get('/progress', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'progress.completedLessons.lessonId',
        select: 'title language level category xpReward'
      });

    // Get total lessons by language and level
    const totalLessons = await Lesson.aggregate([
      { $match: { isPublished: true } },
      {
        $group: {
          _id: { language: '$language', level: '$level' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Calculate completion rates
    const completionStats = {};
    totalLessons.forEach(stat => {
      const key = `${stat._id.language}_${stat._id.level}`;
      completionStats[key] = {
        total: stat.count,
        completed: 0
      };
    });

    user.progress.completedLessons.forEach(completion => {
      if (completion.lessonId) {
        const key = `${completion.lessonId.language}_${completion.lessonId.level}`;
        if (completionStats[key]) {
          completionStats[key].completed++;
        }
      }
    });

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentCompletions = user.progress.completedLessons.filter(
      completion => completion.completedAt >= sevenDaysAgo
    );

    res.json({
      progress: {
        currentLevel: user.progress.currentLevel,
        totalXP: user.progress.totalXP,
        streak: user.progress.streak,
        lastActiveDate: user.progress.lastActiveDate,
        totalCompletedLessons: user.progress.completedLessons.length
      },
      completionStats,
      recentActivity: {
        lessonsCompletedThisWeek: recentCompletions.length,
        xpEarnedThisWeek: recentCompletions.reduce((total, completion) => {
          return total + (completion.lessonId ? completion.lessonId.xpReward : 0);
        }, 0),
        recentCompletions: recentCompletions.slice(-5).map(completion => ({
          lesson: completion.lessonId,
          score: completion.score,
          completedAt: completion.completedAt
        }))
      }
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ message: 'Server error fetching progress' });
  }
});

// @route   GET /api/users/stats
// @desc    Get user statistics (admin only)
// @access  Private (Admin)
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });

    // User distribution by role
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Average XP and level
    const avgStats = await User.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          avgXP: { $avg: '$progress.totalXP' },
          avgLevel: { $avg: '$progress.currentLevel' },
          avgStreak: { $avg: '$progress.streak' }
        }
      }
    ]);

    // Top performers
    const topPerformers = await User.find({ isActive: true })
      .select('username profile.firstName profile.lastName progress.totalXP progress.currentLevel')
      .sort({ 'progress.totalXP': -1 })
      .limit(5);

    res.json({
      overview: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        newUsersThisMonth
      },
      distribution: {
        byRole: usersByRole.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      },
      averages: avgStats[0] || { avgXP: 0, avgLevel: 1, avgStreak: 0 },
      topPerformers: topPerformers.map(user => ({
        id: user._id,
        username: user.username,
        displayName: user.profile.firstName && user.profile.lastName 
          ? `${user.profile.firstName} ${user.profile.lastName}`
          : user.username,
        totalXP: user.progress.totalXP,
        level: user.progress.currentLevel
      }))
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error fetching user statistics' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user profile by ID
// @access  Private (Admin only)
router.get('/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('progress.completedLessons.lessonId', 'title language level');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error fetching user' });
  }
});

// @route   PUT /api/users/:id/status
// @desc    Update user status (activate/deactivate)
// @access  Private (Admin only)
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { isActive } = req.body;
    
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ message: 'isActive must be a boolean value' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error updating user status' });
  }
});

// @route   PUT /api/users/:id/role
// @desc    Update user role
// @access  Private (Admin only)
router.put('/:id/role', protect, admin, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['student', 'instructor', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Prevent changing own role
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot change your own role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error updating user role' });
  }
});

module.exports = router;