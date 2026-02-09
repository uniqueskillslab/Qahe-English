# Deployment Guide for QAHE English - IELTS Speaking Practice Platform

## 🚀 Quick Deploy to Vercel

### Method 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/uniqueskillslab/Qahe-English)

### Method 2: Manual Deployment

#### Prerequisites
- GitHub account with this repository
- Vercel account ([sign up free](https://vercel.com))
- GitHub Personal Access Token for AI features

#### Step-by-Step Deployment

1. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import from GitHub: `uniqueskillslab/Qahe-English`

2. **Environment Variables Setup**
   In Vercel dashboard, add these environment variables:
   ```
   GITHUB_TOKEN=your_github_personal_access_token
   ```
   
   **How to get GitHub Token:**
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Give it a name like "QAHE-English-App"
   - No special permissions needed for GitHub Models access
   - Copy the generated token

3. **Deploy Configuration**
   - Framework Preset: Next.js
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `npm install` (auto-detected)

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Your app will be live at: `https://your-project-name.vercel.app`

## 🔧 Advanced Configuration

### Custom Domain
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS settings as instructed

### Performance Optimization
- **Function Regions**: Set to your target audience region
- **Edge Functions**: Automatically optimized for global performance
- **Image Optimization**: Built-in with Next.js

### Environment Variables for Production
```env
# Required
GITHUB_TOKEN=your_token

# Optional Production Settings
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

## 📊 Monitoring & Analytics

### Vercel Analytics
- Add `@vercel/analytics` package for visitor insights
- Enable in Vercel dashboard → Analytics

### Performance Monitoring
- Vercel Speed Insights automatically enabled
- Core Web Vitals tracking included

## 🛡️ Security Considerations

### API Security
- All API routes have CORS properly configured
- Rate limiting handled by Vercel's edge network
- Environment variables secure by default

### Content Security
- Security headers configured in `next.config.ts`
- No sensitive data exposed to client-side

## 🔄 Continuous Deployment

### Automatic Deployments
- **Production**: Pushes to `main` branch auto-deploy
- **Preview**: Pull requests create preview deployments
- **Development**: Local development with hot reload

### Branch Strategy
```
main (production)     → https://qahe-english.vercel.app
develop (staging)     → https://qahe-english-git-develop.vercel.app
feature/* (preview)   → https://qahe-english-git-feature-*.vercel.app
```

## 🐛 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check all dependencies are in `package.json`
   - Verify TypeScript compilation: `npm run type-check`

2. **Environment Variables**
   - Ensure `GITHUB_TOKEN` is set in Vercel dashboard
   - Token should have no expiration or very long expiration

3. **Function Timeouts**
   - Configured for 30s max (Vercel Pro needed for longer)
   - Speech analysis optimized for quick responses

4. **Audio Issues**
   - HTTPS required for microphone access
   - Vercel provides HTTPS by default

### Performance Optimization
- Images automatically optimized by Next.js
- API responses cached appropriately
- Static assets served from Vercel Edge Network

## 🌐 Production Checklist

- [ ] Environment variables configured
- [ ] Custom domain set up (optional)
- [ ] Analytics enabled
- [ ] Security headers verified
- [ ] Performance testing completed
- [ ] Error monitoring configured
- [ ] Backup/rollback strategy in place

## 📈 Scaling Considerations

### Vercel Limits (Hobby Plan)
- **Functions**: 10s execution time, 100GB-hours
- **Bandwidth**: 100GB/month
- **Domains**: 1 custom domain

### Upgrade to Pro for:
- 60s function execution time
- 1000GB bandwidth
- Unlimited custom domains
- Password protection for previews

## 🔗 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [GitHub Models API Docs](https://docs.github.com/en/rest)
- [Project Repository](https://github.com/uniqueskillslab/Qahe-English)