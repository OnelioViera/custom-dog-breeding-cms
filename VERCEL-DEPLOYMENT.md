# Vercel Deployment Guide

## Environment Variables to Set in Vercel

You need to add these environment variables in your Vercel project settings. **Do NOT commit `.env.local` to Git** - it's already in `.gitignore`.

### Required Variables (Minimum)

These are **required** for the app to work:

1. **`MONGODB_URI`**
   - Your MongoDB connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/dog-breeding-cms`
   - ⚠️ **Important**: Make sure your MongoDB Atlas allows connections from Vercel's IPs (or use `0.0.0.0/0` for all IPs in Network Access)

2. **`NEXTAUTH_SECRET`**
   - A random secret key for NextAuth.js
   - Generate one with: `openssl rand -base64 32`
   - Or use an online generator: https://generate-secret.vercel.app/32
   - ⚠️ **Keep this secret!** Never commit it to Git

3. **`NEXTAUTH_URL`**
   - Your production URL
   - Example: `https://your-app-name.vercel.app`
   - ⚠️ **Update this** after deployment with your actual Vercel URL

### Optional Variables (For Full Features)

These are needed for email and file storage features:

4. **`RESEND_API_KEY`** (for email functionality)
   - Get from: https://resend.com/api-keys
   - Format: `re_xxxxxxxxxxxxx`

5. **`FROM_EMAIL`** (optional, for email sending)
   - Your verified sender email in Resend
   - Example: `noreply@yourdomain.com`

6. **`R2_ACCOUNT_ID`** (for file storage - Cloudflare R2)
   - Your Cloudflare account ID

7. **`R2_ACCESS_KEY_ID`** (for file storage)
   - R2 access key ID

8. **`R2_SECRET_ACCESS_KEY`** (for file storage)
   - R2 secret access key

9. **`R2_BUCKET_NAME`** (for file storage)
   - Your R2 bucket name
   - Example: `ojv-cms-uploads`

## How to Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   - **Name**: The variable name (e.g., `MONGODB_URI`)
   - **Value**: The actual value
   - **Environment**: Select which environments (Production, Preview, Development)
4. Click **Save**

## Step-by-Step Deployment

### 1. Push Your Code to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Import Project to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings

### 3. Add Environment Variables

Before deploying, add the **required** variables:
- `MONGODB_URI`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (set to `https://your-project-name.vercel.app` - you can update this after first deployment)

### 4. Deploy

1. Click **Deploy**
2. Wait for build to complete
3. Copy your deployment URL

### 5. Update NEXTAUTH_URL

After first deployment:
1. Go to **Settings** → **Environment Variables**
2. Update `NEXTAUTH_URL` with your actual deployment URL
3. Redeploy (or it will auto-redeploy on next push)

## Important Notes

### MongoDB Atlas Network Access

Make sure your MongoDB Atlas allows connections from Vercel:
1. Go to MongoDB Atlas → **Network Access**
2. Click **Add IP Address**
3. Add `0.0.0.0/0` (allows all IPs) OR add Vercel's IP ranges
4. Save

### Database Seeding

After deployment, you may need to seed your database:
1. Run the seed script locally pointing to your production MongoDB:
   ```bash
   MONGODB_URI=your_production_mongodb_uri npm run db:seed
   ```
2. Or create a Vercel serverless function to handle seeding

### Testing After Deployment

1. Visit your Vercel URL
2. Go to `/admin/login`
3. Login with default credentials:
   - Email: `admin@ojvwebdesign.com`
   - Password: `admin123`
4. ⚠️ **Change the default password** after first login!

## Troubleshooting

### "MongoServerError: Invalid namespace"
- Check your `MONGODB_URI` - database name should not have spaces
- Use hyphens: `dog-breeding-cms` not `dog breeding cms`

### "NEXTAUTH_URL mismatch"
- Make sure `NEXTAUTH_URL` matches your actual Vercel deployment URL exactly
- Include `https://` protocol
- No trailing slash

### Build Errors
- Check Vercel build logs
- Make sure all environment variables are set
- Verify Node.js version (Vercel auto-detects, but you can set it in `package.json`)

## Security Checklist

- ✅ `.env.local` is in `.gitignore` (already done)
- ✅ Never commit secrets to Git
- ✅ Use strong `NEXTAUTH_SECRET`
- ✅ Change default admin password after deployment
- ✅ Restrict MongoDB network access if possible
- ✅ Use environment-specific variables in Vercel

