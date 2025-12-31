"use client";

import { useEffect, useState } from "react";

export function ButtonPresetInjectorClient() {
  const [presetCSS, setPresetCSS] = useState<string>("");

  useEffect(() => {
    // Fetch the active button preset CSS
    fetch("/api/button-presets/active-css")
      .then((res) => res.json())
      .then((data) => {
        if (data.css) {
          setPresetCSS(data.css);
        }
      })
      .catch(() => {
        // Silently fail if no preset is active
      });
  }, []);

  useEffect(() => {
    if (!presetCSS) return;

    // Remove any existing button preset style tag
    const existingStyle = document.getElementById("button-preset-styles-preview");
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create and inject new style tag
    const style = document.createElement("style");
    style.id = "button-preset-styles-preview";
    style.innerHTML = presetCSS;
    document.head.appendChild(style);

    // Cleanup on unmount
    return () => {
      const styleToRemove = document.getElementById("button-preset-styles-preview");
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [presetCSS]);

  return null;
}

