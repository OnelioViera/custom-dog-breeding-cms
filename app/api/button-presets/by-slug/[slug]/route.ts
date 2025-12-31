import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import ButtonPreset from "@/lib/db/models/ButtonPreset";
import "@/lib/db/models/User";
import { generateButtonPresetCSS } from "@/lib/themes/apply-button-preset";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET - Get CSS for a button preset by slug
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    
    const { slug } = await params;
    
    // Get the preset by slug
    const preset = await ButtonPreset.findOne({ 
      slug,
      isActive: true 
    }).lean();

    if (!preset) {
      return NextResponse.json({ error: "Button preset not found" }, { status: 404 });
    }

    const presetCSS = generateButtonPresetCSS(preset as any);

    return NextResponse.json({ 
      css: presetCSS, 
      preset: {
        name: preset.name,
        slug: preset.slug,
        colors: preset.colors,
        sizes: preset.sizes,
        borderRadius: preset.borderRadius,
      }
    });
  } catch (error: any) {
    console.error("Error fetching button preset CSS:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch button preset" },
      { status: 500 }
    );
  }
}

