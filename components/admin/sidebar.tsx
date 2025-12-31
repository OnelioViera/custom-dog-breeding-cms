"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  FileText,
  Blocks,
  Palette,
  Search,
  Mail,
  Users,
  HardDrive,
  Settings,
  LayoutDashboard,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: FileText, label: "Pages", href: "/admin/pages" },
  { icon: Blocks, label: "Blocks", href: "/admin/blocks" },
  { icon: Palette, label: "Themes", href: "/admin/themes" },
  { icon: Search, label: "SEO", href: "/admin/seo" },
  { icon: Mail, label: "Email", href: "/admin/email" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: HardDrive, label: "Backups", href: "/admin/backups" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
            OJV
          </div>
          <div>
            <div className="font-bold">OJV CMS</div>
            <div className="text-xs text-muted-foreground">Admin Panel</div>
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
              pathname === item.href || (item.href === "/admin" && pathname === "/admin")
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

