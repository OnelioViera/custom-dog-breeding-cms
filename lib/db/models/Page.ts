import mongoose, { Schema, models, Model } from "mongoose";

export interface IBlock {
  id: string;
  type: string;
  order: number;
  content: Record<string, any>;
}

export interface ISEO {
  metaTitle: string;
  metaDescription: string;
  slug: string;
  focusKeyword?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  noIndex: boolean;
  noFollow: boolean;
}

export interface IPage {
  _id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  blocks: IBlock[];
  seo: ISEO;
  navbarPosition?: number;
  showInNavbar: boolean;
  theme?: string;
  createdBy: mongoose.Types.ObjectId;
  lastEditedBy: mongoose.Types.ObjectId;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlockSchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  order: { type: Number, required: true },
  content: { type: Schema.Types.Mixed, default: {} },
});

const SEOSchema = new Schema({
  metaTitle: { type: String, default: "" },
  metaDescription: { type: String, default: "" },
  slug: { type: String, required: true },
  focusKeyword: { type: String, default: "" },
  ogTitle: { type: String, default: "" },
  ogDescription: { type: String, default: "" },
  ogImage: { type: String, default: "" },
  noIndex: { type: Boolean, default: false },
  noFollow: { type: Boolean, default: false },
});

const PageSchema = new Schema<IPage>(
  {
    title: {
      type: String,
      required: [true, "Page title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Page slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    blocks: {
      type: [BlockSchema],
      default: [],
    },
    seo: {
      type: SEOSchema,
      required: true,
    },
    navbarPosition: {
      type: Number,
      default: null,
    },
    showInNavbar: {
      type: Boolean,
      default: true,
    },
    theme: {
      type: String,
      default: "modern-breeder",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastEditedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
PageSchema.index({ slug: 1 });
PageSchema.index({ status: 1 });

const Page: Model<IPage> = models.Page || mongoose.model<IPage>("Page", PageSchema);

export default Page;

