"use client";

import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarPreviewProps {
  pages: Array<{
    title: string;
    slug: string;
    navbarPosition?: number;
  }>;
  settings: {
    navbarStyle?: "default" | "centered" | "minimal" | "sticky";
    navbarPosition?: "top" | "bottom";
    navbarLogo?: string;
    navbarLogoText?: string;
    siteName?: string;
  };
  currentSlug?: string;
}

export function NavbarPreview({ pages, settings, currentSlug }: NavbarPreviewProps) {
  const style = settings.navbarStyle || "default";
  const position = settings.navbarPosition || "top";
  const logoText = settings.navbarLogoText || settings.siteName || "Site";

  // Sort pages by navbarPosition if available
  const sortedPages = [...pages]
    .filter((page) => page.slug !== "home") // Don't show "home" page
    .sort((a, b) => {
      const posA = a.navbarPosition ?? 999;
      const posB = b.navbarPosition ?? 999;
      return posA - posB;
    });

  const baseClasses = cn(
    "w-full border-b bg-white z-50",
    style === "sticky" && "sticky top-0",
    position === "bottom" && "border-t border-b-0"
  );

  const containerClasses = cn(
    "container mx-auto px-4",
    style === "centered" && "flex justify-center",
    style === "minimal" && "py-2",
    style !== "minimal" && "py-4"
  );

  return (
    <nav className={cn(baseClasses, "pointer-events-none")}>
      <div className={containerClasses}>
        <div className={cn(
          "flex items-center justify-between",
          style === "centered" && "justify-center",
          style === "minimal" && "justify-between"
        )}>
          {/* Logo */}
          <div className="flex items-center gap-2">
            {settings.navbarLogo ? (
              <img
                src={settings.navbarLogo}
                alt={logoText}
                className="h-8 w-auto pointer-events-none"
              />
            ) : (
              <span className="text-xl font-bold text-primary pointer-events-none">{logoText}</span>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <div className={cn(
            "hidden md:flex items-center gap-6",
            style === "centered" && "mx-auto",
            style === "minimal" && "gap-4"
          )}>
            <span className={cn(
              "text-sm font-medium pointer-events-none",
              (!currentSlug || currentSlug === "home") ? "text-primary" : "text-gray-700"
            )}>
              Home
            </span>
            {sortedPages.map((page) => (
              <span
                key={page.slug}
                className={cn(
                  "text-sm font-medium pointer-events-none",
                  currentSlug === page.slug ? "text-primary" : "text-gray-700"
                )}
              >
                {page.title}
              </span>
            ))}
          </div>

          {/* Mobile Menu Button - Disabled in preview */}
          <div className="md:hidden p-2 text-gray-700 pointer-events-none">
            <Menu className="w-6 h-6" />
          </div>
        </div>

        {/* Mobile Navigation Menu - Always visible in preview, non-interactive */}
        <div className="md:hidden border-t mt-4 pt-4 pb-2">
          <div className="flex flex-col gap-4">
            <span className={cn(
              "text-sm font-medium py-2 pointer-events-none",
              (!currentSlug || currentSlug === "home") ? "text-primary" : "text-gray-700"
            )}>
              Home
            </span>
            {sortedPages.map((page) => (
              <span
                key={page.slug}
                className={cn(
                  "text-sm font-medium py-2 pointer-events-none",
                  currentSlug === page.slug ? "text-primary" : "text-gray-700"
                )}
              >
                {page.title}
              </span>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

