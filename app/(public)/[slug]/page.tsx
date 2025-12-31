import connectDB from "@/lib/db/mongodb";
import Page from "@/lib/db/models/Page";
import "@/lib/db/models/User"; // Import User model to ensure it's registered
import { notFound } from "next/navigation";
import { PageRenderer } from "@/components/public/page-renderer";
import type { Metadata } from "next";

// Force dynamic rendering since pages are loaded from database
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    await connectDB();
    const { slug } = await params;
    const page = await Page.findOne({
      slug,
      status: "published",
    }).lean();

    if (!page) {
      return {
        title: "Page Not Found",
      };
    }

    return {
      title: page.seo?.metaTitle || page.title,
      description: page.seo?.metaDescription || "",
      openGraph: {
        title: page.seo?.ogTitle || page.seo?.metaTitle || page.title,
        description: page.seo?.ogDescription || page.seo?.metaDescription || "",
        images: page.seo?.ogImage ? [page.seo.ogImage] : [],
      },
      robots: {
        index: !page.seo?.noIndex,
        follow: !page.seo?.noFollow,
      },
    };
  } catch (error) {
    return {
      title: "Page Not Found",
    };
  }
}

export default async function PublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    await connectDB();
    const { slug } = await params;
    
    const page = await Page.findOne({
      slug,
      status: "published",
    }).lean();

    if (!page) {
      notFound();
    }

      // Ensure page has required structure
      const pageData = {
        ...page,
        title: page.title || "Untitled Page",
        blocks: page.blocks || [],
      };

    return <PageRenderer page={JSON.parse(JSON.stringify(pageData))} />;
  } catch (error: any) {
    console.error("Error loading page:", error);
    console.error("Error message:", error?.message);
    console.error("Error stack:", error?.stack);
    notFound();
  }
}
