# 03 - Authentication

## Objective
Implement authentication using NextAuth.js v5 with role-based access control.

## Prerequisites
- Database setup completed (Step 02)
- Admin user seeded in database

## Step 1: Install NextAuth Dependencies

```bash
npm install next-auth@beta @auth/mongodb-adapter
```

## Step 2: Create Auth Configuration

Create `lib/auth/auth.config.ts`:

```typescript
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      
      if (isOnAdmin) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      }
      
      return true;
    },
  },
  providers: [], // Added in auth.ts
} satisfies NextAuthConfig;
```

## Step 3: Create Main Auth File

Create `lib/auth/auth.ts`:

```typescript
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import bcrypt from "bcryptjs";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;

        await connectDB();
        const user = await User.findOne({ email }).lean();

        if (!user) {
          console.log("User not found");
          return null;
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
          console.log("Invalid password");
          return null;
        }

        // Return user object (without password)
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.avatar = user.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.avatar = token.avatar as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
```

## Step 4: Update NextAuth Types

Create `types/next-auth.d.ts`:

```typescript
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "admin" | "editor" | "viewer";
      avatar?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "admin" | "editor" | "viewer";
    avatar?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "admin" | "editor" | "viewer";
    avatar?: string;
  }
}
```

## Step 5: Create Auth API Route

Create `app/api/auth/[...nextauth]/route.ts`:

```typescript
export { GET, POST } from "@/lib/auth/auth";
```

## Step 6: Create Middleware

Create `middleware.ts` in root:

```typescript
import { auth } from "@/lib/auth/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnAdmin = req.nextUrl.pathname.startsWith("/admin");
  const isOnLogin = req.nextUrl.pathname.startsWith("/admin/login");

  // Allow access to login page
  if (isOnLogin) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  // Protect admin routes
  if (isOnAdmin && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

## Step 7: Create Login Page

Create `app/admin/login/page.tsx`:

```typescript
import { LoginForm } from "@/components/auth/login-form";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block bg-white rounded-2xl p-4 mb-4">
            <div className="text-4xl font-bold text-primary">OJV</div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-white/80">
            Sign in to access your CMS dashboard
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
```

## Step 8: Create Login Form Component

Create `components/auth/login-form.tsx`:

```typescript
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-2xl">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@ojvwebdesign.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>Default credentials:</p>
          <p className="font-mono text-xs mt-1">
            admin@ojvwebdesign.com / admin123
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
```

## Step 9: Create Auth Utilities

Create `lib/auth/permissions.ts`:

```typescript
import { auth } from "./auth";
import { redirect } from "next/navigation";

export type Role = "admin" | "editor" | "viewer";

export const PERMISSIONS = {
  admin: {
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canPublish: true,
    canManageUsers: true,
    canManageSettings: true,
    canManageBackups: true,
  },
  editor: {
    canCreate: true,
    canEdit: true,
    canDelete: false,
    canPublish: false,
    canManageUsers: false,
    canManageSettings: false,
    canManageBackups: false,
  },
  viewer: {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canPublish: false,
    canManageUsers: false,
    canManageSettings: false,
    canManageBackups: false,
  },
};

export async function requireAuth() {
  const session = await auth();
  
  if (!session) {
    redirect("/admin/login");
  }
  
  return session;
}

export async function requireRole(allowedRoles: Role[]) {
  const session = await requireAuth();
  
  if (!allowedRoles.includes(session.user.role as Role)) {
    redirect("/admin");
  }
  
  return session;
}

export function hasPermission(role: Role, permission: keyof typeof PERMISSIONS.admin): boolean {
  return PERMISSIONS[role][permission] ?? false;
}
```

## Step 10: Create Session Provider

Create `components/providers/session-provider.tsx`:

```typescript
"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
```

Update `app/layout.tsx`:

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";

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
      <body className={inter.className}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
```

## Step 11: Create Protected Admin Layout

Create `app/admin/layout.tsx`:

```typescript
import { requireAuth } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();

  if (!session) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
```

## Step 12: Create Admin Dashboard

Create `app/admin/page.tsx`:

```typescript
import { auth } from "@/lib/auth/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome, {session?.user.name}!</h1>
          <p className="text-muted-foreground">
            Role: <span className="font-semibold capitalize">{session?.user.role}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📄 Pages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Manage your website pages
              </p>
              <Link href="/admin/pages">
                <Button>Manage Pages</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🧩 Blocks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Customize your block library
              </p>
              <Link href="/admin/blocks">
                <Button>View Blocks</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎨 Themes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Choose and customize themes
              </p>
              <Link href="/admin/themes">
                <Button>Manage Themes</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <form action={async () => {
            "use server";
            const { signOut } = await import("@/lib/auth/auth");
            await signOut();
          }}>
            <Button variant="outline" type="submit">
              Sign Out
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
```

## Verification Checklist

- [ ] NextAuth installed and configured
- [ ] Login page accessible at `/admin/login`
- [ ] Can login with seeded credentials
- [ ] Middleware protects admin routes
- [ ] Session persists after login
- [ ] Sign out functionality works
- [ ] Role information available in session

## Testing Authentication

1. Start dev server: `npm run dev`
2. Go to `http://localhost:3000/admin`
3. Should redirect to `/admin/login`
4. Login with:
   - Email: `admin@ojvwebdesign.com`
   - Password: `admin123`
5. Should redirect to `/admin` dashboard
6. Verify name and role display correctly
7. Test sign out button

## Troubleshooting

**Issue: Login doesn't work**
- Check database is seeded
- Verify NEXTAUTH_SECRET is set
- Check browser console for errors

**Issue: Redirect loop**
- Clear cookies
- Check middleware matcher pattern
- Verify auth configuration

**Issue: Session not persisting**
- Check NEXTAUTH_SECRET is set
- Verify cookie settings
- Check browser privacy settings

## Next Steps

Once authentication is working, proceed to:
→ **[04-BASIC-CMS-STRUCTURE.md](./04-BASIC-CMS-STRUCTURE.md)**

## Resources

- [NextAuth.js v5 Documentation](https://authjs.dev/)
- [NextAuth with App Router](https://next-auth.js.org/configuration/nextjs#in-app-directory)
- [JWT vs Session Strategy](https://next-auth.js.org/configuration/options#session)
