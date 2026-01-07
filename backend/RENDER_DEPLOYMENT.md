# Render Deployment Guide for NexTechHubs Backend

This guide will help you deploy the NexTechHubs backend API to Render.

## Prerequisites

- A [Render account](https://render.com) (free tier available)
- MongoDB Atlas database or another MongoDB hosting service
- Your frontend deployed (e.g., on Vercel)

## Quick Deploy

### Option 1: Deploy via Render Dashboard (Recommended for first-time users)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Create a new Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing this backend

3. **Configure the service**
   - **Name**: `nextechhubs-api` (or your preferred name)
   - **Region**: Choose closest to your users (e.g., Oregon)
   - **Branch**: `main` (or your production branch)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Set Environment Variables**
   Click "Advanced" and add these environment variables:

   | Key | Value | Notes |
   |-----|-------|-------|
   | `NODE_ENV` | `production` | Required |
   | `MONGODB_URI` | `your_mongodb_uri` | Your MongoDB connection string |
   | `JWT_SECRET` | `generate_strong_secret` | Use a strong random string (32+ chars) |
   | `JWT_EXPIRE` | `30d` | Token expiration time |
   | `FRONTEND_URL` | `https://your-app.vercel.app` | Your deployed frontend URL |
   | `EMAIL_HOST` | `smtp.gmail.com` | Optional: for email features |
   | `EMAIL_PORT` | `587` | Optional: SMTP port |
   | `EMAIL_USER` | `your-email@gmail.com` | Optional: your email |
   | `EMAIL_PASSWORD` | `your-app-password` | Optional: email app password |
   | `MAX_FILE_SIZE` | `10485760` | 10MB in bytes |
   | `UPLOAD_PATH` | `./uploads` | File upload directory |

   **Important**:
   - Generate a strong JWT secret using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - Use your actual MongoDB URI from MongoDB Atlas
   - Update FRONTEND_URL with your actual Vercel deployment URL

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your app
   - The first deployment takes 2-5 minutes

### Option 2: Deploy via render.yaml (Infrastructure as Code)

1. **Ensure render.yaml exists**
   The `render.yaml` file is already configured in the backend directory.

2. **Update environment variables**
   Edit `render.yaml` and ensure all `sync: false` variables are set in Render dashboard after deployment.

3. **Deploy via Render Blueprint**
   - Go to Render Dashboard
   - Click "New +" → "Blueprint"
   - Connect your repository
   - Render will detect `render.yaml` and create services automatically

## Post-Deployment Steps

### 1. Verify Deployment
Visit your Render service URL (e.g., `https://nextechhubs-api.onrender.com`)
You should see:
```json
{
  "message": "NexTechHubs API Server is running!",
  "version": "1.0.0",
  "timestamp": "2026-01-04T..."
}
```

### 2. Update Frontend CORS
Update your backend's allowed origins in [server.js:24-30](server.js#L24-L30) to include your Render URL:
```javascript
const allowedOrigins = [
    'https://nex-tech-hub.vercel.app',
    'https://nextechhubs-api.onrender.com', // Add this
    // ... other origins
];
```

### 3. Update Frontend API URL
Update your frontend's API base URL to point to: `https://your-app-name.onrender.com`

### 4. Test API Endpoints
Test key endpoints:
- Health check: `GET https://your-app.onrender.com/`
- Auth test: `POST https://your-app.onrender.com/api/auth/login`

## Important Notes

### Free Tier Limitations
- **Cold starts**: Free tier services spin down after 15 minutes of inactivity
- **First request**: May take 30-60 seconds after inactivity (spin-up time)
- **Build time**: Limited to 15 minutes
- **Disk storage**: Ephemeral (files reset on each deploy)

### File Uploads
The `uploads/` directory is ephemeral on Render free tier. For production:
1. Use a cloud storage service (AWS S3, Cloudinary, etc.)
2. Update file upload logic to use cloud storage instead of local filesystem

### Database Connection
- Use MongoDB Atlas (free tier available)
- Whitelist Render's IP addresses in MongoDB Atlas (or allow all: `0.0.0.0/0`)
- Use connection string with retry writes: `?retryWrites=true&w=majority`

### Environment Variables
- Never commit `.env` files to Git
- Use Render's environment variable management
- Regenerate JWT_SECRET for production (don't use example values)

## Troubleshooting

### Service won't start
- Check logs in Render dashboard
- Verify all required environment variables are set
- Ensure MongoDB URI is correct and accessible

### Database connection fails
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0` or Render's IPs
- Check MongoDB URI format and credentials
- Test connection string locally first

### CORS errors
- Add your Render URL to `allowedOrigins` in [server.js](server.js#L24-L30)
- Ensure frontend is using correct API URL
- Check browser console for specific CORS error details

### Cold start delays
- Upgrade to paid tier for always-on service
- Consider using a cron job to ping the service every 10 minutes
- Implement a loading state in your frontend for initial requests

## Monitoring

- **Logs**: View real-time logs in Render Dashboard → Your Service → Logs
- **Metrics**: Monitor CPU, memory, and bandwidth usage in dashboard
- **Health checks**: Render automatically checks `/` endpoint

## Scaling

To upgrade from free tier:
1. Go to your service settings
2. Select a paid plan (starts at $7/month for starter)
3. Benefits: No cold starts, more resources, custom domains

## Security Checklist

- [ ] Strong JWT_SECRET generated and set
- [ ] MongoDB credentials secured
- [ ] CORS properly configured
- [ ] Email credentials (if used) stored securely
- [ ] No sensitive data in logs
- [ ] HTTPS enabled (automatic on Render)

## Support

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com/)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)

## Additional Resources

- Update your frontend `.env` with the new API URL
- Consider setting up a custom domain in Render settings
- Enable automatic deploys for continuous deployment
