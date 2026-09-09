import mongoose, { Schema, Model, Document } from "mongoose";
import { IAdminUser } from "@/types";

export interface IAdminUserDocument extends Omit<IAdminUser, "_id" | "id">, Document {}

const AdminUserSchema = new Schema<IAdminUserDocument>(
  {
    username: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true },
    displayName: { type: String, required: true, trim: true },
    role: { type: String, enum: ["admin", "editor"], default: "editor" },
    createdBy: { type: String, default: "sanzid" },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const AdminUser: Model<IAdminUserDocument> =
  mongoose.models.AdminUser || mongoose.model<IAdminUserDocument>("AdminUser", AdminUserSchema);

export default AdminUser;
