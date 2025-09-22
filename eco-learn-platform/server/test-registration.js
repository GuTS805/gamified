const axios = require('axios').default;

const testRegistration = async () => {
    console.log('🧪 Testing Registration Endpoint...\n');

    const testUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'test123',
        role: 'student',
        school: 'Test School',
        grade: '10th'
    };

    try {
        console.log('📤 Sending registration request...');
        console.log('Data:', JSON.stringify(testUser, null, 2));

        const response = await axios.post('http://localhost:5000/api/auth/register', testUser, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });

        console.log('✅ Registration successful!');
        console.log('Response:', JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.log('❌ Registration failed!');
        
        if (error.code === 'ECONNREFUSED') {
            console.log('🔌 Server is not running!');
            console.log('💡 Start the server with: npm run dev');
        } else if (error.response) {
            console.log('📥 Server Response:');
            console.log('Status:', error.response.status);
            console.log('Error:', JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.log('📡 No response received from server');
            console.log('Check if server is running on http://localhost:5000');
        } else {
            console.log('Error:', error.message);
        }
    }
};

// Check if axios is available, if not suggest installation
try {
    require('axios');
    testRegistration();
} catch (err) {
    console.log('❌ axios not installed');
    console.log('💡 Install it with: npm install axios');
    console.log('Or test manually with curl or Postman');
    
    console.log('\n📝 Manual test command:');
    console.log('curl -X POST http://localhost:5000/api/auth/register \\');
    console.log('  -H "Content-Type: application/json" \\');
    console.log('  -d \'{"name":"Test User","email":"test@example.com","password":"test123","role":"student","school":"Test School","grade":"10th"}\'');
}
