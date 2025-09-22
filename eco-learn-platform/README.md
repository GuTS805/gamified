# GyanSetu Platform - Gamified Environmental Education

A comprehensive MERN stack application designed to make environmental education engaging and effective for Indian students through gamification, interactive lessons, and real-world challenges.

## 🌟 Features

### 🎯 Gamification System
- **EcoPoints System**: Students earn points for completing lessons, quizzes, and challenges
- **Level Progression**: Automatic level advancement based on accumulated points
- **Digital Badges**: Special achievements for various environmental milestones
- **Leaderboards**: School-level competitions to encourage participation
- **Streak Tracking**: Daily login rewards and activity streaks

### 📚 Educational Content
- **Interactive Lessons**: Multimedia content on climate change, sustainability, biodiversity, etc.
- **Real-world Challenges**: Hands-on environmental tasks like tree planting, waste segregation
- **Quizzes & Assessments**: Knowledge testing with immediate feedback
- **Progress Tracking**: Detailed analytics on learning journey
- **Localized Content**: Tailored for Indian environmental contexts and SDG goals

### 🎨 User Experience
- **Animated Interface**: Smooth animations using Framer Motion
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Environmental Theme**: Green and earth-tone color palette
- **Card-based Layouts**: Modern, engaging UI components
- **Accessibility**: Screen reader friendly and keyboard navigable

### 👥 User Roles
- **Students**: Complete lessons, take quizzes, join challenges, track progress
- **Teachers**: Create content, monitor student progress, manage school competitions
- **Admin**: System-wide management and analytics

## 🚀 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Framer Motion** for animations
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API communication
- **Context API** for state management

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **Multer** for file uploads

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/eco-learn-platform
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm start
   ```

### Database Setup
The application will automatically connect to MongoDB and create the necessary collections. For production, ensure you have:
- Proper database indexes for search functionality
- Regular backups configured
- Appropriate connection limits set

## 🎨 UI/UX Features

### Animations & Interactions
- **Smooth page transitions** with staggered animations
- **Card hover effects** with elevation and scale transforms
- **Loading states** with skeleton screens and spinners
- **Micro-interactions** for buttons, forms, and navigation
- **Scroll-triggered animations** for content reveal
- **Floating elements** in hero sections

### Color Scheme
- **Primary Green**: `#22c55e` (Nature-inspired primary color)
- **Earth Tones**: Brown and tan accents for grounding
- **Blue Accents**: `#3b82f6` (Water and sky themes)
- **Gradient Backgrounds**: Soft green-to-blue environmental gradients

### Typography
- **System Fonts**: Native font stacks for optimal performance
- **Hierarchical Scales**: Clear text hierarchy for readability
- **Responsive Text**: Fluid typography that scales with screen size

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Password reset

### Lessons
- `GET /api/lessons` - Get all lessons (with pagination/filters)
- `GET /api/lessons/:id` - Get single lesson
- `POST /api/lessons/:id/complete` - Mark lesson as completed
- `POST /api/lessons` - Create new lesson (teachers only)

### Challenges
- `GET /api/challenges` - Get active challenges
- `POST /api/challenges/:id/join` - Join a challenge
- `POST /api/challenges/:id/submit` - Submit challenge evidence

### Gamification
- `GET /api/badges` - Get available badges
- `GET /api/leaderboard` - Get leaderboard data
- `POST /api/users/:id/award-points` - Award eco-points

## 🎯 Educational Alignment

### NEP 2020 Compliance
- **Experiential Learning**: Hands-on environmental challenges
- **21st Century Skills**: Critical thinking through problem-solving
- **Assessment Reform**: Continuous evaluation through gamification
- **Multilingual Support**: Ready for regional language content

### SDG Integration
The platform directly supports multiple UN Sustainable Development Goals:
- **SDG 4**: Quality Education through innovative learning methods
- **SDG 13**: Climate Action through environmental awareness
- **SDG 15**: Life on Land through biodiversity education
- **SDG 6**: Clean Water through conservation challenges

## 🌱 Environmental Impact

### Real-world Challenges
- **Tree Planting**: Geo-located tree planting verification
- **Waste Segregation**: Photo evidence of proper waste disposal
- **Energy Conservation**: Home energy audit challenges
- **Water Saving**: Water usage tracking and reduction goals

### Community Engagement
- **School Competitions**: Inter-school environmental competitions
- **Local NGO Partnerships**: Integration with environmental organizations
- **Parent Involvement**: Family-based environmental challenges
- **Social Sharing**: Achievement sharing to spread awareness

## 📱 Mobile Responsiveness

The platform is built with a mobile-first approach:
- **Touch-friendly Interface**: Large tap targets and intuitive gestures
- **Optimized Performance**: Lazy loading and efficient resource management
- **Progressive Web App**: PWA features for native-like experience
- **Offline Capabilities**: Cache important content for offline access

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Server-side validation for all inputs
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Environment Variables**: Secure configuration management

## 🚀 Deployment

### Production Setup
1. **Environment Variables**: Update all `.env` files with production values
2. **Database**: Use MongoDB Atlas or other production database
3. **Build Process**: Run `npm run build` in the client directory
4. **Server Deployment**: Deploy to platforms like Heroku, Railway, or DigitalOcean
5. **CDN Integration**: Use Cloudflare or AWS CloudFront for static assets

### Recommended Hosting
- **Backend**: Railway, Heroku, or DigitalOcean App Platform
- **Frontend**: Vercel, Netlify, or Firebase Hosting
- **Database**: MongoDB Atlas
- **File Storage**: AWS S3 or Cloudinary for media files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **UNESCO** for environmental education guidelines
- **NEP 2020** for educational framework inspiration
- **UN SDGs** for sustainability goal alignment
- **Indian Environmental Organizations** for real-world context

---

**Made with 💚 for Mother Earth**

*Empowering the next generation of environmental stewards through engaging, gamified learning experiences.*
