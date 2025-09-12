const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Course = require('../models/Course');
const Section = require('../models/Section');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
require('dotenv').config();

async function clearDatabase() {
  console.log('🗑️  Clearing existing data...');
  await User.deleteMany({});
  await Course.deleteMany({});
  await Section.deleteMany({});
  await Lesson.deleteMany({});
  await Quiz.deleteMany({});
  console.log('✅ Database cleared');
}

async function createUsers() {
  console.log('👥 Creating users...');
  
  const users = [
    {
      username: 'admin',
      email: 'admin@codelingo.com',
      password: 'Admin123!',
      role: 'admin',
      profile: {
        firstName: 'Admin',
        lastName: 'User'
      }
    },
    {
      username: 'instructor_python',
      email: 'python.instructor@codelingo.com',
      password: 'Instructor123!',
      role: 'instructor',
      profile: {
        firstName: 'Sarah',
        lastName: 'Johnson',
        bio: 'Python expert with 10+ years of experience in web development and data science.'
      }
    },
    {
      username: 'instructor_js',
      email: 'js.instructor@codelingo.com',
      password: 'Instructor123!',
      role: 'instructor',
      profile: {
        firstName: 'Mike',
        lastName: 'Chen',
        bio: 'Full-stack JavaScript developer and educator.'
      }
    },
    {
      username: 'student1',
      email: 'student1@example.com',
      password: 'Student123!',
      role: 'student',
      profile: {
        firstName: 'Alice',
        lastName: 'Smith'
      },
      progress: {
        totalXP: 1250,
        currentLevel: 2,
        streak: 5
      }
    },
    {
      username: 'student2',
      email: 'student2@example.com',
      password: 'Student123!',
      role: 'student',
      profile: {
        firstName: 'Bob',
        lastName: 'Wilson'
      },
      progress: {
        totalXP: 750,
        currentLevel: 1,
        streak: 2
      }
    }
  ];

  const createdUsers = [];
  for (const userData of users) {
    const user = new User(userData);
    await user.save();
    createdUsers.push(user);
  }

  console.log(`✅ Created ${createdUsers.length} users`);
  return createdUsers;
}

async function createJavaScriptCourse(instructor) {
  console.log('📚 Creating JavaScript course...');
  
  const course = new Course({
    title: 'Modern JavaScript Fundamentals',
    description: 'Learn JavaScript from basics to advanced concepts including ES6+, async programming, and modern frameworks.',
    language: 'javascript',
    level: 'beginner',
    estimatedHours: 35,
    totalXP: 8500,
    tags: ['javascript', 'web-development', 'frontend', 'es6', 'async'],
    createdBy: instructor._id,
    isPublished: true,
    stats: {
      totalEnrollments: 156,
      averageRating: 4.7,
      completionRate: 78
    }
  });

  await course.save();

  // Create sections
  const sectionsData = [
    {
      title: 'JavaScript Basics',
      description: 'Variables, data types, and basic operations',
      order: 1,
      estimatedMinutes: 60,
      xpReward: 200
    },
    {
      title: 'Functions and Scope',
      description: 'Understanding functions, closures, and scope',
      order: 2,
      estimatedMinutes: 75,
      xpReward: 250
    },
    {
      title: 'Objects and Arrays',
      description: 'Working with complex data structures',
      order: 3,
      estimatedMinutes: 80,
      xpReward: 280
    },
    {
      title: 'DOM Manipulation',
      description: 'Interacting with web pages',
      order: 4,
      estimatedMinutes: 90,
      xpReward: 320
    },
    {
      title: 'Async JavaScript',
      description: 'Promises, async/await, and API calls',
      order: 5,
      estimatedMinutes: 100,
      xpReward: 400
    }
  ];

  for (const sectionData of sectionsData) {
    const section = new Section({
      ...sectionData,
      courseId: course._id
    });

    // Create a sample lesson
    const lesson = new Lesson({
      title: `${sectionData.title} - Introduction`,
      description: `Learn the fundamentals of ${sectionData.title.toLowerCase()}`,
      language: 'javascript',
      level: 'beginner',
      category: 'programming',
      order: 1,
      estimatedTime: Math.round(sectionData.estimatedMinutes * 0.6),
      xpReward: Math.round(sectionData.xpReward * 0.6),
      content: {
        introduction: `This lesson covers ${sectionData.description.toLowerCase()}.`,
        concepts: [
          {
            concept: 'Key Concepts',
            explanation: `Understanding ${sectionData.title.toLowerCase()} is essential for JavaScript development.`,
            codeExample: '// JavaScript example\nconsole.log("Hello, JavaScript!");'
          }
        ]
      },
      questions: [],
      createdBy: instructor._id,
      isPublished: true
    });

    await lesson.save();
    section.lessons.push(lesson._id);

    // Create a quiz
    const quiz = new Quiz({
      title: `${sectionData.title} Quiz`,
      description: `Test your knowledge of ${sectionData.title.toLowerCase()}`,
      sectionId: section._id,
      questions: [
        {
          type: 'multiple-choice',
          question: `What is the main purpose of ${sectionData.title.toLowerCase()}?`,
          options: [
            { text: 'To make code more complex', isCorrect: false },
            { text: 'To improve code organization and functionality', isCorrect: true },
            { text: 'To slow down execution', isCorrect: false },
            { text: 'To add unnecessary features', isCorrect: false }
          ],
          explanation: `${sectionData.title} helps organize and improve JavaScript code functionality.`,
          points: 10,
          difficulty: 'easy'
        }
      ],
      passingScore: 70,
      timeLimit: 10,
      xpReward: Math.round(sectionData.xpReward * 0.4)
    });

    await quiz.save();
    section.quiz = quiz._id;
    await section.save();
    
    course.sections.push(section._id);
  }

  await course.save();
  console.log('✅ JavaScript course created');
  return course;
}

async function enrollStudentsInCourses(students, courses) {
  console.log('📝 Enrolling students in courses...');
  
  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    const course = courses[i % courses.length]; // Distribute students across courses
    
    student.progress.enrolledCourses.push({
      courseId: course._id,
      enrolledAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
      progress: Math.floor(Math.random() * 60) + 20 // 20-80% progress
    });
    
    await student.save();
    
    // Update course enrollment stats
    course.stats.totalEnrollments += 1;
    await course.save();
  }
  
  console.log('✅ Students enrolled in courses');
}

async function runSeeder() {
  try {
    console.log('🚀 Starting CodeLingo database seeder...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codelingo');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await clearDatabase();

    // Create users
    const users = await createUsers();
    const admin = users.find(u => u.role === 'admin');
    const instructors = users.filter(u => u.role === 'instructor');
    const students = users.filter(u => u.role === 'student');

    // Create courses
    const courses = [];
    
    // Create JavaScript course
    const jsCourse = await createJavaScriptCourse(instructors[1]);
    courses.push(jsCourse);

    // Create Python course (import from existing seeder)
    const createPythonCourse = require('./pythonCourse');
    // Note: The Python course seeder will create its own course
    
    // Enroll students in courses
    await enrollStudentsInCourses(students, courses);

    console.log('🎉 Seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   👥 Users: ${users.length}`);
    console.log(`   📚 Courses: ${courses.length}`);
    console.log(`   🎓 Students enrolled: ${students.length}`);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run if called directly
if (require.main === module) {
  runSeeder();
}

module.exports = runSeeder;