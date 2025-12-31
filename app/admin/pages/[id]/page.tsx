import { auth } from "@/lib/auth/auth";
import connectDB from "@/lib/db/mongodb";
import Page from "@/lib/db/models/Page";
import { PageEditor } from "@/components/editor/page-editor";
import { notFound } from "next/navigation";

// Force dynamic rendering since we use auth() and database
export const dynamic = 'force-dynamic';

export default async function EditPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connectDB();
  const session = await auth();

  if (!session) {
    return null;
  }

  const { id } = await params;
  const page = await Page.findById(id).lean();

  if (!page) {
    notFound();
  }

  return <PageEditor page={JSON.parse(JSON.stringify(page))} />;
}

