import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import connectDB from "@/lib/db/mongodb";
import Page from "@/lib/db/models/Page";
import "@/lib/db/models/User"; // Import User model to ensure it's registered

// GET - Get a single page
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
    const page = await Page.findById(id)
      .populate("createdBy", "name email")
      .populate("lastEditedBy", "name email")
      .lean();

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({ page });
  } catch (error: any) {
    console.error("Error fetching page:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch page" },
      { status: 500 }
    );
  }
}

// PATCH - Update a page
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
    const { title, slug, blocks, seo, status, showInNavbar, navbarPosition } =
      body;

    const page = await Page.findById(id);

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Check if slug is being changed and if it conflicts
    if (slug && slug !== page.slug) {
      const existingPage = await Page.findOne({ slug, _id: { $ne: id } });
      if (existingPage) {
        return NextResponse.json(
          { error: "A page with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Update fields
    if (title !== undefined) page.title = title;
    if (slug !== undefined) {
      page.slug = slug;
      if (page.seo) {
        page.seo.slug = slug;
      }
    }
    if (blocks !== undefined) page.blocks = blocks;
    if (seo !== undefined) page.seo = { ...page.seo, ...seo };
    if (status !== undefined) {
      page.status = status;
      if (status === "published" && !page.publishedAt) {
        page.publishedAt = new Date();
      }
    }
    if (showInNavbar !== undefined) page.showInNavbar = showInNavbar;
    if (navbarPosition !== undefined) page.navbarPosition = navbarPosition;

    page.lastEditedBy = session.user.id as any;

    await page.save();

    return NextResponse.json({ page });
  } catch (error: any) {
    console.error("Error updating page:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update page" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a page
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
    const page = await Page.findByIdAndDelete(id);

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Page deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting page:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete page" },
      { status: 500 }
    );
  }
}

