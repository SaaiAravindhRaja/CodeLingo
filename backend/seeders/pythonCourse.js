const mongoose = require('mongoose');
const Course = require('../models/Course');
const Section = require('../models/Section');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
require('dotenv').config();

const pythonCourseData = {
  title: "Complete Python Programming Bootcamp",
  description: "Master Python programming from basics to advanced concepts. Build real projects and become a confident Python developer.",
  language: "python",
  level: "beginner",
  estimatedHours: 40,
  totalXP: 10000,
  tags: ["python", "programming", "backend", "data-science", "web-development"],
  sections: [
    {
      title: "Introduction to Python",
      description: "Get started with Python programming basics",
      order: 1,
      estimatedMinutes: 45,
      xpReward: 200,
      lessons: [
        {
          title: "What is Python?",
          description: "Learn about Python and its applications",
          content: {
            introduction: "Python is a high-level, interpreted programming language known for its simplicity and readability.",
            concepts: [
              {
                concept: "Python History",
                explanation: "Created by Guido van Rossum in 1991",
                codeExample: "# This is Python!\nprint('Hello, World!')"
              }
            ]
          }
        },
        {
          title: "Installing Python",
          description: "Set up your Python development environment",
          content: {
            introduction: "Learn how to install Python and set up your coding environment.",
            concepts: [
              {
                concept: "Python Installation",
                explanation: "Download and install Python from python.org",
                codeExample: "# Check Python version\nimport sys\nprint(sys.version)"
              }
            ]
          }
        }
      ],
      quiz: {
        title: "Python Basics Quiz",
        description: "Test your understanding of Python fundamentals",
        questions: [
          {
            type: "multiple-choice",
            question: "Who created Python?",
            options: [
              { text: "Guido van Rossum", isCorrect: true },
              { text: "Dennis Ritchie", isCorrect: false },
              { text: "Bjarne Stroustrup", isCorrect: false },
              { text: "James Gosling", isCorrect: false }
            ],
            explanation: "Python was created by Guido van Rossum in 1991.",
            points: 10
          },
          {
            type: "code-output",
            question: "What will this code output?",
            code: "print('Hello, World!')",
            options: [
              { text: "Hello, World!", isCorrect: true },
              { text: "hello, world!", isCorrect: false },
              { text: "HELLO, WORLD!", isCorrect: false },
              { text: "Error", isCorrect: false }
            ],
            explanation: "The print() function outputs exactly what's in the quotes.",
            points: 15
          }
        ],
        passingScore: 70,
        timeLimit: 10,
        xpReward: 100
      }
    },
    {
      title: "Variables and Data Types",
      description: "Learn about Python variables and basic data types",
      order: 2,
      estimatedMinutes: 60,
      xpReward: 250,
      lessons: [
        {
          title: "Creating Variables",
          description: "Learn how to create and use variables in Python",
          content: {
            introduction: "Variables are containers for storing data values.",
            concepts: [
              {
                concept: "Variable Assignment",
                explanation: "Use the = operator to assign values to variables",
                codeExample: "name = 'Alice'\nage = 25\nprint(f'{name} is {age} years old')"
              }
            ]
          }
        }
      ],
      quiz: {
        title: "Variables Quiz",
        description: "Test your knowledge of Python variables",
        questions: [
          {
            type: "code-completion",
            question: "Complete the code to create a variable named 'score' with value 100:",
            code: "_____ = 100",
            correctAnswer: "score",
            explanation: "Variables are created by assigning a value using the = operator.",
            points: 10
          }
        ],
        passingScore: 70,
        timeLimit: 8,
        xpReward: 80
      }
    },
    {
      title: "Numbers and Math Operations",
      description: "Work with numbers and mathematical operations",
      order: 3,
      estimatedMinutes: 50,
      xpReward: 220
    },
    {
      title: "Strings and Text Processing",
      description: "Master string manipulation and text processing",
      order: 4,
      estimatedMinutes: 70,
      xpReward: 280
    },
    {
      title: "Lists and Collections",
      description: "Learn about Python lists and basic operations",
      order: 5,
      estimatedMinutes: 80,
      xpReward: 320
    },
    {
      title: "Dictionaries and Key-Value Pairs",
      description: "Work with dictionaries for data organization",
      order: 6,
      estimatedMinutes: 75,
      xpReward: 300
    },
    {
      title: "Conditional Statements (if/else)",
      description: "Make decisions in your code with conditionals",
      order: 7,
      estimatedMinutes: 65,
      xpReward: 260
    },
    {
      title: "Loops - For and While",
      description: "Repeat code efficiently with loops",
      order: 8,
      estimatedMinutes: 85,
      xpReward: 340
    },
    {
      title: "Functions - Creating Reusable Code",
      description: "Write functions to organize and reuse code",
      order: 9,
      estimatedMinutes: 90,
      xpReward: 360
    },
    {
      title: "Error Handling and Debugging",
      description: "Handle errors gracefully and debug your code",
      order: 10,
      estimatedMinutes: 70,
      xpReward: 280
    },
    {
      title: "File Input/Output Operations",
      description: "Read from and write to files",
      order: 11,
      estimatedMinutes: 80,
      xpReward: 320
    },
    {
      title: "Object-Oriented Programming Basics",
      description: "Introduction to classes and objects",
      order: 12,
      estimatedMinutes: 100,
      xpReward: 400
    },
    {
      title: "Modules and Packages",
      description: "Organize code with modules and use external packages",
      order: 13,
      estimatedMinutes: 75,
      xpReward: 300
    },
    {
      title: "Working with APIs and JSON",
      description: "Connect to web APIs and handle JSON data",
      order: 14,
      estimatedMinutes: 95,
      xpReward: 380
    },
    {
      title: "Database Basics with SQLite",
      description: "Store and retrieve data using databases",
      order: 15,
      estimatedMinutes: 110,
      xpReward: 440
    },
    {
      title: "Web Scraping Fundamentals",
      description: "Extract data from websites",
      order: 16,
      estimatedMinutes: 85,
      xpReward: 340
    },
    {
      title: "Data Analysis with Pandas",
      description: "Analyze data using the Pandas library",
      order: 17,
      estimatedMinutes: 120,
      xpReward: 480
    },
    {
      title: "Creating Web Applications with Flask",
      description: "Build web applications using Flask framework",
      order: 18,
      estimatedMinutes: 140,
      xpReward: 560
    },
    {
      title: "Testing Your Python Code",
      description: "Write tests to ensure code quality",
      order: 19,
      estimatedMinutes: 90,
      xpReward: 360
    },
    {
      title: "Final Project - Build a Complete Application",
      description: "Apply everything you've learned in a capstone project",
      order: 20,
      estimatedMinutes: 180,
      xpReward: 720
    }
  ]
};

