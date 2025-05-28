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

export type JobStatus = "open" | "ongoing" | "completed";

interface IUser {
  aritisan: typeof mongoose.Schema.Types.ObjectId;
  client: typeof mongoose.Schema.Types.ObjectId;
  title: string;
  description: string;
  deadline: number;
  location: string;
  budget: string;
  images: string[];
  categories: category[];
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema: Schema<IUser> = new mongoose.Schema(
  {
    aritisan: mongoose.Schema.Types.ObjectId,
    client: mongoose.Schema.Types.ObjectId,
    title: {
      type: String,
      required: [true, "provide title"]
    },
    description: {
      type: String,
      required: [true, "provide description"]
    },
    deadline: Number,
    location: {
      type: String,
      required: [true, "provide location"]
    },
    budget: {
      type: String,
      required: [true, "provide budget"]
    },
    images: [String],
    categories: [String],
    status: {
      type: String,
      enum: ["open", "ongoing", "completed"],
      default: "open"
    }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("ogacraftjob", JobSchema);
