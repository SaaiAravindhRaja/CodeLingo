const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('🔍 Testing MongoDB connection...');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codelingo', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connected successfully');
    
    // Test if we have data
    const User = require('./models/User');
    const Course = require('./models/Course');
    
    const userCount = await User.countDocuments();
    const courseCount = await Course.countDocuments();
    
    console.log(`📊 Database stats:`);
    console.log(`   Users: ${userCount}`);
    console.log(`   Courses: ${courseCount}`);
    
    if (userCount === 0 || courseCount === 0) {
      console.log('⚠️  Database appears empty. Run "npm run seed" to populate with sample data.');
    } else {
      console.log('✅ Database has data');
      
      // Show sample course
      const sampleCourse = await Course.findOne().select('title language level');
      if (sampleCourse) {
        console.log(`📚 Sample course: ${sampleCourse.title} (${sampleCourse.language}, ${sampleCourse.level})`);
      }
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 MongoDB connection refused. Make sure:');
      console.log('   1. MongoDB is installed and running');
      console.log('   2. Check your MONGODB_URI in .env file');
      console.log('   3. Default: mongodb://localhost:27017/codelingo');
    }
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
  }
}

testConnection();