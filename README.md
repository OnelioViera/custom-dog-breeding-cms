# OJV Web Design CMS

## Project Overview

A custom-built Content Management System designed specifically for dog breeding businesses. Built with Next.js, MongoDB, and Shadcn/ui, this CMS provides a visual page builder, live preview, SEO tools, email integration, role-based permissions, and automated backups.

## 🎯 Key Features

- **Visual Page Builder**: Drag-and-drop block system with live preview
- **Content Management**: Edit pages, images, text, buttons, and sections
- **Dynamic Page Creation**: Add new pages with automatic routing
- **SEO Tools**: Meta tags, Open Graph, Schema markup, sitemap generation
- **Email Integration**: Contact form notifications and auto-responses
- **Role-Based Permissions**: Admin, Editor, and Viewer roles
- **Automated Backups**: Daily database backups with restore functionality
- **Pre-built Themes**: Multiple dog breeding website templates
- **Live Preview**: Real-time updates as you edit

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (App Router)
- **UI Components**: Shadcn/ui
- **Styling**: Tailwind CSS
- **Database**: MongoDB (with Mongoose)
- **Authentication**: NextAuth.js
- **Email**: Resend
- **File Storage**: Cloudflare R2 / AWS S3
- **Deployment**: Vercel

## 📁 Project Structure

```
ojv-cms/
├── app/
│   ├── (public)/              # Public-facing dog breeding sites
│   │   ├── [slug]/            # Dynamic pages
│   │   └── layout.tsx
│   ├── admin/                 # CMS dashboard
│   │   ├── pages/             # Page management
│   │   ├── blocks/            # Block library
│   │   ├── themes/            # Theme selector
│   │   ├── seo/               # SEO settings
│   │   ├── email/             # Email configuration
│   │   ├── users/             # User management
│   │   └── backups/           # Backup management
│   └── api/                   # API routes
│       ├── auth/              # Authentication
│       ├── pages/             # Page CRUD
│       ├── blocks/            # Block operations
│       ├── email/             # Email sending
│       └── backups/           # Backup operations
├── components/
│   ├── blocks/                # Reusable content blocks
│   ├── editor/                # Visual editor components
│   ├── preview/               # Live preview components
│   └── ui/                    # Shadcn components
├── lib/
│   ├── db/                    # MongoDB connection & models
│   ├── cms/                   # CMS core logic
│   ├── email/                 # Email service
│   └── storage/               # File storage utilities
├── public/
│   └── themes/                # Static theme assets
└── docs/                      # Documentation (these files)
```

## 📚 Documentation Files

Work through these documents in order:

1. **[01-PROJECT-SETUP.md](./01-PROJECT-SETUP.md)** - Initial setup and dependencies
2. **[02-DATABASE-SETUP.md](./02-DATABASE-SETUP.md)** - MongoDB schema and models
3. **[03-AUTHENTICATION.md](./03-AUTHENTICATION.md)** - NextAuth.js configuration
4. **[04-BASIC-CMS-STRUCTURE.md](./04-BASIC-CMS-STRUCTURE.md)** - Core CMS layout
5. **[05-PAGE-EDITOR.md](./05-PAGE-EDITOR.md)** - Visual page editor
6. **[06-BLOCK-SYSTEM.md](./06-BLOCK-SYSTEM.md)** - Block library and drag-and-drop
7. **[07-LIVE-PREVIEW.md](./07-LIVE-PREVIEW.md)** - Real-time preview functionality
8. **[08-DYNAMIC-ROUTING.md](./08-DYNAMIC-ROUTING.md)** - Dynamic page generation
9. **[09-SEO-TOOLS.md](./09-SEO-TOOLS.md)** - SEO optimization features
10. **[10-EMAIL-INTEGRATION.md](./10-EMAIL-INTEGRATION.md)** - Email service setup
11. **[11-PERMISSIONS.md](./11-PERMISSIONS.md)** - Role-based access control
12. **[12-BACKUPS.md](./12-BACKUPS.md)** - Automated backup system
13. **[13-THEMES.md](./13-THEMES.md)** - Pre-built theme implementation
14. **[14-DEPLOYMENT.md](./14-DEPLOYMENT.md)** - Production deployment guide

## 🚀 Quick Start

```bash
# Clone or create project
npx create-next-app@latest ojv-cms

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

## 🔐 Environment Variables

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key

# Email
RESEND_API_KEY=your_resend_api_key

# Storage
R2_ACCOUNT_ID=your_r2_account_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET_NAME=your_bucket_name
```

## 📦 Core Dependencies

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "mongodb": "^6.3.0",
    "mongoose": "^8.1.0",
    "next-auth": "^5.0.0",
    "resend": "^3.2.0",
    "react-beautiful-dnd": "^13.1.1",
    "@radix-ui/react-*": "latest",
    "tailwindcss": "^3.4.0",
    "zod": "^3.22.0"
  }
}
```

## 🎨 Design System

This CMS uses Shadcn/ui components with a custom color scheme:

- **Primary**: `#667eea` (Purple gradient)
- **Secondary**: `#764ba2`
- **Success**: `#10b981`
- **Warning**: `#f59e0b`
- **Error**: `#ef4444`

## 📝 Development Workflow

1. **Phase 1: Foundation (Week 1-2)**
   - Project setup
   - Database schema
   - Authentication
   - Basic CMS structure

2. **Phase 2: Core CMS (Week 3-4)**
   - Page editor
   - Block system
   - Live preview
   - Dynamic routing

3. **Phase 3: Advanced Features (Week 5-6)**
   - SEO tools
   - Email integration
   - Permissions
   - Backups

4. **Phase 4: Polish & Deploy (Week 7-8)**
   - Themes
   - Testing
   - Optimization
   - Deployment

## 🧪 Testing Strategy

- **Unit Tests**: Jest for utility functions
- **Integration Tests**: Test API routes
- **E2E Tests**: Playwright for CMS workflows
- **Manual Testing**: Checklist in each documentation file

## 📖 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Docs](https://www.mongodb.com/docs/)
- [Shadcn/ui Components](https://ui.shadcn.com/)
- [NextAuth.js Guide](https://next-auth.js.org/)
- [Resend API Docs](https://resend.com/docs)

## 🤝 Contributing

This is a custom project for OJV Web Design. For questions or modifications, refer to the documentation files.

## 📄 License

Proprietary - OJV Web Design © 2024

## 🆘 Support

If you encounter issues while building:
1. Check the specific documentation file for troubleshooting
2. Review the demo HTML files for reference
3. Consult the Next.js and MongoDB documentation

---

**Ready to build?** Start with [01-PROJECT-SETUP.md](./01-PROJECT-SETUP.md)
