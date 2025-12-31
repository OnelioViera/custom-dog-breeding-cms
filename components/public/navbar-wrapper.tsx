"use client";

import { useEffect, useState } from "react";
import { Navbar } from "./navbar";

interface NavbarData {
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
    showNavbar?: boolean;
  };
}

export function NavbarWrapper() {
  const [navbarData, setNavbarData] = useState<NavbarData | null>(null);

  useEffect(() => {
    fetch("/api/navbar")
      .then((res) => res.json())
      .then((data) => setNavbarData(data))
      .catch((error) => {
        console.error("Error loading navbar:", error);
        setNavbarData({
          pages: [],
          settings: { showNavbar: false },
        });
      });
  }, []);

  if (!navbarData || !navbarData.settings.showNavbar) {
    return null;
  }

  return <Navbar pages={navbarData.pages} settings={navbarData.settings} />;
}

