import { ThemeEditor } from "@/components/admin/theme-editor";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function NewThemePage() {
  // Create a blank theme object for new themes
  const blankTheme = {
    _id: "new",
    name: "",
    slug: "",
    description: "",
    isActive: true,
    isDefault: false,
    previewImage: null,
    colors: {
      primary: "#667eea",
      secondary: "#764ba2",
      accent: "#818cf8",
      background: "#ffffff",
      foreground: "#1f2937",
      muted: "#f3f4f6",
      mutedForeground: "#6b7280",
      border: "#e5e7eb",
      input: "#e5e7eb",
      ring: "#667eea",
      card: "#ffffff",
      cardForeground: "#1f2937",
      destructive: "#ef4444",
      destructiveForeground: "#ffffff",
      success: "#10b981",
      warning: "#f59e0b",
    },
    typography: {
      fontFamily: "Inter, sans-serif",
      headingFont: "Inter, sans-serif",
      fontSize: {
        base: "16px",
        sm: "14px",
        lg: "18px",
        xl: "20px",
      },
    },
    styles: {
      borderRadius: "0.5rem",
      buttonStyle: "rounded" as const,
      navbarStyle: "default" as const,
    },
    customCSS: null,
  };

  return <ThemeEditor theme={blankTheme} isNew />;
}

