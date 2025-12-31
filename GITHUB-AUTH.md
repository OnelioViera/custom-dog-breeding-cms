# GitHub Authentication for Push

The push failed because GitHub requires authentication. Here are your options:

## Option 1: Personal Access Token (Recommended)

1. **Create a Personal Access Token:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Name it: "Custom CMS Push"
   - Select scopes: **repo** (full control of private repositories)
   - Click "Generate token"
   - **Copy the token immediately** (you won't see it again!)

2. **Push using the token:**
   ```bash
   git push -u origin main
   ```
   When prompted:
   - Username: `OnelioViera`
   - Password: **Paste your token** (not your GitHub password)

## Option 2: SSH Key (More Secure)

1. **Generate SSH key (if you don't have one):**
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   # Press Enter to accept default location
   # Press Enter twice for no passphrase (or set one)
   ```

2. **Add SSH key to GitHub:**
   ```bash
   cat ~/.ssh/id_ed25519.pub
   # Copy the output
   ```
   - Go to: https://github.com/settings/keys
   - Click "New SSH key"
   - Paste the key and save

3. **Change remote to SSH:**
   ```bash
   git remote set-url origin git@github.com:OnelioViera/custom-dog-breeding-cms.git
   git push -u origin main
   ```

## Option 3: GitHub CLI

If you have GitHub CLI installed:
```bash
gh auth login
git push -u origin main
```

## Quick Test

After setting up authentication, verify:
```bash
git remote -v
git push -u origin main
```

