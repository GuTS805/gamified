# 🚀 GyanSetu Platform Deployment Guide

## Quick Start (Recommended Path)

### 1. Database Setup (Choose One Option)

#### Option A: MongoDB Atlas (Easiest - Free Cloud Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster:
   - Choose AWS as provider
   - Select M0 Sandbox (FREE tier)
   - Choose your nearest region
4. Create Database User:
   - Go to Database Access
   - Add New Database User
   - Set username and password (remember these!)
5. Network Access:
   - Go to Network Access
   - Add IP Address
   - Use `0.0.0.0/0` to allow all IPs (for development)
6. Connect:
   - Click "Connect" on your cluster
   - Choose "Drivers"
   - Copy the connection string
   - Replace `<password>` with your actual password

#### Option B: Local MongoDB
```bash
# Download from https://www.mongodb.com/try/download/community
# Follow Windows installation guide
# Start MongoDB service
```

#### Option C: Docker
```bash
# Install Docker Desktop first
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 2. Environment Configuration

Update `server/.env` with your MongoDB connection:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eco-learn-platform
# OR for local: MONGODB_URI=mongodb://localhost:27017/eco-learn-platform
JWT_SECRET=eco_learn_jwt_secret_key_2024
JWT_EXPIRE=7d
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 3. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 4. Seed Database with Sample Data

```bash
cd server
npm run seed
```

This will create:
- 6 interactive lessons matching your frontend
- 3 engaging challenges
- User accounts (admin, teacher, students)
- Badges and sample progress data

### 5. Start Development Servers

```bash
# Terminal 1 - Start backend
cd server
npm run dev

# Terminal 2 - Start frontend  
cd client
npm run dev
```

## Test Accounts

After seeding, you can login with:

- **Admin**: `admin@gyansetu.com` / `admin123`
- **Teacher**: `teacher@gyansetu.com` / `teacher123`
- **Student**: `arjun@student.com` / `student123`

## Features Ready to Test

### ✅ Interactive Lessons
- Climate Change Basics
- Waste Management
- Biodiversity Conservation
- Renewable Energy
- Water Conservation
- Sustainable Living

### ✅ Gamification Features
- Progress tracking with animated progress bars
- Points system (EcoPoints)
- Badges and achievements
- User levels and streaks
- Interactive card animations

### ✅ Challenges System
- Plant a Tree challenge
- Zero Waste Week challenge
- Energy Saver challenge
- Evidence submission system
- Progress tracking

### ✅ User Management
- Role-based authentication (Admin, Teacher, Student)
- User profiles with progress data
- School integration

## API Endpoints Available

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Lessons
- `GET /api/lessons` - Get all lessons
- `GET /api/lessons/:id` - Get specific lesson
- `POST /api/lessons/:id/complete` - Mark lesson complete
- `POST /api/lessons/:id/like` - Like a lesson

### Challenges
- `GET /api/challenges` - Get all challenges
- `GET /api/challenges/:id` - Get specific challenge
- `POST /api/challenges/:id/join` - Join challenge
- `POST /api/challenges/:id/submit` - Submit evidence

### Progress
- `GET /api/progress/stats` - Get user progress stats
- `GET /api/progress/leaderboard` - Get leaderboard

## Troubleshooting

### MongoDB Connection Issues
```bash
# Run the setup helper
node setup-mongodb-atlas.js
```

### Port Conflicts
- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:3000`

### Dependencies Issues
```bash
# Clear caches and reinstall
cd server
rm -rf node_modules package-lock.json
npm install

cd ../client  
rm -rf node_modules package-lock.json
npm install
```

## Production Deployment

### Backend (Node.js/Express)
- Deploy to services like Heroku, Railway, or Render
- Set environment variables in deployment platform
- Use MongoDB Atlas for database

### Frontend (React/Vite)
- Deploy to Vercel, Netlify, or similar
- Update API URLs to point to production backend
- Set up proper CORS configuration

## Next Development Steps

1. **Frontend-Backend Integration**
   - Connect all frontend components to API endpoints
   - Implement proper error handling
   - Add loading states

2. **Enhanced Features**
   - Real-time notifications
   - File upload for challenge evidence
   - Advanced analytics dashboard
   - Social features (comments, sharing)

3. **Performance Optimization**
   - Image optimization
   - API response caching
   - Database indexing

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify your `.env` configuration
3. Ensure MongoDB is running and accessible
4. Check that all dependencies are installed

The platform is now ready for full-stack development and testing! 🌱
