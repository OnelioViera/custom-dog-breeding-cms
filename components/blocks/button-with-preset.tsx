"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonWithPresetProps {
  children: React.ReactNode;
  presetSlug?: string | null;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  [key: string]: any; // Allow other button props
}

export function ButtonWithPreset({
  children,
  presetSlug,
  variant = "default",
  size = "default",
  className,
  ...props
}: ButtonWithPresetProps) {
  const [presetData, setPresetData] = useState<any>(null);
  const [presetCSS, setPresetCSS] = useState<string>("");

  useEffect(() => {
    if (!presetSlug) {
      setPresetData(null);
      setPresetCSS("");
      return;
    }

    // Fetch the specific preset data
    fetch(`/api/button-presets/by-slug/${presetSlug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.preset) {
          setPresetData(data.preset);
          setPresetCSS(data.css || "");
        }
      })
      .catch(() => {
        // Silently fail - will use default styles
      });
  }, [presetSlug]);

  // Inject preset CSS if needed (scoped to this specific preset)
  useEffect(() => {
    if (!presetCSS || !presetSlug) return;

    const styleId = `button-preset-${presetSlug}`;
    let style = document.getElementById(styleId);
    
    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      document.head.appendChild(style);
    }
    
    // Scope the CSS to only apply to buttons with this specific preset slug
    // Replace generic selectors with specific ones
    const scopedCSS = presetCSS
      .replace(/\[data-button-preset\]/g, `[data-button-preset-slug="${presetSlug}"]`)
      .replace(/\[data-button-variant="default"\]/g, `[data-button-preset-slug="${presetSlug}"][data-button-variant="default"]`)
      .replace(/\[data-button-variant="secondary"\]/g, `[data-button-preset-slug="${presetSlug}"][data-button-variant="secondary"]`);
    
    style.innerHTML = scopedCSS;

    return () => {
      const styleToRemove = document.getElementById(styleId);
      if (styleToRemove && !document.querySelector(`[data-button-preset-slug="${presetSlug}"]`)) {
        styleToRemove.remove();
      }
    };
  }, [presetCSS, presetSlug]);

  // Calculate styles from preset data
  const getPresetStyles = (): React.CSSProperties => {
    if (!presetData) return {};

    const styles: React.CSSProperties = {};
    
    // Border radius
    const getBorderRadius = () => {
      switch (presetData.borderRadius) {
        case "square": return "0";
        case "pill": return "9999px";
        case "rounded":
        default: return "0.5rem";
      }
    };
    styles.borderRadius = getBorderRadius();

    // Size-specific styles
    const sizeData = presetData.sizes[size] || presetData.sizes.default;
    if (sizeData) {
      styles.height = sizeData.height;
      styles.paddingLeft = sizeData.paddingX;
      styles.paddingRight = sizeData.paddingX;
      styles.fontSize = sizeData.fontSize;
    }

    // Color styles
    if (variant === "default") {
      styles.backgroundColor = presetData.colors.primary;
      styles.color = presetData.colors.text;
    } else if (variant === "secondary") {
      styles.backgroundColor = presetData.colors.secondary;
      styles.color = presetData.colors.text;
    }

    return styles;
  };

  const presetStyles = presetData ? getPresetStyles() : {};

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      style={presetStyles}
      disablePreset={true}
      data-button-preset={presetSlug || undefined}
      data-button-preset-slug={presetSlug || undefined}
      onMouseEnter={(e) => {
        if (presetData && (variant === "default" || variant === "secondary")) {
          const hoverColor = variant === "default" 
            ? presetData.colors.primaryHover 
            : presetData.colors.secondaryHover;
          if (hoverColor) {
            (e.currentTarget as HTMLElement).style.backgroundColor = hoverColor;
          }
        }
      }}
      onMouseLeave={(e) => {
        if (presetData && (variant === "default" || variant === "secondary")) {
          const normalColor = variant === "default"
            ? presetData.colors.primary
            : presetData.colors.secondary;
          if (normalColor) {
            (e.currentTarget as HTMLElement).style.backgroundColor = normalColor;
          }
        }
      }}
      {...props}
    >
      {children}
    </Button>
  );
}

