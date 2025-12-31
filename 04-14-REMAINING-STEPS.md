# 04-14 - Remaining Implementation Steps

This document provides an overview and key implementation details for steps 4-14. Each section includes the essential code and architecture you'll need.

---

## 04 - Basic CMS Structure

### Create Admin Sidebar Component

`components/admin/sidebar.tsx`:
```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  FileText,
  Blocks,
  Palette,
  Search,
  Mail,
  Users,
  HardDrive,
  Settings,
} from "lucide-react";

const navItems = [
  { icon: FileText, label: "Pages", href: "/admin/pages" },
  { icon: Blocks, label: "Blocks", href: "/admin/blocks" },
  { icon: Palette, label: "Themes", href: "/admin/themes" },
  { icon: Search, label: "SEO", href: "/admin/seo" },
  { icon: Mail, label: "Email", href: "/admin/email" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: HardDrive, label: "Backups", href: "/admin/backups" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
            OJV
          </div>
          <div>
            <div className="font-bold">OJV CMS</div>
            <div className="text-xs text-muted-foreground">Admin Panel</div>
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
              pathname === item.href
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
```

### Create Admin Header

`components/admin/header.tsx`:
```typescript
"use client";

import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">{/* Dynamic based on route */}</h1>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback>
                {session?.user.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <div className="text-sm font-medium">{session?.user.name}</div>
              <div className="text-xs text-muted-foreground capitalize">
                {session?.user.role}
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
```

### Update Admin Layout

Update `app/admin/layout.tsx`:
```typescript
import { requireAuth } from "@/lib/auth/permissions";
import { Sidebar } from "@/components/admin/sidebar";
import { Header } from "@/components/admin/header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

---

## 05 - Page Editor

### Page List Component

`app/admin/pages/page.tsx`:
```typescript
import { auth } from "@/lib/auth/auth";
import connectDB from "@/lib/db/mongodb";
import Page from "@/lib/db/models/Page";
import { PageList } from "@/components/admin/page-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function PagesPage() {
  await connectDB();
  const session = await auth();
  
  const pages = await Page.find()
    .sort({ updatedAt: -1 })
    .populate("lastEditedBy", "name")
    .lean();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pages</h1>
        <Link href="/admin/pages/new">
          <Button>+ New Page</Button>
        </Link>
      </div>
      <PageList pages={JSON.parse(JSON.stringify(pages))} />
    </div>
  );
}
```

### Page Editor Component

`app/admin/pages/[id]/page.tsx`:
```typescript
import { auth } from "@/lib/auth/auth";
import connectDB from "@/lib/db/mongodb";
import Page from "@/lib/db/models/Page";
import { PageEditor } from "@/components/editor/page-editor";
import { notFound } from "next/navigation";

export default async function EditPagePage({
  params,
}: {
  params: { id: string };
}) {
  await connectDB();
  const session = await auth();

  const page = await Page.findById(params.id).lean();

  if (!page) {
    notFound();
  }

  return <PageEditor page={JSON.parse(JSON.stringify(page))} />;
}
```

### Editor Component

`components/editor/page-editor.tsx`:
```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlockEditor } from "./block-editor";
import { SEOEditor } from "./seo-editor";
import { LivePreview } from "./live-preview";
import { toast } from "@/components/ui/use-toast";

