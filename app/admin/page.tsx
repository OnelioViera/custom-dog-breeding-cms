import { auth } from "@/lib/auth/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  try {
    const session = await auth();

    if (!session) {
      redirect("/admin/login");
    }

    return (
      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Welcome, {session.user.name}!</h2>
          <p className="text-gray-600">
            Role: <span className="font-semibold capitalize">{session.user.role}</span>
          </p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-2">📄 Pages</h3>
          <p className="text-sm text-gray-600 mb-4">
            Manage your website pages
          </p>
          <Link
            href="/admin/pages"
            className="inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Manage Pages
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-2">🧩 Blocks</h3>
          <p className="text-sm text-gray-600 mb-4">
            Customize your block library
          </p>
          <Link
            href="/admin/blocks"
            className="inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            View Blocks
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-2">🎨 Themes</h3>
          <p className="text-sm text-gray-600 mb-4">
            Choose and customize themes
          </p>
          <Link
            href="/admin/themes"
            className="inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Manage Themes
          </Link>
        </div>
      </div>
    </div>
    );
  } catch (error) {
    console.error("AdminDashboard error:", error);
    redirect("/admin/login");
  }
}

