import mongoose, { Schema, Model, Document } from "mongoose";
import { IApartment } from "@/types";

export interface IApartmentDocument extends Omit<IApartment, "_id" | "id">, Document {}

const ApartmentSchema = new Schema<IApartmentDocument>(
  {
    serialNumber: { type: Number },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["1B1B", "2B2B", "3B2B", "3B3B"],
      required: true,
    },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    baseRent: { type: Number, required: true },
    squareFeet: { type: Number, required: true },
    furnished: {
      type: String,
      enum: ["Furnished", "Unfurnished", "Either"],
      default: "Unfurnished",
    },
    hasKitchen: { type: Boolean, default: true },
    petPolicy: {
      type: String,
      enum: ["Dogs & Cats Allowed", "Cats Only", "No Pets"],
      default: "Dogs & Cats Allowed",
    },
    amenities: [{ type: String }],
    images: [{ type: String }],
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    deposit: { type: Number, default: 0 },
    availableDate: { type: String, default: "Immediate" },
    rating: { type: Number, default: 4.8 },
    reviewsCount: { type: Number, default: 24 },
    addressTemplate: { type: String, default: "Main St Suite" },
    isManual: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Prevent recompilation of model during HMR
const Apartment: Model<IApartmentDocument> =
  mongoose.models.Apartment || mongoose.model<IApartmentDocument>("Apartment", ApartmentSchema);

export default Apartment;
