import express from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getAllJobsByClient
} from "../controllers/job.ts";
import { validateCategories } from "../middleware/job.ts";
import { authenticated } from "../middleware/auth.ts";

const job_router = express.Router();

job_router.post("/", authenticated, validateCategories, createJob);
job_router.get("/", getAllJobs);
job_router.get("/client/:client_id", getAllJobsByClient);
job_router.get("/:id", getJobById);
job_router.put("/:id", authenticated, validateCategories, updateJob);
job_router.delete("/:id", authenticated, deleteJob);

export { job_router };
