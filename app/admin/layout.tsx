import { auth } from "@/lib/auth/auth";
import { Sidebar } from "@/components/admin/sidebar";
import { Header } from "@/components/admin/header";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  try {
    // Check auth - middleware handles redirect, but we check here too
    const session = await auth();
    
    if (!session) {
      redirect("/admin/login");
    }

    return (
      <div className="flex h-screen overflow-hidden bg-white">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header userName={session.user.name || undefined} userRole={session.user.role} />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            {children}
          </main>
        </div>
      </div>
    );
  } catch (error) {
    console.error("AdminLayout error:", error);
    redirect("/admin/login");
  }
}

