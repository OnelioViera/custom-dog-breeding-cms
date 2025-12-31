import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import connectDB from "@/lib/db/mongodb";
import ButtonPreset from "@/lib/db/models/ButtonPreset";
import Settings from "@/lib/db/models/Settings";
import "@/lib/db/models/User";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET - Get a single button preset
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
    const preset = await ButtonPreset.findById(id)
      .populate("createdBy", "name email")
      .lean();

    if (!preset) {
      return NextResponse.json({ error: "Button preset not found" }, { status: 404 });
    }

    return NextResponse.json({ preset });
  } catch (error: any) {
    console.error("Error fetching button preset:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch button preset" },
      { status: 500 }
    );
  }
}

// PATCH - Update a button preset
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

    // Check if this preset is currently active before updating
    const settings = await Settings.findOne().lean();
    const currentPreset = await ButtonPreset.findById(id).lean();
    const isActivePreset = settings?.activeButtonPreset === currentPreset?.slug;

    const updatedPreset = await ButtonPreset.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    )
      .populate("createdBy", "name email")
      .lean();

    if (!updatedPreset) {
      return NextResponse.json({ error: "Button preset not found" }, { status: 404 });
    }

    // If this was the active preset, update Settings to ensure it stays in sync
    if (isActivePreset) {
      await Settings.findOneAndUpdate(
        {},
        {
          $set: {
            activeButtonPreset: updatedPreset.slug,
            buttonStyle: updatedPreset.borderRadius,
          },
        },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({ 
      preset: updatedPreset,
      isActive: isActivePreset,
    });
  } catch (error: any) {
    console.error("Error updating button preset:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update button preset" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a button preset
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
    
    // Prevent deleting the default preset
    const preset = await ButtonPreset.findById(id);
    if (!preset) {
      return NextResponse.json({ error: "Button preset not found" }, { status: 404 });
    }

    if (preset.isDefault) {
      return NextResponse.json(
        { error: "Cannot delete the default preset. Set another preset as default first." },
        { status: 400 }
      );
    }

    await ButtonPreset.findByIdAndDelete(id);

    return NextResponse.json({ message: "Button preset deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting button preset:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete button preset" },
      { status: 500 }
    );
  }
}

