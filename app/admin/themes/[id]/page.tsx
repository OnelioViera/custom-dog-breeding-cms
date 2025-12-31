import connectDB from "@/lib/db/mongodb";
import Theme from "@/lib/db/models/Theme";
import { ThemeEditor } from "@/components/admin/theme-editor";
import { notFound } from "next/navigation";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function EditThemePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connectDB();
  const { id } = await params;
  
  const theme = await Theme.findById(id).lean();
  
  if (!theme) {
    notFound();
  }

  return <ThemeEditor theme={theme} isNew={false} />;
}

