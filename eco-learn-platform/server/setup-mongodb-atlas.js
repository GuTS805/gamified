const fs = require('fs');
const path = require('path');

console.log('🚀 GyanSetu Platform MongoDB Setup');
console.log('=====================================\n');

console.log('Since MongoDB is not installed locally, here are your options:\n');

console.log('OPTION 1: MongoDB Atlas (Recommended - Free Cloud Database)');
console.log('1. Go to https://www.mongodb.com/cloud/atlas');
console.log('2. Sign up for a free account');
console.log('3. Create a new cluster (select M0 Sandbox - FREE)');
console.log('4. Create a database user');
console.log('5. Add your IP to the network access list (or use 0.0.0.0/0 for all IPs)');
console.log('6. Get your connection string (looks like: mongodb+srv://username:password@cluster.mongodb.net/database)');
console.log('7. Update your .env file with this connection string\n');

console.log('OPTION 2: Local MongoDB Installation');
console.log('1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community');
console.log('2. Install MongoDB following the Windows installation guide');
console.log('3. Start MongoDB service');
console.log('4. Keep the current .env configuration\n');

console.log('OPTION 3: Docker (if you have Docker Desktop)');
console.log('1. Install Docker Desktop from https://www.docker.com/products/docker-desktop');
console.log('2. Run: docker run -d -p 27017:27017 --name mongodb mongo:latest');
console.log('3. Keep the current .env configuration\n');

console.log('📝 Current .env file:');
try {
    const envContent = fs.readFileSync('.env', 'utf8');
    console.log(envContent);
} catch (error) {
    console.log('Error reading .env file:', error.message);
}

console.log('\n🔧 To update your MongoDB connection:');
console.log('1. Edit the .env file');
console.log('2. Replace MONGODB_URI with your connection string');
console.log('3. Run: node utils/seedDatabase.js');
console.log('4. Start the server: npm run dev');
