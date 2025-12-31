import connectDB from "@/lib/db/mongodb";
import Page from "@/lib/db/models/Page";
import { PageRenderer } from "@/components/public/page-renderer";
import "@/lib/db/models/User";
import Link from "next/link";

// Force dynamic rendering since pages are loaded from database
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  try {
    await connectDB();
    
    // Check if there's a published page with slug "home"
    const homePage = await Page.findOne({
      slug: "home",
      status: "published",
    }).lean();

    // If home page exists, render it
    if (homePage) {
      return <PageRenderer page={JSON.parse(JSON.stringify(homePage))} />;
    }
  } catch (error) {
    console.error("Error loading home page:", error);
  }

  // Default welcome page if no "home" page exists
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-primary to-secondary">
      <div className="text-center text-white space-y-6">
        <div className="text-6xl font-bold mb-4">OJV</div>
        <h1 className="text-4xl font-bold">Web Design CMS</h1>
        <p className="text-xl opacity-90">
          Custom Content Management for Dog Breeding Businesses
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Link
            href="/admin"
            className="px-6 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Go to Dashboard →
          </Link>
        </div>
      </div>
    </main>
  );
}

