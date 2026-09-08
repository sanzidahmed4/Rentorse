import mongoose, { Schema, Model, Document } from "mongoose";

export interface IAdminLogDocument extends Document {
  username: string;
  ip: string;
  device: string;
  browser: string;
  status: "SUCCESS" | "FAILED";
  createdAt: Date;
}

const AdminLogSchema = new Schema<IAdminLogDocument>(
  {
    username: { type: String, required: true, index: true },
    ip: { type: String, default: "127.0.0.1" },
    device: { type: String, default: "Desktop" },
    browser: { type: String, default: "Unknown" },
    status: { type: String, enum: ["SUCCESS", "FAILED"], required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const AdminLog: Model<IAdminLogDocument> =
  mongoose.models.AdminLog || mongoose.model<IAdminLogDocument>("AdminLog", AdminLogSchema);

export default AdminLog;
