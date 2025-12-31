import { auth } from "@/lib/auth/auth";
import connectDB from "@/lib/db/mongodb";
import Theme from "@/lib/db/models/Theme";
import "@/lib/db/models/User";
import { ThemeList } from "@/components/admin/theme-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function ThemesPage() {
  await connectDB();
  const session = await auth();

  if (!session) {
    return null;
  }

  const themes = await Theme.find()
    .sort({ isDefault: -1, createdAt: -1 })
    .populate("createdBy", "name")
    .lean();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Themes</h1>
        <Link href="/admin/themes/new">
          <Button>+ New Theme</Button>
        </Link>
      </div>
      <ThemeList themes={JSON.parse(JSON.stringify(themes))} />
    </div>
  );
}

