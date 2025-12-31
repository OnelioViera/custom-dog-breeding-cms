# 02 - Database Setup

## Objective
Set up MongoDB connection and create all necessary database schemas/models for the CMS.

## Prerequisites
- MongoDB installed locally OR MongoDB Atlas account
- Project setup completed (Step 01)

## Step 1: MongoDB Setup Options

### Option A: Local MongoDB
```bash
# Install MongoDB (macOS)
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Your connection string:
MONGODB_URI=mongodb://localhost:27017/ojv-cms
```

### Option B: MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create new cluster (M0 Free tier)
4. Add database user (Database Access)
5. Whitelist IP address (Network Access → Add IP → 0.0.0.0/0 for development)
6. Get connection string: Clusters → Connect → Connect your application
7. Update `.env.local` with your connection string

## Step 2: Database Connection Utility

Create `lib/db/mongodb.ts`:

```typescript
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ MongoDB connected successfully");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
```

Create TypeScript declaration `global.d.ts` in root:

```typescript
import mongoose from "mongoose";

declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

export {};
```

## Step 3: User Model

Create `lib/db/models/User.ts`:

```typescript
import mongoose, { Schema, models, Model } from "mongoose";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "editor" | "viewer";
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "editor", "viewer"],
      default: "editor",
    },
    avatar: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
const User: Model<IUser> = models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
```

## Step 4: Page Model

Create `lib/db/models/Page.ts`:

```typescript
import mongoose, { Schema, models, Model } from "mongoose";

export interface IBlock {
  id: string;
  type: string;
  order: number;
  content: Record<string, any>;
}

export interface ISEO {
  metaTitle: string;
  metaDescription: string;
  slug: string;
  focusKeyword?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  noIndex: boolean;
  noFollow: boolean;
}

export interface IPage {
  _id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  blocks: IBlock[];
  seo: ISEO;
  navbarPosition?: number;
  showInNavbar: boolean;
  theme?: string;
  createdBy: mongoose.Types.ObjectId;
  lastEditedBy: mongoose.Types.ObjectId;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlockSchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  order: { type: Number, required: true },
  content: { type: Schema.Types.Mixed, default: {} },
});

const SEOSchema = new Schema({
  metaTitle: { type: String, default: "" },
  metaDescription: { type: String, default: "" },
  slug: { type: String, required: true },
  focusKeyword: { type: String, default: "" },
  ogTitle: { type: String, default: "" },
  ogDescription: { type: String, default: "" },
  ogImage: { type: String, default: "" },
  noIndex: { type: Boolean, default: false },
  noFollow: { type: Boolean, default: false },
});

const PageSchema = new Schema<IPage>(
  {
    title: {
      type: String,
      required: [true, "Page title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Page slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    blocks: {
      type: [BlockSchema],
      default: [],
    },
    seo: {
      type: SEOSchema,
      required: true,
    },
    navbarPosition: {
      type: Number,
      default: null,
    },
    showInNavbar: {
      type: Boolean,
      default: true,
    },
    theme: {
      type: String,
      default: "modern-breeder",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastEditedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
PageSchema.index({ slug: 1 });
PageSchema.index({ status: 1 });

const Page: Model<IPage> = models.Page || mongoose.model<IPage>("Page", PageSchema);

export default Page;
```

## Step 5: Block Template Model

Create `lib/db/models/BlockTemplate.ts`:

```typescript
import mongoose, { Schema, models, Model } from "mongoose";

export interface IBlockTemplate {
  _id: string;
  name: string;
  type: string;
  description: string;
  icon: string;
  category: "hero" | "content" | "gallery" | "form" | "testimonial" | "custom";
  defaultContent: Record<string, any>;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlockTemplateSchema = new Schema<IBlockTemplate>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: "📝",
    },
    category: {
      type: String,
      enum: ["hero", "content", "gallery", "form", "testimonial", "custom"],
      required: true,
    },
    defaultContent: {
      type: Schema.Types.Mixed,
      required: true,
    },
    thumbnail: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const BlockTemplate: Model<IBlockTemplate> =
  models.BlockTemplate || mongoose.model<IBlockTemplate>("BlockTemplate", BlockTemplateSchema);

export default BlockTemplate;
```

## Step 6: Email Template Model

