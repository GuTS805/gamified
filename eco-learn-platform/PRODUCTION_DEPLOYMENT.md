# 🚀 GyanSetu Production Deployment Guide

## Quick Start Options

### Option 1: Docker Deployment (Recommended)

1. **Clone and prepare the project:**
```bash
git clone <your-repo>
cd eco-learn-platform
```

2. **Set up environment variables:**
```bash
# Copy production templates
cp server/.env.production server/.env
cp client/.env.production client/.env

# Edit the files with your actual values
# server/.env: MongoDB URI, JWT secret, etc.
# client/.env: API URL
```

3. **Deploy with Docker:**
```bash
npm run docker:build
npm run docker:up
```

### Option 2: Separate Hosting (Production Recommended)

#### Backend Deployment (Railway/Render/Heroku)

1. **Deploy to Railway (Easiest):**
   - Connect your GitHub repo
   - Set environment variables in Railway dashboard:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: A secure 32-character random string
     - `NODE_ENV`: production
     - `CLIENT_URL`: Your frontend domain

2. **Deploy to Render:**
   - Create new Web Service
   - Build command: `cd server && npm install`
   - Start command: `cd server && npm start`
   - Set environment variables in Render dashboard

#### Frontend Deployment (Vercel/Netlify)

1. **Deploy to Vercel (Recommended):**
```bash
cd client
vercel --prod
```

2. **Deploy to Netlify:**
   - Connect your GitHub repo
   - Build command: `npm run build`
   - Publish directory: `build`
   - Environment variables: `REACT_APP_API_URL`

## Environment Variables Setup

### Server (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gyansetu
JWT_SECRET=your-32-char-secure-random-string
JWT_EXPIRE=7d
CLIENT_URL=https://gyansetu.vercel.app
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

### Client (.env.production)
```env
REACT_APP_API_URL=https://gyansetu-api.railway.app/api
```

## Database Setup (MongoDB Atlas)

1. Create MongoDB Atlas account
2. Create new cluster (free M0)
3. Create database user
4. Get connection string
5. Seed database:
```bash
cd server
npm run seed
```

## Deployment Verification

### Health Checks
- Backend: `https://your-api-domain.com/api/health`
- Frontend: `https://your-frontend-domain.com`

### Test Accounts (After Seeding)
- **Admin**: admin@gyansetu.com / admin123
- **Student**: arjun@student.com / student123

## Production Features Ready

✅ **Branding Updated**: GyanSetu throughout the app
✅ **Custom Logo**: Professional green/blue gradient with plant emoji
✅ **SEO Ready**: Proper meta tags and descriptions
✅ **Docker Ready**: Full containerization support
✅ **Health Monitoring**: `/api/health` endpoint
✅ **Security Headers**: CORS, rate limiting ready
✅ **Error Handling**: Production error responses
✅ **Environment Configs**: Separate dev/prod configurations

## Platform-Specific Notes

### Vercel
- Uses provided `vercel.json` configuration
- Automatic deployments on git push
- Built-in CDN and optimization

### Railway
- Detects Node.js automatically
- Built-in database support
- Easy environment variable management

### Docker
- Uses multi-stage builds for optimization
- Nginx for frontend serving
- Health checks included
- Volume persistence for uploads

## Monitoring & Maintenance

### Logs
```bash
# Docker logs
npm run docker:logs

# Individual service logs
docker logs gyansetu-api
docker logs gyansetu-client
```

### Updates
```bash
# Update and redeploy
git pull origin main
npm run docker:build
npm run docker:up
```

### Backup
- MongoDB: Use Atlas automated backups
- Files: Backup `/uploads` directory if using file uploads

## Support

For issues:
1. Check health endpoints
2. Verify environment variables
3. Check database connectivity
4. Review application logs

The GyanSetu platform is now production-ready! 🌱✨
