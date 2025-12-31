import { auth } from "@/lib/auth/auth";
import connectDB from "@/lib/db/mongodb";
import Page from "@/lib/db/models/Page";
import "@/lib/db/models/User"; // Import User model to ensure it's registered
import { PageList } from "@/components/admin/page-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Force dynamic rendering since we use auth() and database
export const dynamic = 'force-dynamic';

export default async function PagesPage() {
  await connectDB();
  const session = await auth();

  if (!session) {
    return null;
  }

  const pages = await Page.find()
    .sort({ updatedAt: -1 })
    .populate("createdBy", "name")
    .populate("lastEditedBy", "name")
    .lean();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pages</h1>
        <Link href="/admin/pages/new">
          <Button>+ New Page</Button>
        </Link>
      </div>
      <PageList pages={JSON.parse(JSON.stringify(pages))} />
    </div>
  );
}

