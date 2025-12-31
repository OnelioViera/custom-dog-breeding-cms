# Add SSH Key to GitHub - Quick Steps

## Your SSH Public Key:
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILXblbVdML/HipVSYmB2R8c3X0iUlUyeIUk4+VpGR64G onelio@github
```

## Steps to Add to GitHub:

1. **Copy the key above** (the entire line starting with `ssh-ed25519`)

2. **Go to GitHub SSH Settings:**
   - Visit: https://github.com/settings/keys
   - Or: GitHub → Settings → SSH and GPG keys → New SSH key

3. **Add the key:**
   - Title: "Custom CMS - OptiPlex 5070" (or any name you prefer)
   - Key type: Authentication Key
   - Key: **Paste the entire key** (starts with `ssh-ed25519`)
   - Click "Add SSH key"

4. **Test the connection:**
   ```bash
   ssh -T git@github.com
   ```
   You should see: "Hi OnelioViera! You've successfully authenticated..."

5. **Push your code:**
   ```bash
   git push -u origin main
   ```

That's it! Once added, you'll never need to enter credentials again.