async function createPythonCourse() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codelingo');
    console.log('Connected to MongoDB');

    // Find instructor user
    const instructor = await User.findOne({ role: 'instructor' });
    if (!instructor) {
      console.error('No instructor user found. Please run the main seeder first.');
      return;
    }

    // Delete existing Python course if it exists
    await Course.deleteMany({ language: 'python' });
    await Section.deleteMany({});
    await Quiz.deleteMany({});
    console.log('Cleared existing Python course data');

    // Create the course
    const course = new Course({
      title: pythonCourseData.title,
      description: pythonCourseData.description,
      language: pythonCourseData.language,
      level: pythonCourseData.level,
      estimatedHours: pythonCourseData.estimatedHours,
      totalXP: pythonCourseData.totalXP,
      tags: pythonCourseData.tags,
      createdBy: instructor._id,
      isPublished: true
    });

    await course.save();
    console.log('Created Python course');

    // Create sections with lessons and quizzes
    for (const sectionData of pythonCourseData.sections) {
      const section = new Section({
        title: sectionData.title,
        description: sectionData.description,
        courseId: course._id,
        order: sectionData.order,
        estimatedMinutes: sectionData.estimatedMinutes,
        xpReward: sectionData.xpReward
      });

      await section.save();

      // Create lessons for this section
      if (sectionData.lessons) {
        for (let i = 0; i < sectionData.lessons.length; i++) {
          const lessonData = sectionData.lessons[i];
          const lesson = new Lesson({
            title: lessonData.title,
            description: lessonData.description,
            language: 'python',
            level: 'beginner',
            category: 'programming',
            order: i + 1,
            estimatedTime: Math.round(sectionData.estimatedMinutes / (sectionData.lessons.length + 1)),
            xpReward: Math.round(sectionData.xpReward * 0.7 / sectionData.lessons.length),
            content: lessonData.content || {
              introduction: lessonData.description,
              concepts: []
            },
            questions: [], // We'll focus on quizzes for assessment
            createdBy: instructor._id,
            isPublished: true
          });

          await lesson.save();
          section.lessons.push(lesson._id);
        }
      }

      // Create quiz for this section
      if (sectionData.quiz) {
        const quiz = new Quiz({
          title: sectionData.quiz.title,
          description: sectionData.quiz.description,
          sectionId: section._id,
          questions: sectionData.quiz.questions || [],
          passingScore: sectionData.quiz.passingScore || 70,
          timeLimit: sectionData.quiz.timeLimit || 15,
          xpReward: sectionData.quiz.xpReward || Math.round(sectionData.xpReward * 0.3)
        });

        await quiz.save();
        section.quiz = quiz._id;
      }

      await section.save();
      course.sections.push(section._id);
    }

    await course.save();

    console.log(`✅ Python course created successfully!`);
    console.log(`📚 Course: ${course.title}`);
    console.log(`📖 Sections: ${course.sections.length}`);
    console.log(`⭐ Total XP: ${course.totalXP}`);
    console.log(`🕒 Estimated Hours: ${course.estimatedHours}`);

  } catch (error) {
    console.error('Error creating Python course:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run if called directly
if (require.main === module) {
  createPythonCourse();
}

module.exports = createPythonCourse;