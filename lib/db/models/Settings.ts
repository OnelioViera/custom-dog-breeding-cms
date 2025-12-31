import mongoose, { Schema, models, Model } from "mongoose";

export interface ISettings {
  _id: string;
  siteName: string;
  siteUrl: string;
  adminEmail: string;
  fromEmail: string;
  replyToEmail: string;
  theme: string;
  primaryColor: string;
  secondaryColor: string;
  enableBackups: boolean;
  backupFrequency: "daily" | "weekly" | "monthly";
  backupRetentionDays: number;
  emailProvider: "resend" | "sendgrid" | "mailgun";
  emailApiKey?: string;
  storageProvider: "r2" | "s3" | "uploadthing";
  navbarStyle: "default" | "centered" | "minimal" | "sticky";
  navbarPosition: "top" | "bottom";
  showNavbar: boolean;
  navbarLogo?: string;
  navbarLogoText?: string;
  buttonStyle: "rounded" | "square" | "pill";
  activeButtonPreset?: string; // Slug of the active button preset
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    siteName: {
      type: String,
      required: true,
      default: "OJV CMS Site",
    },
    siteUrl: {
      type: String,
      required: true,
      default: "http://localhost:3000",
    },
    adminEmail: {
      type: String,
      required: true,
    },
    fromEmail: {
      type: String,
      required: true,
    },
    replyToEmail: {
      type: String,
      required: true,
    },
    theme: {
      type: String,
      default: "modern-breeder",
    },
    primaryColor: {
      type: String,
      default: "#667eea",
    },
    secondaryColor: {
      type: String,
      default: "#764ba2",
    },
    enableBackups: {
      type: Boolean,
      default: true,
    },
    backupFrequency: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      default: "daily",
    },
    backupRetentionDays: {
      type: Number,
      default: 30,
    },
    emailProvider: {
      type: String,
      enum: ["resend", "sendgrid", "mailgun"],
      default: "resend",
    },
    emailApiKey: {
      type: String,
      default: null,
    },
    storageProvider: {
      type: String,
      enum: ["r2", "s3", "uploadthing"],
      default: "r2",
    },
    navbarStyle: {
      type: String,
      enum: ["default", "centered", "minimal", "sticky"],
      default: "default",
    },
    navbarPosition: {
      type: String,
      enum: ["top", "bottom"],
      default: "top",
    },
    showNavbar: {
      type: Boolean,
      default: true,
    },
    navbarLogo: {
      type: String,
      default: null,
    },
    navbarLogoText: {
      type: String,
      default: null,
    },
    buttonStyle: {
      type: String,
      enum: ["rounded", "square", "pill"],
      default: "rounded",
    },
    activeButtonPreset: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Settings: Model<ISettings> =
  models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);

export default Settings;

