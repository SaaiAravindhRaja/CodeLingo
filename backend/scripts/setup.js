#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up CodeLingo Backend...\n');

// Check if .env exists
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from .env.example...');
  try {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created');
  } catch (error) {
    console.log('❌ Failed to create .env file:', error.message);
  }
} else {
  console.log('✅ .env file already exists');
}

// Check MongoDB connection
console.log('\n🔍 Checking MongoDB connection...');
try {
  const mongoose = require('mongoose');
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/codelingo';
  
  mongoose.connect(mongoUri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000 
  })
  .then(() => {
    console.log('✅ MongoDB connection successful');
    mongoose.connection.close();
    
    // Seed database
    console.log('\n🌱 Seeding database...');
    try {
      execSync('npm run seed', { stdio: 'inherit' });
      console.log('✅ Database seeded successfully');
    } catch (error) {
      console.log('⚠️  Database seeding failed. You can run "npm run seed" manually later.');
    }
    
    console.log('\n🎉 Setup complete! You can now run:');
    console.log('   npm run dev    - Start development server');
    console.log('   npm test       - Run tests');
    console.log('   npm run seed   - Re-seed database');
    
  })
  .catch((error) => {
    console.log('❌ MongoDB connection failed:', error.message);
    console.log('\n💡 Make sure MongoDB is running:');
    console.log('   - Install MongoDB: https://docs.mongodb.com/manual/installation/');
    console.log('   - Start MongoDB service');
    console.log('   - Or update MONGODB_URI in .env for cloud database');
  });
  
} catch (error) {
  console.log('❌ Error checking MongoDB:', error.message);
}

console.log('\n📚 Documentation:');
console.log('   - API docs: Check README.md');
console.log('   - Health check: http://localhost:5000/api/health');
console.log('   - Admin user: admin@codelingo.com / Admin123!');
console.log('   - Student user: student1@example.com / Student123!');