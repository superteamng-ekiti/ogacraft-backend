import mongoose, { Schema } from "mongoose";

export type category =
  | "carpentry"
  | "masonry"
  | "electrical"
  | "plumbing"
  | "welding"
  | "painting"
  | "tiling"
  | "roofing"
  | "mechanical"
  | "metalwork"
  | "blacksmithing"
  | "woodwork"
  | "furniture_making"
  | "automobile_repair"
  | "electronics_repair"
  | "upholstery"
  | "glasswork"
  | "flooring"
  | "generator_repair"
  | "air_conditioning"
  | "sewing_tailoring"
  | "cobbler"
  | "bricklaying"
  | "drywall_installation";

interface IUser {
  aritisan: typeof mongoose.Schema.Types.ObjectId;
  client: typeof mongoose.Schema.Types.ObjectId;
  description: string;
  deadline: number;
  location: string;
  budget: string;
  images: string[];
  categories: category[];
}

const JobSchema: Schema<IUser> = new mongoose.Schema({
  aritisan: mongoose.Schema.Types.ObjectId,
  client: mongoose.Schema.Types.ObjectId,
  description: {
    type: String,
    required: [true, "provide description"],
    unique: true
  },
  deadline: Number,
  location: {
    type: String,
    required: [true, "provide location"],
    unique: true
  },
  budget: {
    type: String,
    required: [true, "provide budget"],
    unique: true
  },
  images: [String],
  categories: [String]
});

export default mongoose.model<IUser>("ogacraftjob", JobSchema);
