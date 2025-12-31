import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import ButtonPreset from "@/lib/db/models/ButtonPreset";
import Settings from "@/lib/db/models/Settings";
import "@/lib/db/models/User";
import { generateButtonPresetCSS } from "@/lib/themes/apply-button-preset";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET - Get the CSS for the active button preset
export async function GET() {
  try {
    await connectDB();
    
    // Get the active button preset from Settings
    const settings = await Settings.findOne().lean();
    if (!settings || !settings.activeButtonPreset) {
      return NextResponse.json({ css: null });
    }

    // Get the preset by slug
    const preset = await ButtonPreset.findOne({ 
      slug: settings.activeButtonPreset,
      isActive: true 
    }).lean();

    if (!preset) {
      return NextResponse.json({ css: null });
    }

    const presetCSS = generateButtonPresetCSS(preset as any);

    return NextResponse.json({ css: presetCSS });
  } catch (error: any) {
    console.error("Error fetching active button preset CSS:", error);
    return NextResponse.json({ css: null });
  }
}

