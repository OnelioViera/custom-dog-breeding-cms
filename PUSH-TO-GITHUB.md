# Push to GitHub - Instructions

## Step 1: Create a GitHub Repository

1. Go to https://github.com/new
2. Repository name: `custom-cms` (or your preferred name)
3. Description: "Custom CMS for dog breeding businesses"
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click **Create repository**

## Step 2: Add Remote and Push

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add the remote (replace YOUR_USERNAME and REPO_NAME with your actual values)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Or if you prefer SSH:
git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Alternative: Quick Setup Script

If you want, I can help you run these commands once you provide:
- Your GitHub username
- Your repository name

## Note: Update Git Identity (Optional)

If you want to use your actual email/name for commits:

```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

Then amend the commit:
```bash
git commit --amend --reset-author --no-edit
```

