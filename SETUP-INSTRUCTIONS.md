# Setup Instructions

## Prerequisites

Before you can run this project, you need to install Node.js and npm.

### Install Node.js (if not already installed)

**On Ubuntu/Debian:**
```bash
# Using NodeSource repository (recommended for latest LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

**Or using nvm (Node Version Manager):**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
```

## Installation Steps

Once Node.js is installed, run:

```bash
# Install all dependencies
npm install

# Initialize Shadcn/ui (this will prompt for configuration)
npx shadcn-ui@latest init

# When prompted, choose:
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes

# Install Shadcn components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add select
npx shadcn-ui@latest add label
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add skeleton

# Create .env.local file from example
cp .env.example .env.local

# Generate NEXTAUTH_SECRET (optional, but recommended)
openssl rand -base64 32

# Update .env.local with your MongoDB URI and other credentials
```

## Next Steps

After installation is complete:

1. **Set up MongoDB** - Follow `02-DATABASE-SETUP.md`
2. **Configure Authentication** - Follow `03-AUTHENTICATION.md`
3. **Start Development Server:**
   ```bash
   npm run dev
   ```

## Troubleshooting

- If you get "module not found" errors, make sure you've run `npm install`
- If Shadcn components aren't working, verify `components.json` exists and run `npx shadcn-ui@latest init` again
- TypeScript errors about missing types will resolve after `npm install`

