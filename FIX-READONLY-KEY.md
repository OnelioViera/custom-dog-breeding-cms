# Fix: SSH Key Marked as Read-Only

The SSH key is working but marked as read-only. Here's how to fix it:

## Solution 1: Check Key Permissions on GitHub

1. Go to: https://github.com/settings/keys
2. Find your SSH key (the one you just added)
3. Click on it to edit
4. Make sure **"Allow write access"** is checked/enabled
5. Save the changes

## Solution 2: Re-add the Key with Write Access

If the option isn't available:

1. Delete the current key from: https://github.com/settings/keys
2. Add it again, making sure to enable write access
3. Or use a Personal Access Token instead (see below)

## Solution 3: Use Personal Access Token (Alternative)

If SSH continues to have issues:

1. Create a token: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Name: "Custom CMS Push"
   - Select scope: **repo** (full control)
   - Generate and copy the token

2. Change remote back to HTTPS:
   ```bash
   git remote set-url origin https://github.com/OnelioViera/custom-dog-breeding-cms.git
   ```

3. Push (use token as password):
   ```bash
   git push -u origin main
   ```
   - Username: `OnelioViera`
   - Password: **paste your token**

## Quick Check

After fixing, test with:
```bash
git push -u origin main
```