Create `lib/db/models/EmailTemplate.ts`:

```typescript
import mongoose, { Schema, models, Model } from "mongoose";

export interface IEmailTemplate {
  _id: string;
  name: string;
  type: "contact" | "inquiry" | "welcome" | "custom";
  subject: string;
  body: string;
  variables: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EmailTemplateSchema = new Schema<IEmailTemplate>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["contact", "inquiry", "welcome", "custom"],
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    variables: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const EmailTemplate: Model<IEmailTemplate> =
  models.EmailTemplate || mongoose.model<IEmailTemplate>("EmailTemplate", EmailTemplateSchema);

export default EmailTemplate;
```

## Step 7: Settings Model

Create `lib/db/models/Settings.ts`:

```typescript
import mongoose, { Schema, models, Model } from "mongoose";

export interface ISettings {
  _id: string;
  siteName: string;
  siteUrl: string;
  adminEmail: string;
  fromEmail: string;
  replyToEmail: string;
  theme: string;
  primaryColor: string;
  secondaryColor: string;
  enableBackups: boolean;
  backupFrequency: "daily" | "weekly" | "monthly";
  backupRetentionDays: number;
  emailProvider: "resend" | "sendgrid" | "mailgun";
  emailApiKey?: string;
  storageProvider: "r2" | "s3" | "uploadthing";
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    siteName: {
      type: String,
      required: true,
      default: "OJV CMS Site",
    },
    siteUrl: {
      type: String,
      required: true,
      default: "http://localhost:3000",
    },
    adminEmail: {
      type: String,
      required: true,
    },
    fromEmail: {
      type: String,
      required: true,
    },
    replyToEmail: {
      type: String,
      required: true,
    },
    theme: {
      type: String,
      default: "modern-breeder",
    },
    primaryColor: {
      type: String,
      default: "#667eea",
    },
    secondaryColor: {
      type: String,
      default: "#764ba2",
    },
    enableBackups: {
      type: Boolean,
      default: true,
    },
    backupFrequency: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      default: "daily",
    },
    backupRetentionDays: {
      type: Number,
      default: 30,
    },
    emailProvider: {
      type: String,
      enum: ["resend", "sendgrid", "mailgun"],
      default: "resend",
    },
    emailApiKey: {
      type: String,
      default: null,
    },
    storageProvider: {
      type: String,
      enum: ["r2", "s3", "uploadthing"],
      default: "r2",
    },
  },
  {
    timestamps: true,
  }
);

const Settings: Model<ISettings> =
  models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);

export default Settings;
```

## Step 8: Backup Model

Create `lib/db/models/Backup.ts`:

```typescript
import mongoose, { Schema, models, Model } from "mongoose";

export interface IBackup {
  _id: string;
  filename: string;
  size: number;
  type: "automatic" | "manual";
  storageUrl: string;
  createdBy?: mongoose.Types.ObjectId;
  status: "completed" | "in-progress" | "failed";
  error?: string;
  createdAt: Date;
}

const BackupSchema = new Schema<IBackup>(
  {
    filename: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["automatic", "manual"],
      required: true,
    },
    storageUrl: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["completed", "in-progress", "failed"],
      default: "completed",
    },
    error: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
BackupSchema.index({ createdAt: -1 });

const Backup: Model<IBackup> = models.Backup || mongoose.model<IBackup>("Backup", BackupSchema);

export default Backup;
```

## Step 9: Create Model Index File

Create `lib/db/models/index.ts`:

```typescript
export { default as User } from "./User";
export { default as Page } from "./Page";
export { default as BlockTemplate } from "./BlockTemplate";
export { default as EmailTemplate } from "./EmailTemplate";
export { default as Settings } from "./Settings";
export { default as Backup } from "./Backup";

export type { IUser } from "./User";
export type { IPage, IBlock, ISEO } from "./Page";
export type { IBlockTemplate } from "./BlockTemplate";
export type { IEmailTemplate } from "./EmailTemplate";
export type { ISettings } from "./Settings";
export type { IBackup } from "./Backup";
```

## Step 10: Database Seeding Script

Create `lib/db/seed.ts`:

