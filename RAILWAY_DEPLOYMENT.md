# 🚂 Railway Deployment Guide for LoanPro

Complete guide to deploy your LoanPro application on Railway.

## 📋 Prerequisites

- Railway account (sign up at [railway.app](https://railway.app))
- GitHub account (to connect your repository)
- Your code pushed to a GitHub repository

## 🚀 Quick Deployment Steps

### Step 1: Prepare Your Repository

1. **Ensure all files are committed:**
   ```bash
   git add .
   git commit -m "Prepare for Railway deployment"
   git push origin main
   ```

2. **Required files (already in your repo):**
   - ✅ `Dockerfile` - Railway will use this automatically
   - ✅ `requirements.txt` - Python dependencies
   - ✅ `gunicorn.conf.py` - Production server config
   - ✅ `app.py` - Your Flask application
   - ✅ `railway.json` - Railway configuration
   - ✅ `Loan_Approval/project/dist/` - Built React frontend

### Step 2: Deploy on Railway

1. **Go to Railway Dashboard:**
   - Visit [railway.app](https://railway.app)
   - Click "Login" and sign in with GitHub

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Railway will automatically:**
   - Detect the Dockerfile
   - Build your Docker image
   - Deploy your application
   - Assign a public URL

### Step 3: Configure Environment Variables

In your Railway project dashboard, go to **Variables** tab and add:

```env
FLASK_ENV=production
FLASK_DEBUG=False
WORKERS=4
LOG_LEVEL=INFO
SECRET_KEY=generate-a-secure-random-key-here
ALLOWED_ORIGINS=https://your-railway-domain.railway.app
```

**Important:** Railway automatically sets the `PORT` variable - don't override it!

### Step 4: Update Frontend API URL

After deployment, Railway gives you a URL like: `https://your-app-name.railway.app`

Update your frontend API configuration:

```typescript
// src/services/api.ts
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-app-name.railway.app'  // ← Update this with your Railway URL
  : 'http://localhost:5000';
```

Then rebuild your frontend:
```bash
cd Loan_Approval/project
npm run build
```

Commit and push the changes:
```bash
git add .
git commit -m "Update API URL for Railway"
git push origin main
```

Railway will automatically redeploy!

## 🔧 Advanced Configuration

### Custom Domain

1. Go to your Railway project → **Settings** → **Domains**
2. Click "Generate Domain" for a custom Railway subdomain
3. Or add your own custom domain

### Scaling

Railway allows you to scale vertically:
1. Go to **Settings** → **Resources**
2. Adjust CPU and RAM as needed

### Logs & Monitoring

- View real-time logs: Click **Deployments** → **Logs**
- Monitor CPU/RAM usage in the **Metrics** tab

### Health Checks

Your app includes a health check endpoint:
```
GET https://your-app-name.railway.app/api/health
```

Railway will automatically use the Dockerfile's HEALTHCHECK.

## 📊 Project Structure

```
your-repo/
├── app.py                          # Flask backend (entry point)
├── Dockerfile                      # Railway will use this
├── requirements.txt                # Python dependencies
├── gunicorn.conf.py               # Gunicorn config
├── railway.json                    # Railway configuration
├── loan_model.pkl                  # ML model
├── label_encoders.pkl             # Label encoders
├── Loan_Approval/
│   └── project/
│       ├── dist/                   # Built React app (served by Flask)
│       ├── src/                    # React source code
│       ├── package.json
│       └── vite.config.ts
└── env.example                     # Environment variables template
```

## 🌐 How It Works

1. **Backend (Flask):**
   - Runs on Railway using Docker
   - Serves API endpoints at `/api/*`
   - Serves the React frontend from `/Loan_Approval/project/dist/`

2. **Frontend (React):**
   - Built to static files in `dist/` folder
   - Served by Flask as a SPA (Single Page Application)
   - Makes API calls to the same domain (no CORS issues!)

## ✅ Post-Deployment Checklist

- [ ] Application is accessible at Railway URL
- [ ] Health check endpoint responds: `/api/health`
- [ ] Frontend loads correctly
- [ ] Can submit loan application form
- [ ] Results display properly
- [ ] Chatbot works
- [ ] Multi-language support works
- [ ] No console errors

## 🐛 Troubleshooting

### Application won't start?

**Check logs:**
- Railway Dashboard → Deployments → Logs
- Look for Python errors or missing dependencies

**Common fixes:**
```bash
# Rebuild with clean cache
railway up --no-cache

# Check environment variables
railway variables
```

### Frontend shows but API fails?

**Fix CORS issues:**
1. Add your Railway domain to `ALLOWED_ORIGINS` environment variable
2. Redeploy

### 502/503 Errors?

**Check:**
- Application is binding to `0.0.0.0:$PORT` (Railway's PORT variable)
- Gunicorn is configured correctly
- Health check endpoint responds

### Build Failures?

**Ensure:**
- All required files are in the repo
- requirements.txt has correct package versions
- Dockerfile syntax is correct

## 💰 Railway Pricing

- **Free tier:** $5 credit/month (great for development)
- **Hobby plan:** $5/month (better for production)
- Pay only for what you use

## 🔄 Continuous Deployment

Railway automatically redeploys when you push to your GitHub repo:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Railway automatically:
# 1. Detects the push
# 2. Builds new Docker image
# 3. Deploys new version
# 4. Zero-downtime deployment!
```

## 📞 Support & Resources

- **Railway Docs:** [docs.railway.app](https://docs.railway.app)
- **Railway Discord:** [railway.app/discord](https://railway.app/discord)
- **Railway Status:** [status.railway.app](https://status.railway.app)

## 🎉 Success!

Your LoanPro application should now be live on Railway! 🚀

**Share your deployment URL and start helping users with their loan applications!**

---

### Quick Commands Reference

```bash
# Install Railway CLI (optional)
npm i -g @railway/cli

# Login to Railway
railway login

# Link to project
railway link

# View logs
railway logs

# Run command in Railway environment
railway run python test_connection.py

# Open dashboard
railway open
```

---

**Need help?** Check Railway's excellent documentation or their Discord community!

