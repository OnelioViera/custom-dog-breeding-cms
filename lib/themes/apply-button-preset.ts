import { IButtonPreset } from "@/lib/db/models/ButtonPreset";

/**
 * Generates CSS for a button preset
 */
export function generateButtonPresetCSS(preset: IButtonPreset): string {
  const getBorderRadius = () => {
    switch (preset.borderRadius) {
      case "square":
        return "0";
      case "pill":
        return "9999px";
      case "rounded":
      default:
        return "var(--radius)";
    }
  };

  return `
    :root {
      --button-primary: ${preset.colors.primary};
      --button-primary-hover: ${preset.colors.primaryHover};
      --button-secondary: ${preset.colors.secondary};
      --button-secondary-hover: ${preset.colors.secondaryHover};
      --button-text: ${preset.colors.text};
      --button-text-hover: ${preset.colors.textHover || preset.colors.text};
      --button-border-radius: ${getBorderRadius()};
      --button-sm-height: ${preset.sizes.sm.height};
      --button-sm-padding-x: ${preset.sizes.sm.paddingX};
      --button-sm-font-size: ${preset.sizes.sm.fontSize};
      --button-default-height: ${preset.sizes.default.height};
      --button-default-padding-x: ${preset.sizes.default.paddingX};
      --button-default-font-size: ${preset.sizes.default.fontSize};
      --button-lg-height: ${preset.sizes.lg.height};
      --button-lg-padding-x: ${preset.sizes.lg.paddingX};
      --button-lg-font-size: ${preset.sizes.lg.fontSize};
    }
    
    /* Button base styles - only apply to buttons that are NOT admin buttons */
    button:not([data-admin-button="true"])[data-button-variant="default"],
    a:not([data-admin-button="true"]) button[data-button-variant="default"] {
      /* Colors will be applied via inline styles from Button component */
    }
    
    button:not([data-admin-button="true"])[data-button-variant="secondary"],
    a:not([data-admin-button="true"]) button[data-button-variant="secondary"] {
      /* Colors will be applied via inline styles from Button component */
    }
    
    /* Button hover styles - only apply to buttons that are NOT admin buttons */
    button:not([data-admin-button="true"])[data-button-variant="default"]:hover,
    a:not([data-admin-button="true"]) button[data-button-variant="default"]:hover {
      background-color: var(--button-primary-hover) !important;
    }
    
    button:not([data-admin-button="true"])[data-button-variant="secondary"]:hover,
    a:not([data-admin-button="true"]) button[data-button-variant="secondary"]:hover {
      background-color: var(--button-secondary-hover) !important;
    }
  `.trim();
}

