import mongoose, { Schema, Model, Document } from "mongoose";
import { ILead } from "@/types";

export interface ILeadDocument extends Omit<ILead, "_id" | "id">, Document {}

const LeadSchema = new Schema<ILeadDocument>(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    isUsResident: { type: Boolean, required: true },
    age: { type: Number, required: true },
    familyMembers: { type: Number, required: true },
    hasPets: { type: Boolean, required: true },
    petDetails: { type: String, default: "" },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    furnished: {
      type: String,
      enum: ["Furnished", "Unfurnished", "Either"],
      default: "Either",
    },
    kitchenRequired: { type: Boolean, default: true },
    amenities: [{ type: String }],
    budgetMin: { type: Number, required: true },
    budgetMax: { type: Number, required: true },
    creditScore: { type: String, default: "Good (660 - 719)" },
    matchedApartments: [{ type: String }],
    selectedApartmentId: { type: String },
    selectedApartmentTitle: { type: String, default: "" },
    selectedApartmentPrice: { type: Number },
    serialNumber: { type: Number },
    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Matched", "Converted", "Closed"],
      default: "New",
    },
    notes: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const Lead: Model<ILeadDocument> =
  mongoose.models.Lead || mongoose.model<ILeadDocument>("Lead", LeadSchema);

export default Lead;
