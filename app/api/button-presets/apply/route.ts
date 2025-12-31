import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import connectDB from "@/lib/db/mongodb";
import ButtonPreset from "@/lib/db/models/ButtonPreset";
import Settings from "@/lib/db/models/Settings";
import "@/lib/db/models/User";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// POST - Apply a button preset (set it as active)
export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { presetId } = body;

    if (!presetId) {
      return NextResponse.json(
        { error: "Preset ID is required" },
        { status: 400 }
      );
    }

    // Get the preset
    const preset = await ButtonPreset.findById(presetId);
    if (!preset) {
      return NextResponse.json({ error: "Button preset not found" }, { status: 404 });
    }

    if (!preset.isActive) {
      return NextResponse.json(
        { error: "Cannot apply an inactive preset" },
        { status: 400 }
      );
    }

    // Set this preset as default
    await ButtonPreset.updateMany(
      { _id: { $ne: presetId } },
      { $set: { isDefault: false } }
    );
    await ButtonPreset.findByIdAndUpdate(presetId, { isDefault: true });

    // Update Settings with the active preset
    const updatedSettings = await Settings.findOneAndUpdate(
      {},
      {
        $set: {
          activeButtonPreset: preset.slug,
          buttonStyle: preset.borderRadius,
        },
      },
      { upsert: true, new: true }
    );

    // Verify the update
    if (!updatedSettings || updatedSettings.activeButtonPreset !== preset.slug) {
      console.error("Failed to update Settings with active button preset");
      return NextResponse.json(
        { error: "Failed to save preset to settings" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Button preset applied successfully",
      preset: {
        id: preset._id,
        slug: preset.slug,
        name: preset.name,
      },
      settings: {
        activeButtonPreset: updatedSettings.activeButtonPreset,
      },
    });
  } catch (error: any) {
    console.error("Error applying button preset:", error);
    return NextResponse.json(
      { error: error.message || "Failed to apply button preset" },
      { status: 500 }
    );
  }
}