```typescript
import connectDB from "./mongodb";
import { User, Settings, BlockTemplate } from "./models";
import bcrypt from "bcryptjs";

async function seed() {
  await connectDB();

  console.log("🌱 Starting database seed...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  const adminUser = await User.findOneAndUpdate(
    { email: "admin@ojvwebdesign.com" },
    {
      name: "Admin User",
      email: "admin@ojvwebdesign.com",
      password: hashedPassword,
      role: "admin",
    },
    { upsert: true, new: true }
  );
  console.log("✅ Admin user created");

  // Create default settings
  await Settings.findOneAndUpdate(
    {},
    {
      siteName: "Pawfect Poodles",
      siteUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      adminEmail: "admin@ojvwebdesign.com",
      fromEmail: "noreply@pawfectpoodles.com",
      replyToEmail: "admin@ojvwebdesign.com",
    },
    { upsert: true, new: true }
  );
  console.log("✅ Settings created");

  // Create block templates
  const blockTemplates = [
    {
      name: "Hero Section",
      type: "hero",
      description: "Full-width header with title and CTA",
      icon: "🎯",
      category: "hero",
      defaultContent: {
        title: "Welcome to Our Site",
        subtitle: "Subtitle goes here",
        description: "Description text",
        buttonText: "Learn More",
        buttonLink: "#",
        backgroundImage: "",
      },
    },
    {
      name: "Text Content",
      type: "text-content",
      description: "Paragraph with heading",
      icon: "📝",
      category: "content",
      defaultContent: {
        heading: "Heading",
        content: "Your content here...",
      },
    },
    {
      name: "Image Gallery",
      type: "gallery",
      description: "Grid of images",
      icon: "🖼️",
      category: "gallery",
      defaultContent: {
        heading: "Gallery",
        images: [],
        columns: 3,
      },
    },
    {
      name: "Puppy Cards",
      type: "puppy-cards",
      description: "Available puppies grid",
      icon: "🐾",
      category: "custom",
      defaultContent: {
        heading: "Available Puppies",
        description: "Meet our adorable puppies!",
        puppies: [],
        columns: 3,
      },
    },
    {
      name: "Contact Form",
      type: "contact-form",
      description: "Lead capture form",
      icon: "📞",
      category: "form",
      defaultContent: {
        heading: "Contact Us",
        description: "Get in touch with us!",
        fields: ["name", "email", "phone", "message"],
      },
    },
  ];

  for (const template of blockTemplates) {
    await BlockTemplate.findOneAndUpdate(
      { type: template.type },
      template,
      { upsert: true, new: true }
    );
  }
  console.log("✅ Block templates created");

  console.log("🎉 Database seeded successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
```

## Step 11: Add Seed Script to package.json

Update `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:seed": "tsx lib/db/seed.ts"
  }
}
```

Install tsx:
```bash
npm install -D tsx
```

## Step 12: Run Database Seed

```bash
npm run db:seed
```

You should see:
```
✅ MongoDB connected successfully
✅ Admin user created
✅ Settings created
✅ Block templates created
🎉 Database seeded successfully!
```

## Verification Checklist

- [ ] MongoDB connection established
- [ ] All models created without errors
- [ ] Database seed script runs successfully
- [ ] Admin user created (email: admin@ojvwebdesign.com, password: admin123)
- [ ] Default settings created
- [ ] Block templates created

## Testing Database Connection

Create `app/api/test-db/route.ts`:

```typescript
import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { User } from "@/lib/db/models";

export async function GET() {
  try {
    await connectDB();
    const userCount = await User.countDocuments();
    
    return NextResponse.json({
      success: true,
      message: "Database connected",
      userCount,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

Test by visiting: `http://localhost:3000/api/test-db`

## Troubleshooting

**Issue: Connection timeout**
- Check MongoDB is running
- Verify connection string in `.env.local`
- For Atlas: Check network access whitelist

**Issue: Model already exists error**
- This is normal in development (hot reload)
- The code handles this with `models.ModelName ||`

**Issue: Seed script fails**
- Ensure MongoDB is running
- Check connection string
- Verify all model files are error-free

## Next Steps

Once database is set up, proceed to:
→ **[03-AUTHENTICATION.md](./03-AUTHENTICATION.md)**

## Resources

- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Schema Design](https://www.mongodb.com/docs/manual/core/data-modeling-introduction/)
- [TypeScript with Mongoose](https://mongoosejs.com/docs/typescript.html)
