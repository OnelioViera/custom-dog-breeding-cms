import mongoose, { Schema, models, Model } from "mongoose";

export interface IBlockTemplate {
  _id: string;
  name: string;
  type: string;
  description: string;
  icon: string;
  category: "hero" | "content" | "gallery" | "form" | "testimonial" | "custom";
  defaultContent: Record<string, any>;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlockTemplateSchema = new Schema<IBlockTemplate>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: "📝",
    },
    category: {
      type: String,
      enum: ["hero", "content", "gallery", "form", "testimonial", "custom"],
      required: true,
    },
    defaultContent: {
      type: Schema.Types.Mixed,
      required: true,
    },
    thumbnail: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const BlockTemplate: Model<IBlockTemplate> =
  models.BlockTemplate || mongoose.model<IBlockTemplate>("BlockTemplate", BlockTemplateSchema);

export default BlockTemplate;

