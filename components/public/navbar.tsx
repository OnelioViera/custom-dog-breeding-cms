"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
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
}

export function Navbar({ pages, settings }: NavbarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const style = settings.navbarStyle || "default";
  const position = settings.navbarPosition || "top";
  const logoText = settings.navbarLogoText || settings.siteName || "Site";

  // Sort pages by navbarPosition if available
  const sortedPages = [...pages]
    .filter((page) => page.slug !== "home") // Don't show "home" page if it exists
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
    <nav className={baseClasses}>
      <div className={containerClasses}>
        <div className={cn(
          "flex items-center justify-between",
          style === "centered" && "justify-center",
          style === "minimal" && "justify-between"
        )}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            {settings.navbarLogo ? (
              <img
                src={settings.navbarLogo}
                alt={logoText}
                className="h-8 w-auto"
              />
            ) : (
              <span className="text-xl font-bold text-primary">{logoText}</span>
            )}
          </Link>

          {/* Desktop Navigation Links */}
          <div className={cn(
            "hidden md:flex items-center gap-6",
            style === "centered" && "mx-auto",
            style === "minimal" && "gap-4"
          )}>
            <Link
              href="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/" ? "text-primary" : "text-gray-700"
              )}
            >
              Home
            </Link>
            {sortedPages.map((page) => (
              <Link
                key={page.slug}
                href={`/${page.slug}`}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === `/${page.slug}` ? "text-primary" : "text-gray-700"
                )}
              >
                {page.title}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t mt-4 pt-4 pb-2">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary py-2",
                  pathname === "/" ? "text-primary" : "text-gray-700"
                )}
              >
                Home
              </Link>
              {sortedPages.map((page) => (
                <Link
                  key={page.slug}
                  href={`/${page.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary py-2",
                    pathname === `/${page.slug}` ? "text-primary" : "text-gray-700"
                  )}
                >
                  {page.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
