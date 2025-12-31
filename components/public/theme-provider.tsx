import connectDB from "@/lib/db/mongodb";
import Theme from "@/lib/db/models/Theme";
import Settings from "@/lib/db/models/Settings";
import "@/lib/db/models/User"; // Import User model to ensure it's registered
import { generateThemeCSS } from "@/lib/themes/apply-theme";
import { ThemeInjector } from "./theme-injector";

export async function ThemeProvider() {
  try {
    await connectDB();
    
    // Get the active theme from Settings
    const settings = await Settings.findOne().lean();
    if (!settings || !settings.theme) {
      return null;
    }

    // Get the theme by slug
    const theme = await Theme.findOne({ 
      slug: settings.theme,
      isActive: true 
    }).lean();

    if (!theme) {
      return null;
    }

    const themeCSS = generateThemeCSS(theme as any);

    return <ThemeInjector themeCSS={themeCSS} />;
  } catch (error) {
    console.error("Error loading theme:", error);
    return null;
  }
}

