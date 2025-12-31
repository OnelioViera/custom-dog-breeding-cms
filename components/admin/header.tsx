"use client";

import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

// Page titles mapping
const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/pages": "Pages",
  "/admin/blocks": "Blocks",
  "/admin/themes": "Themes",
  "/admin/seo": "SEO",
  "/admin/email": "Email",
  "/admin/users": "Users",
  "/admin/backups": "Backups",
  "/admin/settings": "Settings",
};

interface HeaderProps {
  userName?: string;
  userRole?: string;
}

export function Header({ userName, userRole }: HeaderProps) {
  const pathname = usePathname();
  const pageTitle = pageTitles[pathname] || "Dashboard";

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  return (
    <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-sm font-medium">{userName || "User"}</div>
          <div className="text-xs text-gray-500 capitalize">
            {userRole || "user"}
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 text-sm font-medium"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}

