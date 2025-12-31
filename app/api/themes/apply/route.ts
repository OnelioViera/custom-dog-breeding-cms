import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import connectDB from "@/lib/db/mongodb";
import Theme from "@/lib/db/models/Theme";
import Settings from "@/lib/db/models/Settings";
import "@/lib/db/models/User";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// POST - Apply a theme (set it as active)
export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { themeId } = body;

    if (!themeId) {
      return NextResponse.json(
        { error: "Theme ID is required" },
        { status: 400 }
      );
    }

    // Get the theme
    const theme = await Theme.findById(themeId);
    if (!theme) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 });
    }

    if (!theme.isActive) {
      return NextResponse.json(
        { error: "Cannot apply an inactive theme" },
        { status: 400 }
      );
    }

    // Set this theme as default
    await Theme.updateMany(
      { _id: { $ne: themeId } },
      { $set: { isDefault: false } }
    );
    await Theme.findByIdAndUpdate(themeId, { isDefault: true });

    // Update Settings with the active theme
    await Settings.findOneAndUpdate(
      {},
      {
        theme: theme.slug,
        primaryColor: theme.colors.primary,
        secondaryColor: theme.colors.secondary,
        navbarStyle: theme.styles?.navbarStyle || "default",
        buttonStyle: theme.styles?.buttonStyle || "rounded",
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      message: "Theme applied successfully",
      theme: {
        id: theme._id,
        slug: theme.slug,
        name: theme.name,
      },
    });
  } catch (error: any) {
    console.error("Error applying theme:", error);
    return NextResponse.json(
      { error: error.message || "Failed to apply theme" },
      { status: 500 }
    );
  }
}

