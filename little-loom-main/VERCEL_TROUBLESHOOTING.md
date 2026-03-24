# 🔧 Vercel Deployment Troubleshooting

## Issue: Blank Page / Nothing Shows After Deployment

### ✅ Solution 1: Check Environment Variables

Make sure you've added **all required environment variables** in Vercel:

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add these variables (for **Production**, **Preview**, and **Development**):

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Important Notes:**
- Variables must start with `VITE_` to be accessible in the frontend
- Get these from Supabase Dashboard → Settings → API
- After adding variables, **redeploy** your project

### ✅ Solution 2: Check Build Logs

1. Go to Vercel Dashboard → **Deployments**
2. Click on the latest deployment
3. Check the **Build Logs** for errors

Common build errors:
- Missing dependencies → Check `package.json`
- TypeScript errors → Fix type errors
- Environment variable errors → Add missing variables

### ✅ Solution 3: Verify vercel.json Configuration

Ensure your `vercel.json` has the SPA rewrite rule:

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures React Router works correctly.

### ✅ Solution 4: Check Browser Console

1. Open your deployed site
2. Press `F12` to open Developer Tools
3. Check the **Console** tab for errors

Common errors:
- `Missing Supabase environment variables` → Add env vars in Vercel
- `Failed to fetch` → Check API routes
- `404 Not Found` → Check routing configuration

### ✅ Solution 5: Verify Build Output

1. In Vercel Dashboard → **Deployments** → Click deployment
2. Check **Build Output** section
3. Verify `dist` folder contains:
   - `index.html`
   - `assets/` folder with JS/CSS files

### ✅ Solution 6: Test API Routes

Check if API routes are working:

```
https://your-project.vercel.app/api/health
```

Should return: `{"status":"ok","message":"Little Loom API is running!"}`

If not working:
- Check serverless function logs in Vercel
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set
- Check function code in `api/` folder

### ✅ Solution 7: Clear Cache and Redeploy

1. In Vercel Dashboard → **Deployments**
2. Click **⋯** (three dots) → **Redeploy**
3. Or push a new commit to trigger redeploy

### ✅ Solution 8: Check Base Path

If your app is deployed to a subdirectory, update `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/your-subdirectory/',
  // ... rest of config
});
```

## Common Issues and Fixes

### Issue: "Cannot GET /dashboard"

**Fix:** Add the SPA rewrite rule in `vercel.json` (already done ✅)

### Issue: Environment variables not working

**Fix:** 
- Ensure variables start with `VITE_` for frontend
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

### Issue: API routes return 404

**Fix:**
- Verify `api/` folder structure matches routes
- Check function exports are correct
- Verify environment variables are set

### Issue: Build fails

**Fix:**
- Check Node.js version (Vercel uses 18.x by default)
- Verify all dependencies in `package.json`
- Check for TypeScript errors
- Review build logs for specific errors

## Quick Checklist

- [ ] Environment variables added in Vercel
- [ ] Variables start with `VITE_` for frontend
- [ ] `vercel.json` has SPA rewrite rule
- [ ] Build completes successfully
- [ ] No errors in browser console
- [ ] API routes accessible (`/api/health`)
- [ ] Supabase connection working

## Still Not Working?

1. **Check Vercel Function Logs:**
   - Dashboard → **Functions** tab
   - Click on a function → View logs

2. **Test Locally:**
   ```bash
   npm run build
   npm run preview
   ```
   Visit `http://localhost:4173` and check if it works

3. **Compare with Working Deployment:**
   - Check if other Vite/React apps deploy successfully
   - Compare `vercel.json` configurations

4. **Contact Support:**
   - Vercel Support: https://vercel.com/support
   - Check Vercel Status: https://www.vercel-status.com

## Debugging Commands

```bash
# Test build locally
npm run build

# Preview production build
npm run preview

# Check environment variables (local)
echo $VITE_SUPABASE_URL

# Test API routes locally (if running server)
curl http://localhost:3001/api/health
```

