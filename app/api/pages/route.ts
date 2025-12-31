import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import connectDB from "@/lib/db/mongodb";
import Page from "@/lib/db/models/Page";
import "@/lib/db/models/User"; // Import User model to ensure it's registered

// GET - List all pages
export async function GET() {
  try {
    await connectDB();
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pages = await Page.find()
      .sort({ updatedAt: -1 })
      .populate("createdBy", "name email")
      .populate("lastEditedBy", "name email")
      .lean();

    return NextResponse.json({ pages });
  } catch (error: any) {
    console.error("Error fetching pages:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch pages" },
      { status: 500 }
    );
  }
}

// POST - Create a new page
export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, slug, blocks = [], seo, status = "draft" } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { error: "Title and slug are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPage = await Page.findOne({ slug });
    if (existingPage) {
      return NextResponse.json(
        { error: "A page with this slug already exists" },
        { status: 400 }
      );
    }

    const page = await Page.create({
      title,
      slug,
      blocks,
      seo: {
        ...seo,
        slug,
        metaTitle: seo?.metaTitle || title,
        metaDescription: seo?.metaDescription || "",
      },
      status,
      createdBy: session.user.id,
      lastEditedBy: session.user.id,
      publishedAt: status === "published" ? new Date() : null,
    });

    return NextResponse.json({ page }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating page:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create page" },
      { status: 500 }
    );
  }
}

