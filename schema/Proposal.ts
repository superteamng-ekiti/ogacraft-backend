import mongoose, { Schema } from "mongoose";

export type ProposalStatus = "pending" | "accepted" | "rejected";

interface IProposal {
  job: mongoose.Types.ObjectId;
  artisan: mongoose.Types.ObjectId;
  client: mongoose.Types.ObjectId;
  message: string;
  status: ProposalStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ProposalSchema: Schema<IProposal> = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ogacraftjob",
      required: true
    },
    artisan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ogacraftuser",
      required: true
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ogacraftuser",
      required: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model<IProposal>("Proposal", ProposalSchema);
