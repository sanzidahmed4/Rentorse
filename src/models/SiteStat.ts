import mongoose, { Schema, Model, Document } from "mongoose";
import { ISiteStat } from "@/types";

export interface ISiteStatDocument extends Omit<ISiteStat, "_id" | "id">, Document {}

const SiteStatSchema = new Schema<ISiteStatDocument>(
  {
    activeApartments: { type: String, default: "3,250+" },
    activeRenters: { type: String, default: "12,500+" },
    propertiesListed: { type: String, default: "4,200+" },
    customersServed: { type: String, default: "9,800+" },
    satisfactionRate: { type: String, default: "99.4%" },
    supportEmail: { type: String, default: "leasing@apartmento.us" },
    supportPhone: { type: String, default: "+1 (800) 492-7836" },
  },
  {
    timestamps: true,
  }
);

const SiteStat: Model<ISiteStatDocument> =
  mongoose.models.SiteStat || mongoose.model<ISiteStatDocument>("SiteStat", SiteStatSchema);

export default SiteStat;
