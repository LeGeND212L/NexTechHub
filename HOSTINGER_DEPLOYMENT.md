# 🚀 Hostinger Deployment Guide for NexTechHubs

This guide explains how to deploy both **Backend (Node.js API)** and **Frontend (React)** on Hostinger.

---

## 📋 Prerequisites

1. **Hostinger VPS or Business Web Hosting** (with Node.js support)
2. **MongoDB Atlas** account for database
3. **GitHub** account for code hosting
4. **Domain** configured in Hostinger

---

## 🏗️ Project Structure

```
Vender/
├── backend/          # Node.js API Server
│   ├── server.js
│   ├── ecosystem.config.js  # PM2 configuration
│   ├── .env.example
│   └── ...
└── frontend/         # React Application
    ├── public/
    │   └── .htaccess  # Apache configuration for SPA
    ├── src/
    └── ...
```

---

## 📦 Part 1: Backend Deployment

### Option A: Hostinger VPS (Recommended)

#### Step 1: Connect to VPS via SSH

```bash
ssh root@your-vps-ip
```

#### Step 2: Install Node.js (if not installed)

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Step 3: Install PM2 globally

```bash
npm install -g pm2
```

#### Step 4: Clone your repository

```bash
cd /var/www
git clone https://github.com/yourusername/your-repo.git
cd your-repo/backend
```

#### Step 5: Install dependencies

```bash
npm install --production
```

#### Step 6: Configure environment variables

```bash
# Copy example env file
cp .env.example .env

# Edit with your values
nano .env
```

Update these values in `.env`:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your-super-secret-key-minimum-32-characters
FRONTEND_URL=https://yourdomain.com
```

#### Step 7: Create uploads directory with proper permissions

```bash
mkdir -p uploads/contacts uploads/payslips uploads/tasks
chmod -R 755 uploads
```

#### Step 8: Start with PM2

```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

#### Step 9: Configure Nginx as reverse proxy

```bash
sudo nano /etc/nginx/sites-available/api.yourdomain.com
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/api.yourdomain.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### Step 10: Install SSL with Certbot

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

---

### Option B: Hostinger Shared Hosting (with Node.js)

#### Step 1: Access Hostinger hPanel

1. Log in to Hostinger
2. Go to **Hosting** → **Manage**
3. Navigate to **Advanced** → **Node.js**

#### Step 2: Create Node.js Application

1. Click **Create Application**
2. Select Node.js version: **18.x** or higher
3. Application root: `backend`
4. Application URL: `api.yourdomain.com`
5. Startup file: `server.js`
6. Click **Create**

#### Step 3: Upload files via File Manager or Git

1. Go to **Files** → **File Manager**
2. Navigate to the backend folder
3. Upload all backend files
4. Or use Git deployment from hPanel

#### Step 4: Configure Environment Variables

In hPanel Node.js settings, add environment variables:

- `NODE_ENV` = `production`
- `MONGODB_URI` = `your-mongodb-connection-string`
- `JWT_SECRET` = `your-secret-key`
- `FRONTEND_URL` = `https://yourdomain.com`

#### Step 5: Install dependencies and restart

```bash
# In hPanel terminal or SSH
cd backend
npm install --production
```

Then click **Restart** in Node.js settings.

---

## 🎨 Part 2: Frontend Deployment

### Step 1: Create production environment file

```bash
cd frontend

# Create production env file
cp .env.example .env.production
```

Edit `.env.production`:

```env
REACT_APP_API_URL=https://api.yourdomain.com/api
REACT_APP_SOCKET_URL=https://api.yourdomain.com
REACT_APP_NAME=NexTechHubs
```

### Step 2: Build the React app

```bash
npm install
npm run build
```

This creates a `build` folder with optimized production files.

### Step 3: Upload to Hostinger

#### Via File Manager:

1. Go to Hostinger hPanel → **File Manager**
2. Navigate to `public_html` folder
3. Upload all contents from the `build` folder
4. Make sure `.htaccess` file is uploaded (enable hidden files view)

#### Via FTP:

1. Use FileZilla or similar FTP client
2. Connect using Hostinger FTP credentials
3. Upload `build` folder contents to `public_html`

### Step 4: Verify .htaccess

Ensure the `.htaccess` file in `public_html` contains:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

This enables React Router to work correctly.

---

## 🔧 Domain Configuration

### For Separate Subdomains (Recommended):

- **Frontend**: `yourdomain.com` or `www.yourdomain.com`
- **Backend**: `api.yourdomain.com`

### In Hostinger hPanel:

1. Go to **Domains** → **Subdomains**
2. Create subdomain `api`
3. Point it to your backend application

---

## 🔐 Security Checklist

- [ ] Use strong JWT_SECRET (min 32 characters)
- [ ] Enable HTTPS/SSL for both domains
- [ ] Set NODE_ENV=production
- [ ] Update CORS origins in server.js
- [ ] Use MongoDB Atlas with IP whitelist
- [ ] Keep dependencies updated

---

## 📊 Monitoring & Logs

### VPS with PM2:

```bash
# View logs
pm2 logs nextechhubs-backend

# Monitor
pm2 monit

# Status
pm2 status
```

### Shared Hosting:

Check logs in hPanel → **Files** → **Logs**

---

## 🔄 Updating the Application

### Backend:

```bash
cd /var/www/your-repo/backend
git pull origin main
npm install --production
pm2 restart nextechhubs-backend
```

### Frontend:

```bash
cd frontend
npm run build
# Upload new build folder to public_html
```

---

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Update `FRONTEND_URL` in backend `.env`
   - Update `allowedOrigins` in `server.js`

2. **MongoDB Connection Failed**
   - Check MongoDB Atlas IP whitelist (add `0.0.0.0/0` for any IP)
   - Verify connection string in `.env`

3. **404 Errors on Frontend Routes**
   - Ensure `.htaccess` is uploaded
   - Check Apache mod_rewrite is enabled

4. **Socket.IO Not Working**
   - Ensure WebSocket is allowed in Nginx config
   - Check `REACT_APP_SOCKET_URL` in frontend env

5. **File Upload Issues**
   - Check `uploads` folder permissions (755)
   - Verify `MAX_FILE_SIZE` in env

---

## 📞 Support

For Hostinger-specific issues:

- [Hostinger Knowledge Base](https://support.hostinger.com/)
- [Hostinger Node.js Tutorials](https://www.hostinger.com/tutorials/node-js)

---

## 📝 Quick Reference

| Service      | URL                         |
| ------------ | --------------------------- |
| Frontend     | https://yourdomain.com      |
| Backend API  | https://api.yourdomain.com  |
| Health Check | https://api.yourdomain.com/ |
| MongoDB      | MongoDB Atlas Dashboard     |

---

**Last Updated:** January 2026
