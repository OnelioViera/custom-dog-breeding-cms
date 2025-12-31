import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import connectDB from "@/lib/db/mongodb";
import Theme from "@/lib/db/models/Theme";
import "@/lib/db/models/User";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET - List all themes
export async function GET() {
  try {
    await connectDB();
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const themes = await Theme.find()
      .sort({ isDefault: -1, createdAt: -1 })
      .populate("createdBy", "name email")
      .lean();

    return NextResponse.json({ themes });
  } catch (error: any) {
    console.error("Error fetching themes:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch themes" },
      { status: 500 }
    );
  }
}

// POST - Create a new theme
export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, slug, description, colors, typography, styles, isDefault, customCSS } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingTheme = await Theme.findOne({ slug });
    if (existingTheme) {
      return NextResponse.json(
        { error: "A theme with this slug already exists" },
        { status: 400 }
      );
    }

    const theme = await Theme.create({
      name,
      slug,
      description: description || "",
      colors: colors || {
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
      typography: typography || {
        fontFamily: "Inter, sans-serif",
        headingFont: "Inter, sans-serif",
        fontSize: {
          base: "16px",
          sm: "14px",
          lg: "18px",
          xl: "20px",
        },
      },
      styles: styles || {
        borderRadius: "0.5rem",
        buttonStyle: "rounded",
        navbarStyle: "default",
      },
      isDefault: isDefault || false,
      isActive: true,
      customCSS: customCSS || null,
      createdBy: session.user.id,
    });

    return NextResponse.json({ theme }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating theme:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create theme" },
      { status: 500 }
    );
  }
}

