import { auth } from "@/lib/auth/auth";
import connectDB from "@/lib/db/mongodb";
import ButtonPreset from "@/lib/db/models/ButtonPreset";
import Settings from "@/lib/db/models/Settings";
import "@/lib/db/models/User";
import { ButtonPresetList } from "@/components/admin/button-preset-list";
import { ButtonPresetInfo } from "@/components/admin/button-preset-info";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function ButtonPresetsPage() {
  await connectDB();
  const session = await auth();

  if (!session) {
    return null;
  }

  const presets = await ButtonPreset.find()
    .sort({ isDefault: -1, createdAt: -1 })
    .populate("createdBy", "name")
    .lean();

  // Get active preset
  const settings = await Settings.findOne().lean();
  let activePreset = null;
  if (settings?.activeButtonPreset) {
    activePreset = await ButtonPreset.findOne({ 
      slug: settings.activeButtonPreset 
    }).select("name slug").lean();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Button Presets</h1>
        <Link href="/admin/button-presets/new">
          <Button>+ New Button Preset</Button>
        </Link>
      </div>
      
      {activePreset && (
        <div className="mb-6">
          <ButtonPresetInfo activePreset={activePreset} />
        </div>
      )}
      
      <ButtonPresetList presets={JSON.parse(JSON.stringify(presets))} />
    </div>
  );
}

