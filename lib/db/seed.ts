// Load environment variables
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import connectDB from "./mongodb";
import { User, Settings, BlockTemplate, Theme } from "./models";
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
      navbarStyle: "default",
      navbarPosition: "top",
      showNavbar: true,
      navbarLogoText: "Pawfect Poodles",
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

  // Create default themes
  const defaultThemes = [
    {
      name: "Modern Breeder",
      slug: "modern-breeder",
      description: "Clean and modern design perfect for dog breeding businesses",
      isActive: true,
      isDefault: true,
      colors: {
        primary: "#667eea",
        secondary: "#764ba2",
        accent: "#818cf8",
        background: "#ffffff",
        foreground: "#1f2937",
        muted: "#f3f4f6",
        mutedForeground: "#6b7280",
        border: "#e5e7eb",
        input: "#e5e7eb",
        ring: "#667eea",
        card: "#ffffff",
        cardForeground: "#1f2937",
        destructive: "#ef4444",
        destructiveForeground: "#ffffff",
        success: "#10b981",
        warning: "#f59e0b",
      },
      typography: {
        fontFamily: "Inter, sans-serif",
        headingFont: "Inter, sans-serif",
        fontSize: {
          base: "16px",
          sm: "14px",
          lg: "18px",
          xl: "20px",
        },
      },
      styles: {
        borderRadius: "0.5rem",
        buttonStyle: "rounded",
        navbarStyle: "default",
      },
      createdBy: adminUser._id,
    },
    {
      name: "Classic Kennel",
      slug: "classic-kennel",
      description: "Traditional and elegant theme for established breeding programs",
      isActive: true,
      isDefault: false,
      colors: {
        primary: "#8b5cf6",
        secondary: "#6366f1",
        accent: "#a78bfa",
        background: "#fafafa",
        foreground: "#1e293b",
        muted: "#f1f5f9",
        mutedForeground: "#64748b",
        border: "#e2e8f0",
        input: "#e2e8f0",
        ring: "#8b5cf6",
        card: "#ffffff",
        cardForeground: "#1e293b",
        destructive: "#ef4444",
        destructiveForeground: "#ffffff",
        success: "#10b981",
        warning: "#f59e0b",
      },
      typography: {
        fontFamily: "Georgia, serif",
        headingFont: "Georgia, serif",
        fontSize: {
          base: "16px",
          sm: "14px",
          lg: "18px",
          xl: "22px",
        },
      },
      styles: {
        borderRadius: "0.25rem",
        buttonStyle: "square",
        navbarStyle: "sticky",
      },
      createdBy: adminUser._id,
    },
    {
      name: "Playful Pups",
      slug: "playful-pups",
      description: "Bright and cheerful theme perfect for family-friendly breeding sites",
      isActive: true,
      isDefault: false,
      colors: {
        primary: "#f59e0b",
        secondary: "#10b981",
        accent: "#3b82f6",
        background: "#ffffff",
        foreground: "#111827",
        muted: "#f9fafb",
        mutedForeground: "#6b7280",
        border: "#e5e7eb",
        input: "#e5e7eb",
        ring: "#f59e0b",
        card: "#ffffff",
        cardForeground: "#111827",
        destructive: "#ef4444",
        destructiveForeground: "#ffffff",
        success: "#10b981",
        warning: "#f59e0b",
      },
      typography: {
        fontFamily: "Inter, sans-serif",
        headingFont: "Inter, sans-serif",
        fontSize: {
          base: "16px",
          sm: "14px",
          lg: "18px",
          xl: "20px",
        },
      },
      styles: {
        borderRadius: "1rem",
        buttonStyle: "pill",
        navbarStyle: "centered",
      },
      createdBy: adminUser._id,
    },
  ];

  for (const theme of defaultThemes) {
    await Theme.findOneAndUpdate(
      { slug: theme.slug },
      theme,
      { upsert: true, new: true }
    );
  }
  console.log("✅ Themes created");

  console.log("🎉 Database seeded successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});

