# Fix: Cursor Not Detecting Git

Git is installed on your system, but Cursor isn't finding it. Here's how to fix it:

## Solution 1: Restart Cursor (Easiest)
1. Close Cursor completely
2. Reopen Cursor
3. Open your project folder again
4. Cursor should now detect Git

## Solution 2: Configure Git Path in Cursor
1. Open Cursor Settings:
   - Press `Ctrl+,` (or `Cmd+,` on Mac)
   - Or: File → Preferences → Settings

2. Search for: `git.path`

3. Set the Git path:
   - Add this setting:
     ```json
     "git.path": "/usr/bin/git"
     ```

4. Reload Cursor or restart it

## Solution 3: Check Cursor's Terminal PATH
1. Open Cursor's integrated terminal
2. Run: `which git`
3. If it shows `/usr/bin/git`, Git is available
4. Try reloading the Source Control panel (click the refresh icon)

## Solution 4: Manual Git Path Configuration
If the above doesn't work:

1. Open Cursor Settings (JSON):
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P`)
   - Type: "Preferences: Open User Settings (JSON)"
   - Add:
     ```json
     {
       "git.path": "/usr/bin/git",
       "git.enabled": true
     }
     ```

2. Reload Cursor

## Verify It's Working
After fixing, you should see:
- Source Control panel shows your changes
- Git status indicators in the file explorer
- Ability to commit/push from Cursor's UI

## Note
Since Git is working in your terminal (we successfully pushed to GitHub), this is just a Cursor detection issue. The terminal commands will continue to work regardless.


