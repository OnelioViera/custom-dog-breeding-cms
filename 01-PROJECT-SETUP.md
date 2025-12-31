# 01 - Project Setup

## Objective
Set up the Next.js project with all necessary dependencies and basic configuration.

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git (optional)
- Code editor (Cursor/VS Code)

## Step 1: Create Next.js Project

```bash
npx create-next-app@latest ojv-cms
```

When prompted, select:
- ✅ TypeScript: **Yes**
- ✅ ESLint: **Yes**
- ✅ Tailwind CSS: **Yes**
- ✅ `src/` directory: **No**
- ✅ App Router: **Yes**
- ✅ Import alias: **Yes** (@/*)

## Step 2: Install Core Dependencies

```bash
cd ojv-cms

# Database
npm install mongoose mongodb

# Authentication
npm install next-auth@beta
npm install bcryptjs
npm install -D @types/bcryptjs

# UI Components (Shadcn)
npx shadcn-ui@latest init
```

When initializing Shadcn, choose:
- Style: **Default**
- Base color: **Slate**
- CSS variables: **Yes**

## Step 3: Install Additional Dependencies

```bash
# Email
npm install resend

# Form handling and validation
npm install react-hook-form zod @hookform/resolvers

# Drag and drop
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# Date handling
npm install date-fns

# Icons
npm install lucide-react

# Image upload
npm install @uploadthing/react uploadthing

# Rich text editor
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
```

## Step 4: Install Shadcn Components

```bash
# Install needed Shadcn components
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
```

## Step 5: Project Structure

Create the following folder structure:

```bash
mkdir -p app/\(public\)/\[slug\]
mkdir -p app/admin/{pages,blocks,themes,seo,email,users,backups}
mkdir -p app/api/{auth,pages,blocks,email,backups}
mkdir -p components/{blocks,editor,preview,ui}
mkdir -p lib/{db,cms,email,storage}
mkdir -p public/themes
```

## Step 6: Environment Variables

Create `.env.local` file in the root:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/ojv-cms
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ojv-cms

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here-generate-with-openssl

# Email (Resend)
RESEND_API_KEY=re_your_resend_api_key

# Storage (Cloudflare R2 or AWS S3)
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=ojv-cms-uploads

# Optional: UploadThing (alternative to R2)
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_app_id
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

## Step 7: Update Tailwind Config

Update `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#667eea",
          foreground: "#ffffff",
          50: "#f0f0ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#667eea",
          600: "#5a67d8",
          700: "#4c51bf",
          800: "#434190",
          900: "#3c366b",
        },
        secondary: {
          DEFAULT: "#764ba2",
          foreground: "#ffffff",
        },
        success: {
          DEFAULT: "#10b981",
          foreground: "#ffffff",
        },
        warning: {
          DEFAULT: "#f59e0b",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

## Step 8: Update Global Styles

Update `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 250 84% 71%;
    --primary-foreground: 0 0% 100%;
    --secondary: 280 57% 46%;
    --secondary-foreground: 0 0% 100%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 250 84% 71%;
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

## Step 9: Create Basic Layout

Create `app/layout.tsx`:

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OJV Web Design CMS",
  description: "Custom CMS for dog breeding businesses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

## Step 10: Create Welcome Page

Create `app/page.tsx`:

```typescript
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-primary to-secondary">
      <div className="text-center text-white space-y-6">
        <div className="text-6xl font-bold mb-4">OJV</div>
        <h1 className="text-4xl font-bold">Web Design CMS</h1>
        <p className="text-xl opacity-90">
          Custom Content Management for Dog Breeding Businesses
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Link href="/admin">
            <Button size="lg" variant="secondary">
              Go to Dashboard →
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
```

## Step 11: Test the Setup

```bash
npm run dev
```

Visit `http://localhost:3000` to see the welcome page.

## Step 12: Git Setup (Optional)

```bash
git init
git add .
git commit -m "Initial project setup"
```

Create `.gitignore` (should already exist):
```
node_modules/
.next/
.env.local
.env*.local
.DS_Store
```

## Verification Checklist

- [ ] Next.js app runs without errors
- [ ] Tailwind CSS is working
- [ ] Shadcn components are installed
- [ ] Environment variables file created
- [ ] Folder structure matches documentation
- [ ] Welcome page displays correctly
- [ ] No console errors in browser

## Troubleshooting

**Issue: Module not found errors**
- Run `npm install` again
- Clear `.next` folder: `rm -rf .next`
- Restart dev server

**Issue: Shadcn components not found**
- Ensure `components.json` exists
- Re-run: `npx shadcn-ui@latest init`

**Issue: Tailwind styles not applying**
- Check `tailwind.config.ts` paths
- Verify `globals.css` imports
- Clear browser cache

## Next Steps

Once setup is complete, proceed to:
→ **[02-DATABASE-SETUP.md](./02-DATABASE-SETUP.md)**

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Shadcn/ui Setup](https://ui.shadcn.com/docs/installation/next)
- [Tailwind CSS Setup](https://tailwindcss.com/docs/guides/nextjs)
