const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Course = require('../models/Course');
const Section = require('../models/Section');
const User = require('../models/User');
const { protect, instructor, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/courses
// @desc    Get all courses with filtering
// @access  Public
router.get('/', [
  query('language').optional().isIn(['python', 'javascript', 'java', 'cpp', 'csharp', 'go', 'rust', 'swift', 'kotlin', 'php', 'ruby', 'typescript']),
  query('level').optional().isIn(['beginner', 'intermediate', 'advanced'])
], optionalAuth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const filter = { isPublished: true };
    
    if (req.query.language) filter.language = req.query.language;
    if (req.query.level) filter.level = req.query.level;
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }

    const courses = await Course.find(filter)
      .populate('createdBy', 'username profile.firstName profile.lastName')
      .populate('sections', 'title order estimatedMinutes')
      .sort({ 'stats.averageRating': -1, createdAt: -1 });

    // Add user enrollment status if authenticated
    let coursesWithProgress = courses;
    if (req.user) {
      coursesWithProgress = courses.map(course => {
        const courseObj = course.toObject();
        const enrollment = req.user.progress.enrolledCourses.find(
          ec => ec.courseId.toString() === course._id.toString()
        );
        courseObj.userProgress = enrollment ? {
          enrolled: true,
          progress: enrollment.progress,
          enrolledAt: enrollment.enrolledAt
        } : { enrolled: false };
        return courseObj;
      });
    }

    res.json({ courses: coursesWithProgress });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Server error fetching courses' });
  }
});

// @route   GET /api/courses/:id
// @desc    Get single course with sections
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('createdBy', 'username profile.firstName profile.lastName')
      .populate({
        path: 'sections',
        populate: {
          path: 'lessons quiz',
          select: 'title order estimatedTime questions.length'
        }
      });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!course.isPublished && (!req.user || req.user.role === 'student')) {
      return res.status(403).json({ message: 'Course not available' });
    }

    const courseObj = course.toObject();

    // Add user progress if authenticated
    if (req.user) {
      const enrollment = req.user.progress.enrolledCourses.find(
        ec => ec.courseId.toString() === course._id.toString()
      );
      
      if (enrollment) {
        courseObj.userProgress = {
          enrolled: true,
          progress: enrollment.progress,
          enrolledAt: enrollment.enrolledAt,
          completedSections: enrollment.completedSections.length,
          totalSections: course.sections.length
        };
      } else {
        courseObj.userProgress = { enrolled: false };
      }
    }

    res.json({ course: courseObj });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Server error fetching course' });
  }
});

// @route   POST /api/courses/:id/enroll
// @desc    Enroll in a course
// @access  Private
router.post('/:id/enroll', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!course.isPublished) {
      return res.status(403).json({ message: 'Course not available for enrollment' });
    }

    const user = await User.findById(req.user.id);
    
    // Check if already enrolled
    const existingEnrollment = user.progress.enrolledCourses.find(
      ec => ec.courseId.toString() === course._id.toString()
    );

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Enroll user
    user.progress.enrolledCourses.push({
      courseId: course._id,
      enrolledAt: new Date(),
      progress: 0
    });

    // Update course stats
    course.stats.totalEnrollments += 1;

    await Promise.all([user.save(), course.save()]);

    // Award first enrollment achievement
    user.addAchievement('first_course', 50);
    await user.save();

    res.json({
      message: 'Successfully enrolled in course',
      enrollment: {
        courseId: course._id,
        courseName: course.title,
        enrolledAt: new Date()
      }
    });
  } catch (error) {
    console.error('Enroll course error:', error);
    res.status(500).json({ message: 'Server error enrolling in course' });
  }
});

// @route   GET /api/courses/:id/sections/:sectionId
// @desc    Get section details with lessons and quiz
// @access  Private
router.get('/:id/sections/:sectionId', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is enrolled
    const user = await User.findById(req.user.id);
    const enrollment = user.progress.enrolledCourses.find(
      ec => ec.courseId.toString() === course._id.toString()
    );

    if (!enrollment) {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }

    const section = await Section.findById(req.params.sectionId)
      .populate('lessons')
      .populate('quiz');

    if (!section || section.courseId.toString() !== course._id.toString()) {
      return res.status(404).json({ message: 'Section not found' });
    }

    // Check if section is unlocked
    const completedSections = enrollment.completedSections.map(cs => cs.sectionId.toString());
    const sectionIndex = section.order - 1;
    
    if (sectionIndex > 0) {
      const previousSections = await Section.find({ 
        courseId: course._id, 
        order: { $lt: section.order } 
      });
      
      const allPreviousCompleted = previousSections.every(ps => 
        completedSections.includes(ps._id.toString())
      );
      
      if (!allPreviousCompleted) {
        return res.status(403).json({ message: 'Previous sections must be completed first' });
      }
    }

    const sectionObj = section.toObject();
    
    // Add user progress for this section
    const sectionProgress = enrollment.completedSections.find(
      cs => cs.sectionId.toString() === section._id.toString()
    );
    
    sectionObj.userProgress = sectionProgress ? {
      completed: true,
      completedAt: sectionProgress.completedAt,
      score: sectionProgress.score
    } : { completed: false };

    res.json({ section: sectionObj });
  } catch (error) {
    console.error('Get section error:', error);
    res.status(500).json({ message: 'Server error fetching section' });
  }
});

module.exports = router;