const mongoose = require('mongoose');
const Course = require('../models/Course');
const Section = require('../models/Section');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
require('dotenv').config();

const pythonCourseStructure = {
  title: "Complete Python Programming Mastery",
  description: "Master Python programming from absolute basics to advanced concepts. Build real projects and become a confident Python developer with hands-on coding experience.",
  language: "python",
  level: "beginner",
  estimatedHours: 60,
  totalXP: 15000,
  tags: ["python", "programming", "backend", "data-science", "web-development", "automation"],
  sections: [
    {
      title: "Getting Started with Python",
      description: "Introduction to Python programming and setting up your development environment",
      order: 1,
      lessons: [
        {
          title: "What is Python and Why Use It?",
          description: "Learn about Python's history, features, and applications",
          category: "basics",
          content: {
            introduction: "Python is a high-level, interpreted programming language known for its simplicity and readability. Created by Guido van Rossum in 1991, Python has become one of the most popular programming languages in the world.",
            concepts: [
              {
                concept: "Python Philosophy",
                explanation: "Python follows the Zen of Python principles, emphasizing code readability and simplicity",
                codeExample: "import this",
                output: "The Zen of Python will be displayed"
              }
            ]
          }
        },
        {
          title: "Installing Python and Setting Up Your Environment",
          description: "Download, install Python, and set up your coding environment",
          category: "basics",
          content: {
            introduction: "Setting up Python correctly is crucial for a smooth learning experience. We'll install Python and set up a proper development environment.",
            concepts: [
              {
                concept: "Python Installation",
                explanation: "Download Python from python.org and install it on your system",
                codeExample: "python --version",
                output: "Python 3.x.x"
              }
            ]
          }
        },
        {
          title: "Your First Python Program",
          description: "Write and run your first Python program",
          category: "basics",
          content: {
            introduction: "Let's write our first Python program and understand how Python code is executed.",
            concepts: [
              {
                concept: "Hello World",
                explanation: "The traditional first program that displays a greeting message",
                codeExample: "print('Hello, World!')",
                output: "Hello, World!"
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
            explanation: "Python was created by Guido van Rossum in 1991."
          },
          {
            type: "code-output",
            question: "What will this code output?",
            code: "print('Hello, Python!')",
            options: [
              { text: "Hello, Python!", isCorrect: true },
              { text: "hello, python!", isCorrect: false },
              { text: "HELLO, PYTHON!", isCorrect: false },
              { text: "Error", isCorrect: false }
            ],
            explanation: "The print() function outputs exactly what's in the quotes."
          }
        ]
      }
    },
    {
      title: "Variables and Data Types",
      description: "Learn about Python variables, data types, and basic operations",
      order: 2,
      lessons: [
        {
          title: "Creating and Using Variables",
          description: "Understand how to create and work with variables in Python",
          category: "basics",
          content: {
            introduction: "Variables are containers for storing data values. In Python, you don't need to declare variables explicitly.",
            concepts: [
              {
                concept: "Variable Assignment",
                explanation: "Use the = operator to assign values to variables",
                codeExample: "name = 'Alice'\nage = 25\nprint(f'{name} is {age} years old')",
                output: "Alice is 25 years old"
              }
            ]
          }
        },
        {
          title: "Numbers and Numeric Operations",
          description: "Work with integers, floats, and mathematical operations",
          category: "basics",
          content: {
            introduction: "Python supports various numeric types and mathematical operations.",
            concepts: [
              {
                concept: "Numeric Types",
                explanation: "Python has integers (int) and floating-point numbers (float)",
                codeExample: "x = 10\ny = 3.14\nprint(type(x), type(y))",
                output: "<class 'int'> <class 'float'>"
              }
            ]
          }
        },
        {
          title: "Strings and Text Processing",
          description: "Learn to work with text data and string operations",
          category: "basics",
          content: {
            introduction: "Strings are sequences of characters used to store and manipulate text data.",
            concepts: [
              {
                concept: "String Creation",
                explanation: "Create strings using single or double quotes",
                codeExample: "message = 'Hello'\ngreeting = \"World\"\nprint(message + ', ' + greeting + '!')",
                output: "Hello, World!"
              }
            ]
          }
        }
      ],
      quiz: {
        title: "Variables and Data Types Quiz",
        description: "Test your knowledge of Python variables and data types",
        questions: [
          {
            type: "code-completion",
            question: "Complete the code to create a variable named 'score' with value 100:",
            code: "_____ = 100",
            correctAnswer: "score",
            explanation: "Variables are created by assigning a value using the = operator."
          }
        ]
      }
    },
    {
      title: "Control Flow - Conditional Statements",
      description: "Make decisions in your code using if, elif, and else statements",
      order: 3,
      lessons: [
        {
          title: "If Statements",
          description: "Learn to make decisions with if statements",
          category: "basics"
        },
        {
          title: "Elif and Else",
          description: "Handle multiple conditions with elif and else",
          category: "basics"
        },
        {
          title: "Comparison and Logical Operators",
          description: "Use operators to create complex conditions",
          category: "basics"
        }
      ]
    },
    {
      title: "Loops and Iteration",
      description: "Repeat code efficiently with for and while loops",
      order: 4,
      lessons: [
        {
          title: "For Loops",
          description: "Iterate over sequences with for loops",
          category: "basics"
        },
        {
          title: "While Loops",
          description: "Create loops that run while conditions are true",
          category: "basics"
        },
        {
          title: "Loop Control - Break and Continue",
          description: "Control loop execution with break and continue",
          category: "basics"
        }
      ]
    },
    {
      title: "Lists and Collections",
      description: "Work with Python lists and basic collection operations",
      order: 5,
      lessons: [
        {
          title: "Creating and Accessing Lists",
          description: "Learn to create lists and access their elements",
          category: "data-structures"
        },
        {
          title: "List Methods and Operations",
          description: "Modify lists with built-in methods",
          category: "data-structures"
        },
        {
          title: "List Comprehensions",
          description: "Create lists efficiently with comprehensions",
          category: "data-structures"
        }
      ]
    },
    {
      title: "Dictionaries and Key-Value Pairs",
      description: "Organize data with Python dictionaries",
      order: 6,
      lessons: [
        {
          title: "Creating and Using Dictionaries",
          description: "Learn dictionary basics and operations",
          category: "data-structures"
        },
        {
          title: "Dictionary Methods",
          description: "Work with dictionary keys, values, and items",
          category: "data-structures"
        },
        {
          title: "Nested Dictionaries",
          description: "Handle complex data structures",
          category: "data-structures"
        }
      ]
    },
    {
      title: "Functions - Creating Reusable Code",
      description: "Write functions to organize and reuse your code",
      order: 7,
      lessons: [
        {
          title: "Defining and Calling Functions",
          description: "Create your first functions",
          category: "basics"
        },
        {
          title: "Function Parameters and Arguments",
          description: "Pass data to functions effectively",
          category: "basics"
        },
        {
          title: "Return Values and Scope",
          description: "Understand function returns and variable scope",
          category: "basics"
        }
      ]
    },
    {
      title: "Error Handling and Debugging",
      description: "Handle errors gracefully and debug your code",
      order: 8,
      lessons: [
        {
          title: "Understanding Python Errors",
          description: "Learn about common Python error types",
          category: "basics"
        },
        {
          title: "Try, Except, and Finally",
          description: "Handle exceptions with try-except blocks",
          category: "basics"
        },
        {
          title: "Debugging Techniques",
          description: "Debug your code effectively",
          category: "basics"
        }
      ]
    },
    {
      title: "File Input and Output",
      description: "Read from and write to files",
      order: 9,
      lessons: [
        {
          title: "Reading Files",
          description: "Open and read file contents",
          category: "basics"
        },
        {
          title: "Writing Files",
          description: "Create and write to files",
          category: "basics"
        },
        {
          title: "File Handling Best Practices",
          description: "Handle files safely with context managers",
          category: "basics"
        }
      ]
    },
    {
      title: "Object-Oriented Programming Basics",
      description: "Introduction to classes and objects",
      order: 10,
      lessons: [
        {
          title: "Classes and Objects",
          description: "Create your first class and objects",
          category: "oop"
        },
        {
          title: "Attributes and Methods",
          description: "Add properties and behaviors to classes",
          category: "oop"
        },
        {
          title: "Constructor and Instance Methods",
          description: "Initialize objects and create methods",
          category: "oop"
        }
      ]
    },
    {
      title: "Inheritance and Polymorphism",
      description: "Advanced OOP concepts",
      order: 11,
      lessons: [
        {
          title: "Class Inheritance",
          description: "Create classes that inherit from others",
          category: "oop"
        },
        {
          title: "Method Overriding",
          description: "Customize inherited methods",
          category: "oop"
        },
        {
          title: "Polymorphism in Action",
          description: "Use polymorphism effectively",
          category: "oop"
        }
      ]
    },
    {
      title: "Modules and Packages",
      description: "Organize code with modules and use external packages",
      order: 12,
      lessons: [
        {
          title: "Creating and Importing Modules",
          description: "Organize code into reusable modules",
          category: "advanced"
        },
        {
          title: "Python Standard Library",
          description: "Explore built-in Python modules",
          category: "advanced"
        },
        {
          title: "Installing and Using Packages",
          description: "Use pip to install external packages",
          category: "advanced"
        }
      ]
    },
    {
      title: "Working with APIs and JSON",
      description: "Connect to web APIs and handle JSON data",
      order: 13,
      lessons: [
        {
          title: "Understanding APIs",
          description: "Learn what APIs are and how they work",
          category: "web-development"
        },
        {
          title: "Making HTTP Requests",
          description: "Use the requests library to call APIs",
          category: "web-development"
        },
        {
          title: "Parsing JSON Data",
          description: "Work with JSON responses from APIs",
          category: "web-development"
        }
      ]
    },
    {
      title: "Database Basics with SQLite",
      description: "Store and retrieve data using databases",
      order: 14,
      lessons: [
        {
          title: "Introduction to Databases",
          description: "Understand database concepts",
          category: "databases"
        },
        {
          title: "SQLite and Python",
          description: "Connect Python to SQLite databases",
          category: "databases"
        },
        {
          title: "CRUD Operations",
          description: "Create, Read, Update, and Delete data",
          category: "databases"
        }
      ]
    },
    {
      title: "Web Scraping Fundamentals",
      description: "Extract data from websites",
      order: 15,
      lessons: [
        {
          title: "HTML Basics for Scraping",
          description: "Understand HTML structure",
          category: "web-development"
        },
        {
          title: "Beautiful Soup Library",
          description: "Parse HTML with Beautiful Soup",
          category: "web-development"
        },
        {
          title: "Ethical Scraping Practices",
          description: "Scrape responsibly and legally",
          category: "web-development"
        }
      ]
    },
    {
      title: "Data Analysis with Pandas",
      description: "Analyze data using the Pandas library",
      order: 16,
      lessons: [
        {
          title: "Introduction to Pandas",
          description: "Get started with data analysis",
          category: "data-structures"
        },
        {
          title: "DataFrames and Series",
          description: "Work with Pandas data structures",
          category: "data-structures"
        },
        {
          title: "Data Cleaning and Manipulation",
          description: "Clean and transform your data",
          category: "data-structures"
        }
      ]
    },
    {
      title: "Creating Web Applications with Flask",
      description: "Build web applications using Flask framework",
      order: 17,
      lessons: [
        {
          title: "Flask Basics",
          description: "Create your first Flask application",
          category: "web-development"
        },
        {
          title: "Routes and Templates",
          description: "Handle URLs and render HTML templates",
          category: "web-development"
        },
        {
          title: "Forms and User Input",
          description: "Handle user input in web forms",
          category: "web-development"
        }
      ]
    },
    {
      title: "Testing Your Python Code",
      description: "Write tests to ensure code quality",
      order: 18,
      lessons: [
        {
          title: "Introduction to Testing",
          description: "Understand why testing is important",
          category: "testing"
        },
        {
          title: "Unit Tests with unittest",
          description: "Write unit tests for your functions",
          category: "testing"
        },
        {
          title: "Test-Driven Development",
          description: "Write tests before writing code",
          category: "testing"
        }
      ]
    },
    {
      title: "Advanced Python Concepts",
      description: "Explore advanced Python features",
      order: 19,
      lessons: [
        {
          title: "Decorators",
          description: "Modify function behavior with decorators",
          category: "advanced"
        },
        {
          title: "Generators and Iterators",
          description: "Create memory-efficient iterators",
          category: "advanced"
        },
        {
          title: "Context Managers",
          description: "Manage resources with context managers",
          category: "advanced"
        }
      ]
    },
    {
      title: "Final Project - Build a Complete Application",
      description: "Apply everything you've learned in a capstone project",
      order: 20,
      lessons: [
        {
          title: "Project Planning and Setup",
          description: "Plan your final project",
          category: "advanced"
        },
        {
          title: "Implementation and Testing",
          description: "Build and test your application",
          category: "advanced"
        },
        {
          title: "Deployment and Next Steps",
          description: "Deploy your app and plan future learning",
          category: "advanced"
        }
      ]
    }
  ]
};

async function createCompletePythonCourse() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codelingo');
    console.log('✅ Connected to MongoDB');

    // Find instructor user
    const instructor = await User.findOne({ role: 'instructor' });
    if (!instructor) {
      console.error('❌ No instructor user found. Please run the main seeder first.');
      return;
    }

    // Delete existing Python course if it exists
    await Course.deleteMany({ language: 'python' });
    await Section.deleteMany({});
    await Quiz.deleteMany({});
    await Lesson.deleteMany({});
    console.log('🗑️  Cleared existing Python course data');

    // Create the course
    const course = new Course({
      title: pythonCourseStructure.title,
      description: pythonCourseStructure.description,
      language: pythonCourseStructure.language,
      level: pythonCourseStructure.level,
      estimatedHours: pythonCourseStructure.estimatedHours,
      totalXP: pythonCourseStructure.totalXP,
      tags: pythonCourseStructure.tags,
      createdBy: instructor._id,
      isPublished: true,
      stats: {
        totalEnrollments: 0,
        averageRating: 4.8,
        completionRate: 85
      }
    });

    await course.save();
    console.log('📚 Created Python course');

    // Create sections with lessons and quizzes
    for (const sectionData of pythonCourseStructure.sections) {
      const section = new Section({
        title: sectionData.title,
        description: sectionData.description,
        courseId: course._id,
        order: sectionData.order,
        estimatedMinutes: 45,
        xpReward: 150
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
            category: lessonData.category || 'basics',
            order: i + 1,
            estimatedTime: 15,
            xpReward: 50,
            content: lessonData.content || {
              introduction: lessonData.description,
              concepts: [{
                concept: "Key Concept",
                explanation: `Learn about ${lessonData.title.toLowerCase()}`,
                codeExample: "# Python code example\nprint('Learning Python!')",
                output: "Learning Python!"
              }]
            },
            questions: [],
            createdBy: instructor._id,
            isPublished: true
          });

          await lesson.save();
          section.lessons.push(lesson._id);
        }
      }

      // Create quiz for this section
      const quiz = new Quiz({
        title: sectionData.quiz?.title || `${sectionData.title} Quiz`,
        description: sectionData.quiz?.description || `Test your knowledge of ${sectionData.title.toLowerCase()}`,
        sectionId: section._id,
        questions: sectionData.quiz?.questions || [
          {
            type: 'multiple-choice',
            question: `What is the main focus of ${sectionData.title}?`,
            options: [
              { text: 'Learning Python concepts', isCorrect: true },
              { text: 'Learning Java', isCorrect: false },
              { text: 'Learning HTML', isCorrect: false },
              { text: 'Learning CSS', isCorrect: false }
            ],
            explanation: `${sectionData.title} focuses on Python programming concepts.`,
            points: 10,
            difficulty: 'easy'
          },
          {
            type: 'true-false',
            question: `${sectionData.title} is important for Python development.`,
            correctAnswer: 'true',
            explanation: `Yes, ${sectionData.title.toLowerCase()} is a fundamental part of Python programming.`,
            points: 10,
            difficulty: 'easy'
          }
        ],
        passingScore: 70,
        timeLimit: 10,
        xpReward: 100
      });

      await quiz.save();
      section.quiz = quiz._id;
      await section.save();
      
      course.sections.push(section._id);
    }

    await course.save();

    console.log(`🎉 Complete Python course created successfully!`);
    console.log(`📚 Course: ${course.title}`);
    console.log(`📖 Sections: ${course.sections.length}`);
    console.log(`⭐ Total XP: ${course.totalXP}`);
    console.log(`🕒 Estimated Hours: ${course.estimatedHours}`);

  } catch (error) {
    console.error('❌ Error creating Python course:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run if called directly
if (require.main === module) {
  createCompletePythonCourse();
}

module.exports = createCompletePythonCourse;