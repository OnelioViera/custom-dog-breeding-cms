import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Page from "@/lib/db/models/Page";
import Settings from "@/lib/db/models/Settings";
import "@/lib/db/models/User";

// GET - Get navbar data (pages and settings)
export async function GET() {
  try {
    await connectDB();

    // Get pages that should be shown in navbar
    const pages = await Page.find({
      showInNavbar: true,
      status: "published",
    })
      .select("title slug navbarPosition")
      .sort({ navbarPosition: 1, title: 1 })
      .lean();

    // Get navbar settings
    const settings = await Settings.findOne().lean();

    return NextResponse.json({
      pages: JSON.parse(JSON.stringify(pages)),
      settings: settings
        ? {
            navbarStyle: settings.navbarStyle || "default",
            navbarPosition: settings.navbarPosition || "top",
            navbarLogo: settings.navbarLogo || null,
            navbarLogoText: settings.navbarLogoText || null,
            siteName: settings.siteName || null,
            showNavbar: settings.showNavbar !== false,
          }
        : {
            navbarStyle: "default",
            navbarPosition: "top",
            showNavbar: true,
          },
    });
  } catch (error: any) {
    console.error("Error fetching navbar data:", error);
    return NextResponse.json(
      {
        pages: [],
        settings: {
          navbarStyle: "default",
          navbarPosition: "top",
          showNavbar: true,
        },
      },
      { status: 200 }
    );
  }
}

