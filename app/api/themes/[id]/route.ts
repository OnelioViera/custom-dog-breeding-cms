import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import connectDB from "@/lib/db/mongodb";
import Theme from "@/lib/db/models/Theme";
import Settings from "@/lib/db/models/Settings";
import "@/lib/db/models/User";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET - Get a single theme
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const theme = await Theme.findById(id)
      .populate("createdBy", "name email")
      .lean();

    if (!theme) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 });
    }

    return NextResponse.json({ theme });
  } catch (error: any) {
    console.error("Error fetching theme:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch theme" },
      { status: 500 }
    );
  }
}

// PATCH - Update a theme
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const updatedTheme = await Theme.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    )
      .populate("createdBy", "name email")
      .lean();

    if (!updatedTheme) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 });
    }

    // If this is the default/active theme, update Settings with the new values
    if (updatedTheme.isDefault) {
      await Settings.findOneAndUpdate(
        {},
        {
          theme: updatedTheme.slug,
          primaryColor: updatedTheme.colors?.primary || "#667eea",
          secondaryColor: updatedTheme.colors?.secondary || "#764ba2",
          navbarStyle: updatedTheme.styles?.navbarStyle || "default",
          buttonStyle: updatedTheme.styles?.buttonStyle || "rounded",
        },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({ theme: updatedTheme });
  } catch (error: any) {
    console.error("Error updating theme:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update theme" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a theme
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    
    // Prevent deleting the default theme
    const theme = await Theme.findById(id);
    if (!theme) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 });
    }

    if (theme.isDefault) {
      return NextResponse.json(
        { error: "Cannot delete the default theme. Set another theme as default first." },
        { status: 400 }
      );
    }

    await Theme.findByIdAndDelete(id);

    return NextResponse.json({ message: "Theme deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting theme:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete theme" },
      { status: 500 }
    );
  }
}

