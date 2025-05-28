import mongoose, { Schema } from "mongoose";

interface IMessage {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  job: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema<IMessage> = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ogacraftuser",
      required: true
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ogacraftuser",
      required: true
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ogacraftjob",
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model<IMessage>("Message", MessageSchema);
