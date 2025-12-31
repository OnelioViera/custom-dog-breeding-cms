import mongoose, { Schema, models, Model } from "mongoose";

export interface ITheme {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  isDefault: boolean;
  previewImage?: string;
  
  // Color Palette
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    mutedForeground: string;
    border: string;
    input: string;
    ring: string;
    card: string;
    cardForeground: string;
    destructive: string;
    destructiveForeground: string;
    success?: string;
    warning?: string;
  };
  
  // Typography
  typography: {
    fontFamily: string;
    headingFont?: string;
    fontSize: {
      base: string;
      sm: string;
      lg: string;
      xl: string;
    };
  };
  
  // Component Styles
  styles: {
    borderRadius: string;
    buttonStyle: "rounded" | "square" | "pill";
    navbarStyle: "default" | "centered" | "minimal" | "sticky";
  };
  
  // Custom CSS Variables (optional)
  customCSS?: string;
  
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ThemeSchema = new Schema<ITheme>(
  {
    name: {
      type: String,
      required: [true, "Theme name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Theme slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    previewImage: {
      type: String,
      default: null,
    },
    colors: {
      primary: { type: String, required: true, default: "#667eea" },
      secondary: { type: String, required: true, default: "#764ba2" },
      accent: { type: String, default: "#818cf8" },
      background: { type: String, default: "#ffffff" },
      foreground: { type: String, default: "#1f2937" },
      muted: { type: String, default: "#f3f4f6" },
      mutedForeground: { type: String, default: "#6b7280" },
      border: { type: String, default: "#e5e7eb" },
      input: { type: String, default: "#e5e7eb" },
      ring: { type: String, default: "#667eea" },
      card: { type: String, default: "#ffffff" },
      cardForeground: { type: String, default: "#1f2937" },
      destructive: { type: String, default: "#ef4444" },
      destructiveForeground: { type: String, default: "#ffffff" },
      success: { type: String, default: "#10b981" },
      warning: { type: String, default: "#f59e0b" },
    },
    typography: {
      fontFamily: { type: String, default: "Inter, sans-serif" },
      headingFont: { type: String, default: "Inter, sans-serif" },
      fontSize: {
        base: { type: String, default: "16px" },
        sm: { type: String, default: "14px" },
        lg: { type: String, default: "18px" },
        xl: { type: String, default: "20px" },
      },
    },
    styles: {
      borderRadius: { type: String, default: "0.5rem" },
      buttonStyle: {
        type: String,
        enum: ["rounded", "square", "pill"],
        default: "rounded",
      },
      navbarStyle: {
        type: String,
        enum: ["default", "centered", "minimal", "sticky"],
        default: "default",
      },
    },
    customCSS: {
      type: String,
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes (slug already has unique index, so we don't need to add it again)
ThemeSchema.index({ isActive: 1 });
ThemeSchema.index({ isDefault: 1 });

// Ensure only one default theme
ThemeSchema.pre("save", async function (next) {
  if (this.isDefault) {
    await mongoose.model("Theme").updateMany(
      { _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
  next();
});

const Theme: Model<ITheme> =
  models.Theme || mongoose.model<ITheme>("Theme", ThemeSchema);

export default Theme;

