import { ITheme } from "@/lib/db/models/Theme";

/**
 * Converts hex color to HSL format for CSS variables
 */
function hexToHSL(hex: string): string {
  // Remove # if present
  hex = hex.replace("#", "");
  
  // Parse RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  const lPercent = Math.round(l * 100);

  return `${h} ${s}% ${lPercent}%`;
}

/**
 * Generates CSS variables from a theme
 */
export function generateThemeCSS(theme: ITheme): string {
  return `
    :root {
      --primary: ${hexToHSL(theme.colors.primary)};
      --primary-foreground: ${hexToHSL(theme.colors.primary === "#ffffff" ? "#000000" : "#ffffff")};
      --secondary: ${hexToHSL(theme.colors.secondary)};
      --secondary-foreground: ${hexToHSL(theme.colors.secondary === "#ffffff" ? "#000000" : "#ffffff")};
      --accent: ${hexToHSL(theme.colors.accent || theme.colors.primary)};
      --background: ${hexToHSL(theme.colors.background)};
      --foreground: ${hexToHSL(theme.colors.foreground)};
      --muted: ${hexToHSL(theme.colors.muted)};
      --muted-foreground: ${hexToHSL(theme.colors.mutedForeground)};
      --border: ${hexToHSL(theme.colors.border)};
      --input: ${hexToHSL(theme.colors.input)};
      --ring: ${hexToHSL(theme.colors.ring)};
      --card: ${hexToHSL(theme.colors.card)};
      --card-foreground: ${hexToHSL(theme.colors.cardForeground)};
      --destructive: ${hexToHSL(theme.colors.destructive)};
      --destructive-foreground: ${hexToHSL(theme.colors.destructiveForeground)};
      --radius: ${theme.styles.borderRadius};
      --button-style: ${theme.styles.buttonStyle || "rounded"};
      ${theme.colors.success ? `--success: ${hexToHSL(theme.colors.success)};` : ""}
      ${theme.colors.warning ? `--warning: ${hexToHSL(theme.colors.warning)};` : ""}
    }
    
    /* Button style classes */
    .btn-rounded {
      border-radius: var(--radius);
    }
    .btn-square {
      border-radius: 0;
    }
    .btn-pill {
      border-radius: 9999px;
    }
    
    body {
      font-family: ${theme.typography.fontFamily};
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-family: ${theme.typography.headingFont || theme.typography.fontFamily};
    }
    
    ${theme.customCSS || ""}
  `.trim();
}

