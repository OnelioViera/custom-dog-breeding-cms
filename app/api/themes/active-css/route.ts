import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Theme from "@/lib/db/models/Theme";
import Settings from "@/lib/db/models/Settings";
import { generateThemeCSS } from "@/lib/themes/apply-theme";
import "@/lib/db/models/User";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();

    const settings = await Settings.findOne().lean();
    if (!settings || !settings.theme) {
      return NextResponse.json({ css: null });
    }

    const theme = await Theme.findOne({
      slug: settings.theme,
      isActive: true,
    }).lean();

    if (!theme) {
      return NextResponse.json({ css: null });
    }

    const themeCSS = generateThemeCSS(theme as any);

    return NextResponse.json({ css: themeCSS });
  } catch (error: any) {
    console.error("Error fetching active theme CSS:", error);
    return NextResponse.json({ css: null });
  }
}
