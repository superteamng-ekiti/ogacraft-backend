import { type Request, type Response } from "express";
import Message from "../schema/Messsage.ts";

export const getJobMessages = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const messages = await Message.find({ job: jobId })
      .populate("sender", "first_name last_name profile_picture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Message.countDocuments({ job: jobId });

    res.status(200).json({
      status: "success",
      message: "Messages fetched",
      response: {
        messages,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    });
    return;
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: "Failed to get messages",
      response: error.message
    });
    return;
  }
};
