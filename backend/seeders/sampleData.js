const mongoose = require('mongoose');
const User = require('../models/User');
const Lesson = require('../models/Lesson');
require('dotenv').config();

const sampleLessons = [
  {
    title: "Basic Spanish Greetings",
    description: "Learn essential Spanish greetings and introductions",
    language: "spanish",
    level: "beginner",
    category: "vocabulary",
    order: 1,
    estimatedTime: 10,
    xpReward: 50,
    content: {
      introduction: "In this lesson, you'll learn the most common Spanish greetings used in everyday conversations.",
      vocabulary: [
        {
          word: "Hola",
          translation: "Hello",
          pronunciation: "OH-lah",
          example: "Hola, ¿cómo estás?"
        },
        {
          word: "Buenos días",
          translation: "Good morning",
          pronunciation: "BWAY-nohs DEE-ahs",
          example: "Buenos días, señora García"
        },
        {
          word: "Buenas tardes",
          translation: "Good afternoon",
          pronunciation: "BWAY-nahs TAR-dehs",
          example: "Buenas tardes, ¿cómo está usted?"
        },
        {
          word: "Buenas noches",
          translation: "Good evening/night",
          pronunciation: "BWAY-nahs NOH-chehs",
          example: "Buenas noches, hasta mañana"
        }
      ]
    },
    questions: [
      {
        type: "multiple-choice",
        question: "How do you say 'Hello' in Spanish?",
        options: [
          { text: "Hola", isCorrect: true },
          { text: "Adiós", isCorrect: false },
          { text: "Gracias", isCorrect: false },
          { text: "Por favor", isCorrect: false }
        ],
        explanation: "Hola is the most common way to say hello in Spanish.",
        points: 10,
        difficulty: "beginner"
      },
      {
        type: "multiple-choice",
        question: "What greeting would you use in the morning?",
        options: [
          { text: "Buenas noches", isCorrect: false },
          { text: "Buenos días", isCorrect: true },
          { text: "Buenas tardes", isCorrect: false },
          { text: "Hasta luego", isCorrect: false }
        ],
        explanation: "Buenos días is used to greet someone in the morning.",
        points: 10,
        difficulty: "beginner"
      },
      {
        type: "fill-blank",
        question: "Complete the greeting: '_____ tardes'",
        correctAnswer: "Buenas",
        explanation: "Buenas tardes means 'Good afternoon'.",
        points: 15,
        difficulty: "beginner"
      }
    ],
    tags: ["greetings", "basic", "conversation"],
    isPublished: true
  },
  {
    title: "French Numbers 1-20",
    description: "Master French numbers from one to twenty",
    language: "french",
    level: "beginner",
    category: "vocabulary",
    order: 1,
    estimatedTime: 15,
    xpReward: 60,
    content: {
      introduction: "Numbers are fundamental in any language. Let's learn French numbers 1-20.",
      vocabulary: [
        { word: "un", translation: "one", pronunciation: "uhn" },
        { word: "deux", translation: "two", pronunciation: "duh" },
        { word: "trois", translation: "three", pronunciation: "twah" },
        { word: "quatre", translation: "four", pronunciation: "KAH-truh" },
        { word: "cinq", translation: "five", pronunciation: "sank" },
        { word: "six", translation: "six", pronunciation: "sees" },
        { word: "sept", translation: "seven", pronunciation: "set" },
        { word: "huit", translation: "eight", pronunciation: "weet" },
        { word: "neuf", translation: "nine", pronunciation: "nuhf" },
        { word: "dix", translation: "ten", pronunciation: "dees" }
      ]
    },
    questions: [
      {
        type: "multiple-choice",
        question: "How do you say 'five' in French?",
        options: [
          { text: "quatre", isCorrect: false },
          { text: "cinq", isCorrect: true },
          { text: "six", isCorrect: false },
          { text: "sept", isCorrect: false }
        ],
        explanation: "Cinq is the French word for five.",
        points: 10,
        difficulty: "beginner"
      },
      {
        type: "fill-blank",
        question: "What comes after 'neuf'? ___",
        correctAnswer: "dix",
        explanation: "Dix (ten) comes after neuf (nine).",
        points: 15,
        difficulty: "beginner"
      }
    ],
    tags: ["numbers", "counting", "basic"],
    isPublished: true
  },
  {
    title: "German Articles: Der, Die, Das",
    description: "Understanding German definite articles and gender",
    language: "german",
    level: "intermediate",
    category: "grammar",
    order: 5,
    estimatedTime: 20,
    xpReward: 80,
    content: {
      introduction: "German nouns have gender, and this affects which article to use. Let's master der, die, and das.",
      grammarRules: [
        {
          rule: "Masculine nouns use 'der'",
          explanation: "Most nouns ending in -er, -el, -en are masculine",
          examples: ["der Mann (the man)", "der Lehrer (the teacher)", "der Wagen (the car)"]
        },
        {
          rule: "Feminine nouns use 'die'",
          explanation: "Most nouns ending in -e, -heit, -keit, -ung are feminine",
          examples: ["die Frau (the woman)", "die Schule (the school)", "die Zeitung (the newspaper)"]
        },
        {
          rule: "Neuter nouns use 'das'",
          explanation: "Most nouns ending in -chen, -lein, -um are neuter",
          examples: ["das Kind (the child)", "das Mädchen (the girl)", "das Zentrum (the center)"]
        }
      ]
    },
    questions: [
      {
        type: "multiple-choice",
        question: "Which article goes with 'Schule' (school)?",
        options: [
          { text: "der", isCorrect: false },
          { text: "die", isCorrect: true },
          { text: "das", isCorrect: false },
          { text: "den", isCorrect: false }
        ],
        explanation: "Schule is feminine, so it uses 'die'.",
        points: 15,
        difficulty: "intermediate"
      },
      {
        type: "multiple-choice",
        question: "What is the correct article for 'Mädchen' (girl)?",
        options: [
          { text: "der", isCorrect: false },
          { text: "die", isCorrect: false },
          { text: "das", isCorrect: true },
          { text: "dem", isCorrect: false }
        ],
        explanation: "Despite referring to a female, 'Mädchen' is neuter due to the -chen ending.",
        points: 20,
        difficulty: "intermediate"
      }
    ],
    tags: ["articles", "gender", "grammar"],
    isPublished: true
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codelingo');
    console.log('Connected to MongoDB');

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@codelingo.com' });
    let adminUser;
    
    if (!adminExists) {
      adminUser = new User({
        username: 'admin',
        email: 'admin@codelingo.com',
        password: 'Admin123!',
        profile: {
          firstName: 'Admin',
          lastName: 'User'
        },
        role: 'admin',
        emailVerified: true
      });
      await adminUser.save();
      console.log('Admin user created');
    } else {
      adminUser = adminExists;
      console.log('Admin user already exists');
    }

    // Create instructor user
    const instructorExists = await User.findOne({ email: 'instructor@codelingo.com' });
    let instructorUser;
    
    if (!instructorExists) {
      instructorUser = new User({
        username: 'instructor',
        email: 'instructor@codelingo.com',
        password: 'Instructor123!',
        profile: {
          firstName: 'Maria',
          lastName: 'Garcia'
        },
        role: 'instructor',
        emailVerified: true
      });
      await instructorUser.save();
      console.log('Instructor user created');
    } else {
      instructorUser = instructorExists;
      console.log('Instructor user already exists');
    }

    // Create sample student
    const studentExists = await User.findOne({ email: 'student@codelingo.com' });
    if (!studentExists) {
      const studentUser = new User({
        username: 'student',
        email: 'student@codelingo.com',
        password: 'Student123!',
        profile: {
          firstName: 'John',
          lastName: 'Doe'
        },
        role: 'student',
        emailVerified: true,
        progress: {
          totalXP: 150,
          currentLevel: 2,
          streak: 3
        }
      });
      await studentUser.save();
      console.log('Student user created');
    } else {
      console.log('Student user already exists');
    }

    // Clear existing lessons
    await Lesson.deleteMany({});
    console.log('Cleared existing lessons');

    // Create sample lessons
    for (const lessonData of sampleLessons) {
      const lesson = new Lesson({
        ...lessonData,
        createdBy: instructorUser._id
      });
      await lesson.save();
    }

    console.log(`Created ${sampleLessons.length} sample lessons`);
    console.log('\n=== Sample Users Created ===');
    console.log('Admin: admin@codelingo.com / Admin123!');
    console.log('Instructor: instructor@codelingo.com / Instructor123!');
    console.log('Student: student@codelingo.com / Student123!');
    console.log('\nDatabase seeded successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;