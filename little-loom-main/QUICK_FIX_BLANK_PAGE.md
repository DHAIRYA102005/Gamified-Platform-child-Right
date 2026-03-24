# 🚨 Quick Fix: Blank Page on Vercel

## Immediate Steps to Fix

### Step 1: Add Environment Variables in Vercel ⚠️ **MOST IMPORTANT**

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. Add these **3 variables** (for Production, Preview, AND Development):

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Where to get these:**
- Go to [Supabase Dashboard](https://app.supabase.com)
- Select your project
- Go to **Settings** → **API**
- Copy:
  - **Project URL** → `VITE_SUPABASE_URL`
  - **anon/public key** → `VITE_SUPABASE_PUBLISHABLE_KEY`
  - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep secret!)

### Step 2: Redeploy

After adding environment variables:

1. Go to **Deployments** tab
2. Click **⋯** (three dots) on latest deployment
3. Click **Redeploy**
4. Wait for build to complete

### Step 3: Check Browser Console

1. Open your site: `https://little-loom.vercel.app`
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Look for errors

**If you see:**
- `Missing Supabase environment variables` → Go back to Step 1
- `Failed to fetch` → Check API routes
- `404 Not Found` → Check routing

### Step 4: Verify Build Success

1. In Vercel Dashboard → **Deployments**
2. Click on latest deployment
3. Check **Build Logs** for errors
4. Should see: `✓ Built in X seconds`

## Common Issues

### Issue: Still blank after adding env vars

**Solution:**
- Make sure variables start with `VITE_` for frontend
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

### Issue: Build fails

**Solution:**
- Check **Build Logs** in Vercel
- Look for TypeScript errors
- Verify all dependencies installed

### Issue: API routes don't work

**Solution:**
- Test: `https://your-project.vercel.app/api/health`
- Should return: `{"status":"ok","message":"Little Loom API is running!"}`
- If not, check `SUPABASE_SERVICE_ROLE_KEY` is set

## Quick Test Checklist

- [ ] Environment variables added in Vercel
- [ ] Variables have `VITE_` prefix for frontend
- [ ] Redeployed after adding variables
- [ ] Build completed successfully
- [ ] No errors in browser console (F12)
- [ ] `/api/health` endpoint works

## Still Not Working?

1. **Check Vercel Function Logs:**
   - Dashboard → **Functions** → Click function → **Logs**

2. **Test locally first:**
   ```bash
   npm run build
   npm run preview
   ```
   Visit `http://localhost:4173` - does it work?

3. **Compare environment:**
   - Check `.env` file locally
   - Make sure same variables are in Vercel

4. **Contact Support:**
   - Vercel: https://vercel.com/support
   - Check status: https://www.vercel-status.com

---

**Most likely fix:** Add environment variables and redeploy! 🚀

