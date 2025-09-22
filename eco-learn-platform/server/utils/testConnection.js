const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const testConnection = async () => {
    try {
        console.log('🔍 Testing MongoDB connection...');
        console.log(`📡 Connecting to: ${process.env.MONGODB_URI}`);
        
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connection successful!');
        
        // Test a simple query
        const admin = await mongoose.connection.db.admin();
        const info = await admin.serverStatus();
        console.log(`📊 MongoDB version: ${info.version}`);
        console.log(`🏠 Database: ${mongoose.connection.name}`);
        
        // Close connection
        await mongoose.connection.close();
        console.log('🔒 Connection closed successfully');
        
        console.log('\n🎉 Database setup is working correctly!');
        console.log('You can now run: npm run seed');
        
    } catch (error) {
        console.error('❌ MongoDB connection failed:');
        console.error(error.message);
        
        if (error.message.includes('ECONNREFUSED')) {
            console.log('\n💡 Suggestions:');
            console.log('1. Make sure MongoDB is running locally, OR');
            console.log('2. Use MongoDB Atlas (cloud database) - run: node setup-mongodb-atlas.js');
        }
        
        if (error.message.includes('authentication')) {
            console.log('\n💡 Suggestions:');
            console.log('1. Check your username and password');
            console.log('2. Make sure the database user has proper permissions');
        }
        
        if (error.message.includes('network')) {
            console.log('\n💡 Suggestions:');
            console.log('1. Check your internet connection');
            console.log('2. Verify the MongoDB Atlas IP whitelist settings');
        }
    }
};

// Run if called directly
if (require.main === module) {
    testConnection();
}

module.exports = { testConnection };
