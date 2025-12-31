// Load environment variables
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

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

