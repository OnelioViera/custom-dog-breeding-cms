import connectDB from "@/lib/db/mongodb";
import ButtonPreset from "@/lib/db/models/ButtonPreset";
import { ButtonPresetEditor } from "@/components/admin/button-preset-editor";
import { notFound } from "next/navigation";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function EditButtonPresetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connectDB();
  const { id } = await params;
  
  const preset = await ButtonPreset.findById(id).lean();
  
  if (!preset) {
    notFound();
  }

  return <ButtonPresetEditor preset={preset} isNew={false} />;
}

