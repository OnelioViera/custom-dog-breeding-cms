import { auth } from "@/lib/auth/auth";
import { Sidebar } from "@/components/admin/sidebar";
import { Header } from "@/components/admin/header";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import type { ReactNode } from "react";

// Force dynamic rendering since we use headers() and auth()
export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Check if we're on the login page via middleware header
  const headersList = await headers();
  const isLoginPage = headersList.get("x-is-login-page") === "true";

  // Skip auth check for login page - let the login layout handle it
  if (isLoginPage) {
    return <>{children}</>;
  }

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

