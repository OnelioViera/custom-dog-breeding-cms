import mongoose, { Schema, models, Model } from "mongoose";

export interface IButtonPreset {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  colors: {
    primary: string;
    primaryHover: string;
    secondary: string;
    secondaryHover: string;
    text: string;
    textHover?: string;
  };
  sizes: {
    sm: { height: string; paddingX: string; fontSize: string };
    default: { height: string; paddingX: string; fontSize: string };
    lg: { height: string; paddingX: string; fontSize: string };
  };
  borderRadius: string;
  isDefault: boolean;
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ButtonPresetSchema = new Schema<IButtonPreset>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    colors: {
      primary: {
        type: String,
        required: true,
        default: "#667eea",
      },
      primaryHover: {
        type: String,
        required: true,
        default: "#5a67d8",
      },
      secondary: {
        type: String,
        required: true,
        default: "#764ba2",
      },
      secondaryHover: {
        type: String,
        required: true,
        default: "#6b3d8f",
      },
      text: {
        type: String,
        required: true,
        default: "#ffffff",
      },
      textHover: {
        type: String,
        default: "#ffffff",
      },
    },
    sizes: {
      sm: {
        height: { type: String, default: "2.25rem" }, // h-9
        paddingX: { type: String, default: "0.75rem" }, // px-3
        fontSize: { type: String, default: "0.875rem" }, // text-sm
      },
      default: {
        height: { type: String, default: "2.5rem" }, // h-10
        paddingX: { type: String, default: "1rem" }, // px-4
        fontSize: { type: String, default: "0.875rem" }, // text-sm
      },
      lg: {
        height: { type: String, default: "2.75rem" }, // h-11
        paddingX: { type: String, default: "2rem" }, // px-8
        fontSize: { type: String, default: "1rem" }, // text-base
      },
    },
    borderRadius: {
      type: String,
      enum: ["rounded", "square", "pill"],
      default: "rounded",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
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

// Ensure only one default preset
ButtonPresetSchema.pre("save", async function (next) {
  if (this.isDefault && this.isModified("isDefault")) {
    await mongoose.model("ButtonPreset").updateMany(
      { _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
  next();
});

// Index for faster queries
ButtonPresetSchema.index({ slug: 1 });
ButtonPresetSchema.index({ isDefault: 1 });
ButtonPresetSchema.index({ isActive: 1 });

const ButtonPreset: Model<IButtonPreset> =
  models.ButtonPreset ||
  mongoose.model<IButtonPreset>("ButtonPreset", ButtonPresetSchema);

export default ButtonPreset;

