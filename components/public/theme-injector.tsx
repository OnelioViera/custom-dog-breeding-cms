"use client";

import { useEffect } from "react";

interface ThemeInjectorProps {
  themeCSS: string;
}

export function ThemeInjector({ themeCSS }: ThemeInjectorProps) {
  useEffect(() => {
    // Remove any existing theme style tag
    const existingStyle = document.getElementById("theme-styles");
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create and inject new style tag into head
    const style = document.createElement("style");
    style.id = "theme-styles";
    style.innerHTML = themeCSS;
    
    // Append to end of head so it loads AFTER globals.css and can override CSS variables
    document.head.appendChild(style);

    // Cleanup on unmount
    return () => {
      const styleToRemove = document.getElementById("theme-styles");
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [themeCSS]);

  return null;
}

