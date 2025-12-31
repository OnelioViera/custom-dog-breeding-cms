import connectDB from "@/lib/db/mongodb";
import ButtonPreset from "@/lib/db/models/ButtonPreset";
import Settings from "@/lib/db/models/Settings";
import "@/lib/db/models/User";
import { generateButtonPresetCSS } from "@/lib/themes/apply-button-preset";
import { ButtonPresetInjector } from "./button-preset-injector";

export async function ButtonPresetProvider() {
  try {
    await connectDB();
    
    // Get the active button preset from Settings
    const settings = await Settings.findOne().lean();
    if (!settings || !settings.activeButtonPreset) {
      return null;
    }

    // Get the preset by slug
    const preset = await ButtonPreset.findOne({ 
      slug: settings.activeButtonPreset,
      isActive: true 
    }).lean();

    if (!preset) {
      return null;
    }

    const presetCSS = generateButtonPresetCSS(preset as any);

    return <ButtonPresetInjector presetCSS={presetCSS} />;
  } catch (error) {
    console.error("Error loading button preset:", error);
    return null;
  }
}

