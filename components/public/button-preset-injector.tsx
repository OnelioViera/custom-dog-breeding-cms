"use client";

import { useEffect } from "react";

interface ButtonPresetInjectorProps {
  presetCSS: string;
}

export function ButtonPresetInjector({ presetCSS }: ButtonPresetInjectorProps) {
  useEffect(() => {
    const updateCSS = () => {
      // Remove any existing button preset style tag
      const existingStyle = document.getElementById("button-preset-styles");
      if (existingStyle) {
        existingStyle.remove();
      }

      // Create and inject new style tag into head
      const style = document.createElement("style");
      style.id = "button-preset-styles";
      style.innerHTML = presetCSS;
      
      // Append to end of head so it loads AFTER theme styles
      document.head.appendChild(style);

      // Dispatch a custom event to notify buttons that preset has changed
      window.dispatchEvent(new CustomEvent("buttonPresetUpdated"));
    };

    updateCSS();

    // Also listen for manual refresh requests (from admin when preset is updated)
    const handleRefresh = async () => {
      try {
        // Fetch fresh CSS
        const res = await fetch("/api/button-presets/active-css");
        const data = await res.json();
        
          if (data.css) {
            const existingStyle = document.getElementById("button-preset-styles");
            if (existingStyle) {
              // Remove and recreate to ensure CSS variables are properly updated
              existingStyle.remove();
              
              // Create new style tag with updated CSS
              const newStyle = document.createElement("style");
              newStyle.id = "button-preset-styles";
              newStyle.innerHTML = data.css;
              document.head.appendChild(newStyle);
              
              // Wait for CSS to be applied, then notify buttons multiple times to ensure update
              setTimeout(() => {
                window.dispatchEvent(new CustomEvent("buttonPresetUpdated"));
                // Also trigger a second update after a longer delay
                setTimeout(() => {
                  window.dispatchEvent(new CustomEvent("buttonPresetUpdated"));
                }, 200);
              }, 150);
            } else {
              // If style tag doesn't exist, create it
              updateCSS();
            }
          }
      } catch (error) {
        console.error("Error refreshing button preset CSS:", error);
      }
    };

    window.addEventListener("refreshButtonPreset", handleRefresh);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("refreshButtonPreset", handleRefresh);
      const styleToRemove = document.getElementById("button-preset-styles");
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [presetCSS]);

  return null;
}

