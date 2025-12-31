import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import connectDB from "@/lib/db/mongodb";
import ButtonPreset from "@/lib/db/models/ButtonPreset";
import "@/lib/db/models/User";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET - List all button presets
export async function GET() {
  try {
    await connectDB();
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const presets = await ButtonPreset.find()
      .sort({ isDefault: -1, createdAt: -1 })
      .populate("createdBy", "name email")
      .lean();

    return NextResponse.json({ presets });
  } catch (error: any) {
    console.error("Error fetching button presets:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch button presets" },
      { status: 500 }
    );
  }
}

// POST - Create a new button preset
export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, slug, description, colors, sizes, borderRadius, isDefault } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPreset = await ButtonPreset.findOne({ slug });
    if (existingPreset) {
      return NextResponse.json(
        { error: "A button preset with this slug already exists" },
        { status: 400 }
      );
    }

    const preset = await ButtonPreset.create({
      name,
      slug,
      description: description || "",
      colors: colors || {
        primary: "#667eea",
        primaryHover: "#5a67d8",
        secondary: "#764ba2",
        secondaryHover: "#6b3d8f",
        text: "#ffffff",
        textHover: "#ffffff",
      },
      sizes: sizes || {
        sm: { height: "2.25rem", paddingX: "0.75rem", fontSize: "0.875rem" },
        default: { height: "2.5rem", paddingX: "1rem", fontSize: "0.875rem" },
        lg: { height: "2.75rem", paddingX: "2rem", fontSize: "1rem" },
      },
      borderRadius: borderRadius || "rounded",
      isDefault: isDefault || false,
      isActive: true,
      createdBy: session.user.id,
    });

    return NextResponse.json({ preset }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating button preset:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create button preset" },
      { status: 500 }
    );
  }
}

