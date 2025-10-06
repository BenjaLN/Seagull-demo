# Deployment Checklist for Vercel

This document provides a step-by-step guide for deploying your Rungsted Havn Admin Dashboard to Vercel.

## ✅ Pre-Deployment Checklist

### 1. Code Quality
- [x] TypeScript compilation passes (`npm run build`)
- [x] No security vulnerabilities (`npm audit`)
- [x] All dependencies are up to date
- [x] Next.js version updated to 14.2.33 (security patches)

### 2. Configuration Files
- [x] `.gitignore` - Properly configured to exclude sensitive files
- [x] `next.config.js` - Optimized for production
- [x] `vercel.json` - Vercel-specific configuration added
- [x] `env.example` - Environment variables documented
- [x] `tsconfig.json` - TypeScript configuration optimized

### 3. Environment Variables
The following environment variables must be set in Vercel:

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (keep secret!)
- `HARBOR_SLUG` - Harbor identifier (e.g., `rungsted-havn`)

**Optional:**
- `USE_MOCK` - Set to `false` for production (uses real database)

## 🚀 Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**
   - In the Vercel dashboard, go to "Settings" → "Environment Variables"
   - Add all required environment variables (see list above)
   - Make sure to set `USE_MOCK=false` for production

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts to:
   - Link to an existing project or create new one
   - Confirm project settings
   - Deploy

4. **Set Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   vercel env add HARBOR_SLUG
   vercel env add USE_MOCK
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## 🔧 Post-Deployment Configuration

### 1. Custom Domain (Optional)
1. Go to your project in Vercel
2. Navigate to "Settings" → "Domains"
3. Add your custom domain
4. Configure DNS records as instructed by Vercel

### 2. Database Setup
1. Ensure your Supabase database is set up with the schema from `README.md`
2. Test the connection by accessing your deployed app
3. Verify that bookings and spots are loading correctly

### 3. Monitoring
- Check the "Deployments" tab in Vercel for build logs
- Monitor the "Analytics" tab for performance metrics
- Set up alerts in "Settings" → "Notifications"

## 🧪 Testing Production Deployment

After deployment, test these critical features:

1. **View Dashboard**
   - Navigate to `/admin/rungsted-havn`
   - Verify KPI cards are loading
   - Check that spots table displays correctly

2. **Interactive Map**
   - Confirm map renders with markers
   - Test marker click interactions
   - Verify popup information displays

3. **Booking Management**
   - Test creating a new booking
   - Verify booking appears in list
   - Test check-in/check-out functionality

4. **Status Changes**
   - Test changing spot status
   - Verify status updates reflect in UI
   - Check that expected return times work

## 📊 Build Optimization

Your current build size:
- Main page: ~96 KB
- Admin dashboard: ~182 KB
- Total First Load JS: ~87 KB

These are good sizes for a production application.

## 🔒 Security Notes

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Protect service role key** - Only add it in Vercel environment variables
3. **Use environment-specific variables** - Set `USE_MOCK=false` in production
4. **Enable Vercel Authentication** - Consider adding Vercel Authentication for admin pages
5. **CORS Configuration** - Ensure Supabase CORS settings allow your Vercel domain

## 🐛 Troubleshooting

### Build Fails
- Check Vercel build logs in the dashboard
- Verify all environment variables are set correctly
- Ensure package.json has all required dependencies

### Environment Variables Not Working
- Variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Server-side variables (like `SUPABASE_SERVICE_ROLE_KEY`) are only available in API routes
- Redeploy after adding new environment variables

### Database Connection Issues
- Verify Supabase URL and keys are correct
- Check that Supabase allows connections from Vercel IPs
- Ensure RLS (Row Level Security) policies are configured

### Map Not Loading
- Verify OpenStreetMap tiles are accessible
- Check browser console for CORS errors
- Ensure Leaflet CSS is properly loaded

## 📞 Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)

## ✨ Success Criteria

Your deployment is successful when:
- ✅ Build completes without errors
- ✅ Application loads at your Vercel URL
- ✅ Admin dashboard is accessible
- ✅ Map displays correctly with markers
- ✅ Bookings can be created and managed
- ✅ Spot status can be changed
- ✅ No console errors in browser
- ✅ All environment variables are configured

---

**Last Updated**: October 2025  
**Next.js Version**: 14.2.33  
**Deployment Platform**: Vercel
