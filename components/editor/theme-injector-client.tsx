"use client";

import { useEffect, useState } from "react";

export function ThemeInjectorClient() {
  const [themeCSS, setThemeCSS] = useState<string>("");

  useEffect(() => {
    // Fetch the active theme CSS
    fetch("/api/themes/active-css")
      .then((res) => res.json())
      .then((data) => {
        if (data.css) {
          setThemeCSS(data.css);
        }
      })
      .catch(() => {
        // Silently fail if no theme is active
      });
  }, []);

  useEffect(() => {
    if (!themeCSS) return;

    // Remove any existing theme style tag in the preview
    const existingStyle = document.getElementById("theme-styles-preview");
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create and inject new style tag
    const style = document.createElement("style");
    style.id = "theme-styles-preview";
    style.innerHTML = themeCSS;
    
    // Append to end of head so it loads AFTER globals.css
    document.head.appendChild(style);

    // Cleanup on unmount
    return () => {
      const styleToRemove = document.getElementById("theme-styles-preview");
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [themeCSS]);

  return null;
}

