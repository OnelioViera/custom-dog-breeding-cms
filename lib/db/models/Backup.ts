import mongoose, { Schema, models, Model } from "mongoose";

export interface IBackup {
  _id: string;
  filename: string;
  size: number;
  type: "automatic" | "manual";
  storageUrl: string;
  createdBy?: mongoose.Types.ObjectId;
  status: "completed" | "in-progress" | "failed";
  error?: string;
  createdAt: Date;
}

const BackupSchema = new Schema<IBackup>(
  {
    filename: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["automatic", "manual"],
      required: true,
    },
    storageUrl: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["completed", "in-progress", "failed"],
      default: "completed",
    },
    error: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
BackupSchema.index({ createdAt: -1 });

const Backup: Model<IBackup> = models.Backup || mongoose.model<IBackup>("Backup", BackupSchema);

export default Backup;

