# GyanSetu Platform - Quick Setup Guide

## 🚀 Quick Start (Without MongoDB)

The application is ready to run in development mode. The frontend will work without a database connection.

### 1. Start Backend Server
```bash
cd server
npm run dev
```
The server will start on `http://localhost:5000` and show a MongoDB connection warning (this is normal for testing).

### 2. Start Frontend (in a new terminal)
```bash
cd client
npm start
```
The React app will start on `http://localhost:3001` (or next available port).

## 🛠️ Full Setup with Database

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### 1. Install MongoDB
**Option A: Local MongoDB**
- Download and install MongoDB Community Server
- Start MongoDB service

**Option B: MongoDB Atlas (Recommended)**
1. Create free account at https://mongodb.com/atlas
2. Create a cluster
3. Get connection string
4. Update `server/.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eco-learn-platform
   ```

### 2. Install Dependencies
```bash
# Install all dependencies
npm run install-deps
```

### 3. Configure Environment Variables

**Backend** (`server/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/eco-learn-platform
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

**Frontend** (`client/.env`):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Run Development Servers
```bash
# Start both servers simultaneously (from root directory)
npm run dev

# OR start them separately:
# Terminal 1:
npm run server

# Terminal 2:
npm run client
```

## 🎯 Testing the Application

### Without Database:
- ✅ View homepage with animations
- ✅ Navigate between pages
- ✅ See UI components and styling
- ❌ Registration/Login (requires DB)
- ❌ Data persistence

### With Database:
- ✅ Full registration/login functionality
- ✅ User dashboard with gamification
- ✅ Data persistence
- ✅ All API endpoints working

## 🐛 Troubleshooting

### Common Issues:

**Port 3000 already in use:**
- React will ask to run on another port (3001) - accept this

**MongoDB connection error:**
- For testing UI only: Ignore the error, frontend will work
- For full functionality: Install MongoDB or use Atlas

**Tailwind CSS not working:**
- Ensure you're on Tailwind CSS v3.x (not v4)
- Restart development server after config changes

**Build errors:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm start -- --reset-cache`

## 📱 Features You Can Test

### ✅ Working without Database:
- Beautiful landing page with animations
- Responsive navigation
- All page routes (Home, Lessons, Challenges, Leaderboard)
- Interactive UI components
- Mobile-responsive design

### ✅ Working with Database:
- User registration and authentication
- Personalized dashboard
- Progress tracking
- Gamification features (points, levels, badges)
- Real-time leaderboards

## 🌐 Deployment Ready

The application is structured for easy deployment:

**Frontend**: Ready for Vercel, Netlify, or any static hosting
**Backend**: Ready for Heroku, Railway, or any Node.js hosting
**Database**: MongoDB Atlas recommended for production

## 🔧 Development Commands

```bash
# Install dependencies
npm run install-deps

# Development (both servers)
npm run dev

# Frontend only
npm run client

# Backend only  
npm run server

# Build for production
npm run build
```

---

**🌱 The application is now ready for development and testing!**

Open `http://localhost:3001` to view the beautiful, animated environmental education platform.
