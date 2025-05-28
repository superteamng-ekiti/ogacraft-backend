import express from "express";
import { getJobMessages } from "../controllers/message.ts";

const message_router = express.Router();

message_router.get("/:jobId", getJobMessages);

export { message_router };