export function PageEditor({ page }: { page: any }) {
  const router = useRouter();
  const [pageData, setPageData] = useState(page);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (status: "draft" | "published") => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/pages/${page._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...pageData, status }),
      });

      if (response.ok) {
        toast({
          title: status === "draft" ? "Draft saved" : "Page published",
          description: "Your changes have been saved successfully.",
        });
        router.refresh();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6 h-full">
      {/* Editor Panel */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Edit Page</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleSave("draft")}
              disabled={isSaving}
            >
              Save Draft
            </Button>
            <Button onClick={() => handleSave("published")} disabled={isSaving}>
              Publish
            </Button>
          </div>
        </div>

        <Tabs defaultValue="content">
          <TabsList>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <div className="space-y-4">
              <div>
                <Label>Page Title</Label>
                <Input
                  value={pageData.title}
                  onChange={(e) =>
                    setPageData({ ...pageData, title: e.target.value })
                  }
                />
              </div>
              <BlockEditor
                blocks={pageData.blocks}
                onChange={(blocks) => setPageData({ ...pageData, blocks })}
              />
            </div>
          </TabsContent>

          <TabsContent value="seo">
            <SEOEditor
              seo={pageData.seo}
              onChange={(seo) => setPageData({ ...pageData, seo })}
            />
          </TabsContent>

          <TabsContent value="settings">
            {/* Settings content */}
          </TabsContent>
        </Tabs>
      </div>

      {/* Live Preview Panel */}
      <div className="sticky top-0">
        <LivePreview pageData={pageData} />
      </div>
    </div>
  );
}
```

---

## 06 - Block System

### Drag and Drop Block Editor

`components/editor/block-editor.tsx`:
```typescript
"use client";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableBlock } from "./sortable-block";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function BlockEditor({ blocks, onChange }: any) {
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = blocks.findIndex((b: any) => b.id === active.id);
      const newIndex = blocks.findIndex((b: any) => b.id === over.id);
      onChange(arrayMove(blocks, oldIndex, newIndex));
    }
  };

  const addBlock = (type: string) => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type,
      order: blocks.length,
      content: {},
    };
    onChange([...blocks, newBlock]);
  };

  return (
    <div className="space-y-4">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={blocks.map((b: any) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          {blocks.map((block: any) => (
            <SortableBlock
              key={block.id}
              block={block}
              onChange={(updatedBlock) => {
                onChange(
                  blocks.map((b: any) =>
                    b.id === block.id ? updatedBlock : b
                  )
                );
              }}
              onDelete={() => {
                onChange(blocks.filter((b: any) => b.id !== block.id));
              }}
            />
          ))}
        </SortableContext>
      </DndContext>

      <Button onClick={() => addBlock("text-content")} variant="outline">
        <Plus className="w-4 h-4 mr-2" />
        Add Block
      </Button>
    </div>
  );
}
```

---

## 07 - Live Preview

### Live Preview Component

`components/editor/live-preview.tsx`:
```typescript
"use client";

import { Card } from "@/components/ui/card";
import { HeroBlock } from "@/components/blocks/hero-block";
import { TextBlock } from "@/components/blocks/text-block";
import { PuppyCardsBlock } from "@/components/blocks/puppy-cards-block";

const blockComponents: Record<string, any> = {
  hero: HeroBlock,
  "text-content": TextBlock,
  "puppy-cards": PuppyCardsBlock,
};

export function LivePreview({ pageData }: { pageData: any }) {
  return (
    <Card className="p-6 h-[calc(100vh-200px)] overflow-y-auto">
      <div className="mb-4 text-sm text-muted-foreground">
        Live Preview
      </div>
      <div className="space-y-6">
        {pageData.blocks?.map((block: any) => {
          const BlockComponent = blockComponents[block.type];
          return BlockComponent ? (
            <BlockComponent key={block.id} content={block.content} />
          ) : null;
        })}
      </div>
    </Card>
  );
}
```

---

## 08 - Dynamic Routing

### Create Dynamic Route Handler

`app/(public)/[slug]/page.tsx`:
```typescript
import connectDB from "@/lib/db/mongodb";
import Page from "@/lib/db/models/Page";
import { notFound } from "next/navigation";
import { PageRenderer } from "@/components/public/page-renderer";

export async function generateStaticParams() {
  await connectDB();
  const pages = await Page.find({ status: "published" }).select("slug").lean();
  return pages.map((page) => ({ slug: page.slug }));
}

export default async function PublicPage({
  params,
}: {
  params: { slug: string };
}) {
  await connectDB();
  const page = await Page.findOne({
    slug: params.slug,
    status: "published",
  }).lean();

  if (!page) {
    notFound();
  }

  return <PageRenderer page={JSON.parse(JSON.stringify(page))} />;
}
```

---

## 09 - SEO Tools

### SEO Editor Component

`components/editor/seo-editor.tsx`:
```typescript
"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SEOEditor({ seo, onChange }: any) {
  const updateSEO = (field: string, value: any) => {
    onChange({ ...seo, [field]: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Meta Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Meta Title (50-60 characters)</Label>
            <Input
              value={seo.metaTitle}
              onChange={(e) => updateSEO("metaTitle", e.target.value)}
              maxLength={70}
            />
            <div className="text-xs text-muted-foreground mt-1">
              {seo.metaTitle?.length || 0}/70 characters
            </div>
          </div>

          <div>
            <Label>Meta Description (150-160 characters)</Label>
            <Textarea
              value={seo.metaDescription}
              onChange={(e) => updateSEO("metaDescription", e.target.value)}
              maxLength={200}
            />
            <div className="text-xs text-muted-foreground mt-1">
              {seo.metaDescription?.length || 0}/200 characters
            </div>
          </div>

          <div>
            <Label>URL Slug</Label>
            <Input
              value={seo.slug}
              onChange={(e) => updateSEO("slug", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Open Graph</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>OG Title</Label>
            <Input
              value={seo.ogTitle}
              onChange={(e) => updateSEO("ogTitle", e.target.value)}
            />
          </div>

          <div>
            <Label>OG Description</Label>
            <Textarea
              value={seo.ogDescription}
              onChange={(e) => updateSEO("ogDescription", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Indexing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Allow search engines to index</Label>
            <Switch
              checked={!seo.noIndex}
              onCheckedChange={(checked) => updateSEO("noIndex", !checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Follow links on this page</Label>
            <Switch
              checked={!seo.noFollow}
              onCheckedChange={(checked) => updateSEO("noFollow", !checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 10 - Email Integration

### Email Service

`lib/email/send-email.ts`:
```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) {
  try {
    const data = await resend.emails.send({
      from: process.env.FROM_EMAIL || "onboarding@resend.dev",
      to,
      subject,
      html,
      replyTo,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error };
  }
}
```

### Contact Form API

`app/api/contact/route.ts`:
```typescript
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/send-email";
import connectDB from "@/lib/db/mongodb";
import Settings from "@/lib/db/models/Settings";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    await connectDB();
    const settings = await Settings.findOne();

    // Send notification to admin
    await sendEmail({
      to: settings.adminEmail,
      subject: "New Contact Form Submission",
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
      replyTo: email,
    });

    // Send auto-response
    await sendEmail({
      to: email,
      subject: "Thank you for contacting us!",
      html: `
        <h2>Thank you for your inquiry!</h2>
        <p>Hi ${name},</p>
        <p>We've received your message and will get back to you within 24 hours.</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}
```

---

## 11 - Permissions

### Permission Check Middleware

`lib/auth/check-permission.ts`:
```typescript
import { auth } from "./auth";
import { hasPermission, Role } from "./permissions";
import { NextResponse } from "next/server";

export async function checkPermission(permission: string) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.user.role as Role, permission as any)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return session;
}
```

### User Management Page

`app/admin/users/page.tsx`:
```typescript
import { requireRole } from "@/lib/auth/permissions";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import { UserList } from "@/components/admin/user-list";

export default async function UsersPage() {
  await requireRole(["admin"]);
  await connectDB();

  const users = await User.find().select("-password").lean();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <UserList users={JSON.parse(JSON.stringify(users))} />
    </div>
  );
}
```

---

## 12 - Backups

### Backup Utility

`lib/backups/create-backup.ts`:
```typescript
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";

const execAsync = promisify(exec);

export async function createBackup() {
  const timestamp = new Date().toISOString().replace(/:/g, "-");
  const filename = `backup-${timestamp}.gz`;
  const backupPath = path.join(process.cwd(), "backups", filename);

  // Ensure backups directory exists
  const backupsDir = path.join(process.cwd(), "backups");
  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir, { recursive: true });
  }

  try {
    // Create mongodump backup
    const mongoUri = process.env.MONGODB_URI;
    await execAsync(
      `mongodump --uri="${mongoUri}" --archive=${backupPath} --gzip`
    );

    const stats = fs.statSync(backupPath);

    return {
      filename,
      path: backupPath,
      size: stats.size,
    };
  } catch (error) {
    console.error("Backup failed:", error);
    throw error;
  }
}
```

### Backup API Route

`app/api/backups/route.ts`:
```typescript
import { NextResponse } from "next/server";
import { checkPermission } from "@/lib/auth/check-permission";
import { createBackup } from "@/lib/backups/create-backup";
import connectDB from "@/lib/db/mongodb";
import Backup from "@/lib/db/models/Backup";

export async function POST() {
  const session = await checkPermission("canManageBackups");
  if (session instanceof NextResponse) return session;

  try {
    const backup = await createBackup();

    await connectDB();
    await Backup.create({
      filename: backup.filename,
      size: backup.size,
      type: "manual",
      storageUrl: backup.path,
      createdBy: session.user.id,
      status: "completed",
    });

    return NextResponse.json({ success: true, backup });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Backup failed" },
      { status: 500 }
    );
  }
}
```

---

## 13 - Themes

### Theme System

`lib/themes/themes.ts`:
```typescript
export const themes = {
  "modern-breeder": {
    name: "Modern Breeder",
    primaryColor: "#667eea",
    secondaryColor: "#764ba2",
    fontFamily: "Inter",
  },
  "classic-elegance": {
    name: "Classic Elegance",
    primaryColor: "#8b7355",
    secondaryColor: "#6b5344",
    fontFamily: "Playfair Display",
  },
  "playful-paws": {
    name: "Playful Paws",
    primaryColor: "#ff6b6b",
    secondaryColor: "#4ecdc4",
    fontFamily: "Poppins",
  },
};
```

---

## 14 - Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - `RESEND_API_KEY`
   - All storage credentials

4. Deploy!

### Post-Deployment

- Run seed script on production
- Test all features
- Set up automated backups
- Configure domain

---

## API Routes Summary

Create these API routes for CRUD operations:

- `app/api/pages/route.ts` - GET (list), POST (create)
- `app/api/pages/[id]/route.ts` - GET, PATCH, DELETE
- `app/api/blocks/route.ts` - GET block templates
- `app/api/users/route.ts` - GET, POST (admin only)
- `app/api/users/[id]/route.ts` - PATCH, DELETE (admin only)
- `app/api/settings/route.ts` - GET, PATCH (admin only)
- `app/api/upload/route.ts` - POST (file upload)

Each should follow this pattern:
1. Check authentication
2. Check permissions
3. Connect to database
4. Perform operation
5. Return response

---

This covers the essential implementation for all remaining steps. Each section provides the core architecture and key components you'll need to build out fully.
