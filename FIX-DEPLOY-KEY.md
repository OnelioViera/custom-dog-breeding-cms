# Fix: Deploy Key vs Account SSH Key

## The Problem
Your SSH key was added as a **Deploy key** (repository-specific, read-only) instead of an **Account SSH key** (can push to all your repos).

## Solution: Add as Account SSH Key

### Step 1: Delete the Deploy Key
1. On the page you're viewing, click the **red "Delete" button** next to the "Custom CMS" deploy key
2. Confirm deletion

### Step 2: Add as Account SSH Key
1. Go to your **Account Settings** (not repository settings):
   - Click your profile picture (top right) → **Settings**
   - Or go directly to: https://github.com/settings/keys

2. Click **"New SSH key"** button

3. Fill in:
   - **Title**: "Custom CMS - OptiPlex 5070" (or any name)
   - **Key type**: Authentication Key
   - **Key**: Paste this:
     ```
     ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILXblbVdML/HipVSYmB2R8c3X0iUlUyeIUk4+VpGR64G onelio@github
     ```

4. Click **"Add SSH key"**

### Step 3: Test and Push
After adding, come back and I'll help you push!

