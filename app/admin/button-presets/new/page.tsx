import { ButtonPresetEditor } from "@/components/admin/button-preset-editor";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function NewButtonPresetPage() {
  // Create a blank preset object for new presets
  const blankPreset = {
    _id: "new",
    name: "",
    slug: "",
    description: "",
    isActive: true,
    isDefault: false,
    colors: {
      primary: "#667eea",
      primaryHover: "#5a67d8",
      secondary: "#764ba2",
      secondaryHover: "#6b3d8f",
      text: "#ffffff",
      textHover: "#ffffff",
    },
    sizes: {
      sm: { height: "2.25rem", paddingX: "0.75rem", fontSize: "0.875rem" },
      default: { height: "2.5rem", paddingX: "1rem", fontSize: "0.875rem" },
      lg: { height: "2.75rem", paddingX: "2rem", fontSize: "1rem" },
    },
    borderRadius: "rounded" as const,
  };

  return <ButtonPresetEditor preset={blankPreset} isNew />;
}

