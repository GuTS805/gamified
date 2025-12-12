# 🌱 GyanSetu - Gamified Environmental Education Platform

**GyanSetu** is a comprehensive full-stack educational platform that combines gamification with environmental learning to create an engaging and impactful educational experience. Built with modern web technologies, it provides interactive lessons, real-world challenges, and a complete gamification system to motivate students in their environmental education journey.

![GyanSetu Logo](client/public/logo192.svg)

## ✨ Key Features

- 🎮 **Complete Gamification System** - EcoPoints, levels, badges, and leaderboards
- 📚 **Interactive Lessons** - Environmental education with multimedia content
- 🌍 **Real-world Challenges** - Hands-on sustainability tasks with evidence submission
- 📱 **Mobile-First Design** - Responsive UI with smooth animations
- 🔐 **Role-based Authentication** - Student, Teacher, and Admin roles
- 🚀 **Production Ready** - Complete deployment configurations included

## 🚀 Quick Start


### Test Accounts
After seeding, you can log in with:
- **Admin**: admin@gyansetu.com / admin123
- **Student**: arjun@student.com / student123
- **Teacher**: teacher@gyansetu.com / teacher123

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Framer Motion** for smooth animations and transitions
- **Tailwind CSS** for responsive utility-first styling
- **React Router DOM** for client-side routing
- **Axios** for HTTP requests and API communication
- **Context API** for global state management

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM for data modeling
- **JWT** for secure authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **Multer** for file upload handling
- **CORS** for cross-origin resource sharing

### DevOps & Deployment
- **Docker** with multi-stage builds
- **Docker Compose** for local development
- **Vercel/Netlify** configurations for frontend
- **Railway/Render** ready for backend deployment
- **MongoDB Atlas** for cloud database
- **Nginx** for production frontend serving

## 🎮 Gamification Features

### EcoPoints System
- Students earn points for lesson completion, quiz performance, and challenge participation
- Points accumulate to unlock new levels and achievements
- Visual progress indicators with animated counters

### Level Progression
- Automatic level advancement based on accumulated EcoPoints
- Each level unlocks new content and features
- Visual level badges and progression animations

### Badge System
- Achievement badges for various environmental milestones
- Special recognition for consistent participation
- Social sharing capabilities for achievements

### Leaderboards
- School-wide and global competition rankings
- Weekly and monthly leaderboard resets
- Encouraging healthy competition among students

## 🔧 Key API Endpoints

### Authentication
```
POST /api/auth/register  # User registration
POST /api/auth/login     # User login
GET  /api/auth/profile   # Get user profile
GET  /api/health         # Health check
```

### Learning Content
```
GET  /api/lessons        # Get all lessons
GET  /api/lessons/:id    # Get specific lesson
POST /api/lessons/:id/complete # Mark lesson complete
GET  /api/challenges     # Get challenges
POST /api/challenges/:id/join   # Join challenge
```

### Gamification
```
GET  /api/badges         # Get available badges
GET  /api/progress/leaderboard # Get leaderboard
GET  /api/progress/stats # Get user progress
```

## 🚀 Deployment

### Docker Deployment (Recommended)
```bash
# Build and start all services
npm run docker:build
npm run docker:up

# View logs
npm run docker:logs

# Stop services
npm run docker:down
```

### Manual Deployment

#### Frontend (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variable: `REACT_APP_API_URL`

#### Backend (Railway/Render)
1. Connect your GitHub repository
2. Set root directory: `server`
3. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`

### Environment Variables

**Server (.env):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gyansetu
JWT_SECRET=your-secure-32-character-secret-key
JWT_EXPIRE=7d
CLIENT_URL=https://your-frontend-domain.com
```

**Client (.env):**
```env
REACT_APP_API_URL=https://your-api-domain.com/api
```

## 📚 Available Scripts

### Development
```bash
npm run dev           # Start both frontend and backend
npm run server        # Start only backend server
npm run client        # Start only frontend server
npm run install-deps  # Install all dependencies
```

### Production
```bash
npm run build:all     # Build entire application
npm run start:prod    # Start production server
npm run seed          # Seed database with sample data
```

### Docker
```bash
npm run docker:build  # Build Docker images
npm run docker:up     # Start containers
npm run docker:down   # Stop containers
npm run docker:logs   # View container logs
```

## 📝 Documentation

- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Original deployment instructions
- **[PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md)** - Updated production deployment guide
- **[ENHANCED_FEATURES.md](ENHANCED_FEATURES.md)** - Feature specifications
- **[SETUP.md](SETUP.md)** - Initial setup instructions
- **[WARP.md](WARP.md)** - Development guidance for Warp AI

## 🌱 Educational Impact

### Learning Objectives
- **Environmental Awareness**: Understanding climate change and sustainability
- **Practical Application**: Real-world environmental challenges
- **Community Engagement**: Collaborative learning and competition
- **Digital Literacy**: Modern web platform interaction skills

### Curriculum Alignment
- Supports NEP 2020 experiential learning goals
- Aligns with UN Sustainable Development Goals
- Integrates with existing environmental science curricula
- Promotes 21st-century skills development

## 🔒 Security & Performance

### Security Features
- JWT-based authentication with secure token handling
- bcrypt password hashing with salt rounds
- Input validation and sanitization
- CORS configuration for secure cross-origin requests
- Environment variable management for sensitive data

### Performance Optimizations
- React lazy loading for code splitting
- Image optimization and lazy loading
- MongoDB indexing for fast queries
- Nginx compression and caching
- CDN-ready static asset delivery

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Check the health endpoint: `/api/health`
- Review the documentation in the `/docs` folder
- Create an issue for bug reports or feature requests

---

**GyanSetu** - Empowering environmental education through gamification 🌱✨

