# 🚂 Deploy to Railway - Quick Start

## ⚡ 5-Minute Deployment

### 1️⃣ Push to GitHub (if not done already)

```bash
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

### 2️⃣ Create Railway Project

1. Go to https://railway.app
2. Click "Login" → Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository
6. **Done!** Railway will automatically deploy

### 3️⃣ Set Environment Variables

In Railway Dashboard → Your Project → **Variables**, add:

```
FLASK_ENV=production
WORKERS=4
LOG_LEVEL=INFO
ALLOWED_ORIGINS=https://your-railway-app.railway.app
SECRET_KEY=your-random-secret-key-here
```

> ⚠️ **Don't set PORT** - Railway sets this automatically!

### 4️⃣ Get Your App URL

Railway will provide a URL like: `https://your-app-name.railway.app`

### 5️⃣ Update Frontend API URL

```typescript
// Loan_Approval/project/src/services/api.ts
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-app-name.railway.app'  // ← Update this!
  : 'http://localhost:5000';
```

Then rebuild and redeploy:

```bash
cd Loan_Approval/project
npm run build
cd ../..
git add .
git commit -m "Update API URL"
git push origin main
```

### ✅ You're Live!

Visit your Railway URL and your LoanPro app is running! 🎉

---

## 📚 Need More Help?

- **Full Guide**: See `RAILWAY_DEPLOYMENT.md`
- **Project Cleanup**: See `CLEANUP_SUMMARY.md`
- **Railway Docs**: https://docs.railway.app

---

## 🎯 What Files Railway Uses

| File | Purpose |
|------|---------|
| `Dockerfile` | Builds your app |
| `requirements.txt` | Python dependencies |
| `app.py` | Your Flask application |
| `gunicorn.conf.py` | Production server |
| `Loan_Approval/project/dist/` | Built React app |

---

**That's it! Railway makes deployment super simple! 🚀**

