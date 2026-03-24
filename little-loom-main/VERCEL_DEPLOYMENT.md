# 🚀 Vercel Deployment Guide for Little Loom

This guide will help you deploy your Little Loom application to Vercel.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub/GitLab/Bitbucket**: Your code should be in a Git repository
3. **Supabase Project**: Your Supabase database should be set up

## 🔧 Step 1: Prepare Your Repository

Make sure your code is committed and pushed to your Git repository:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## 🌐 Step 2: Deploy via Vercel Dashboard

### Option A: Import from Git (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your Git repository
4. Vercel will auto-detect your Vite project

### Option B: Use Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from your project root)
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? little-loom (or your preferred name)
# - Directory? ./
# - Override settings? No
```

## 🔐 Step 3: Configure Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Important**: 
- Get these from your Supabase Dashboard → Settings → API
- The `SUPABASE_SERVICE_ROLE_KEY` is sensitive - never expose it to the frontend
- Add these for **Production**, **Preview**, and **Development** environments

## 📝 Step 4: Update Frontend API Calls (If Needed)

If your frontend makes API calls to `http://localhost:3001`, update them to use relative paths:

```javascript
// Instead of: http://localhost:3001/api/health
// Use: /api/health

// Example:
const response = await fetch('/api/health');
```

The `vercel.json` configuration handles routing `/api/*` to your serverless functions.

## 🎯 Step 5: Build Configuration

Vercel will automatically detect your Vite project and use:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

These are already configured in `vercel.json`.

## 🚀 Step 6: Deploy

### First Deployment

```bash
vercel --prod
```

Or use the Vercel dashboard:
1. Click **"Deploy"**
2. Wait for the build to complete
3. Your app will be live at `https://your-project-name.vercel.app`

### Future Deployments

Every push to your main branch will automatically trigger a deployment!

## 🔍 Step 7: Verify Deployment

1. **Check API Health**: Visit `https://your-project.vercel.app/api/health`
2. **Test Frontend**: Visit `https://your-project.vercel.app`
3. **Check Logs**: Go to Vercel Dashboard → Deployments → View Function Logs

## 🐛 Troubleshooting

### Build Fails

1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version (Vercel uses Node 18.x by default)

### API Routes Not Working

1. Check that environment variables are set correctly
2. Verify CORS headers in your API functions
3. Check function logs in Vercel dashboard

### Environment Variables Not Loading

1. Ensure variables are added for the correct environment (Production/Preview)
2. Redeploy after adding new environment variables
3. Check variable names match exactly (case-sensitive)

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Supabase Environment Variables](https://supabase.com/docs/guides/getting-started/local-development#environment-variables)

## 🎉 Success!

Your Little Loom app should now be live on Vercel! 

**Next Steps:**
- Set up a custom domain (optional)
- Configure preview deployments for pull requests
- Set up monitoring and analytics

