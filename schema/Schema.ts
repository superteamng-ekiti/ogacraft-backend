import mongoose, { Schema } from "mongoose";

export const category_list = [
  "carpentry",
  "masonry",
  "electrical",
  "plumbing",
  "welding",
  "painting",
  "tiling",
  "roofing",
  "mechanical",
  "metalwork",
  "blacksmithing",
  "woodwork",
  "furniture_making",
  "automobile_repair",
  "electronics_repair",
  "upholstery",
  "glasswork",
  "flooring",
  "generator_repair",
  "air_conditioning",
  "sewing_tailoring",
  "cobbler",
  "bricklaying",
  "drywall_installation"
] as const;

export type category = (typeof category_list)[number];

export type IAccountype = "artisan" | "client";
export interface IUser {
  auth_id: string;
  wallet_address: string;
  first_name: string;
  last_name: string;
  email: string;
  location: string;
  profile_description: string;
  gender: "m" | "f" | "o";
  profile_picture: string;
  categories: category[];
  years_of_experience: number;
  account_type: IAccountype;
  reviews: IReview[];
}

interface IReview {
  id: typeof mongoose.Schema.Types.ObjectId;
  message: string;
  rating: number;
}

const Review: Schema<IReview> = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "ogacraftuser" },
    message: String,
    rating: Number
  },
  { _id: false }
);

const UserSchema: Schema<IUser> = new mongoose.Schema({
  auth_id: String,
  wallet_address: String,
  email: {
    type: String,
    required: [true, "provide email"],
    unique: true
  },
  first_name: {
    type: String,
    required: [true, "provide first name"]
  },
  last_name: {
    type: String,
    required: [true, "provide last name"]
  },
  location: {
    type: String,
    required: [true, "provide location"]
  },
  profile_description: String,
  gender: {
    type: String,
    required: [true, "provide gender"]
  },
  profile_picture: String,
  categories: [String],
  years_of_experience: Number,
  account_type: String,
  reviews: [Review]
});

export default mongoose.model<IUser>("ogacraftuser", UserSchema);
