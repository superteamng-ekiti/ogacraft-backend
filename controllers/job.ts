// controllers/jobController.ts
import { type Request, type Response } from "express";
import Job, { type JobStatus } from "../schema/Job.ts";
import { type category } from "../schema/Schema.ts";
import Proposal from "../schema/Proposal.ts";

export const createJob = async (req: Request, res: Response) => {
  try {
    let {
      client,
      title,
      description,
      deadline,
      location,
      budget,
      images,
      categories,
      status
    } = req.body;

    if (!description || !location || !budget || !categories || !title) {
      res.status(400).json({
        status: "fail",
        message: "Missing required fields",
        response: null
      });
      return;
    }

    const job = await Job.create({
      client,
      description,
      deadline,
      location,
      budget,
      images,
      categories,
      title,
      status: status || "open"
    });

    res.status(201).json({
      status: "success",
      message: "Job created successfully",
      response: job
    });
    return;
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to create job",
      response: error
    });
    return;
  }
};

export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const { location, categories } = req.query;

    const filter: Record<string, any> = {};

    if (location) {
      filter.location = { $regex: new RegExp(location as string, "i") }; // case-insensitive match
    }

    if (categories) {
      const categoryList = Array.isArray(categories)
        ? categories
        : (categories as string).split(",");

      filter.categories = { $in: categoryList };
    }

    const jobs = await Job.find(filter).skip(skip).limit(limit);
    const total = await Job.countDocuments(filter);

    res.status(200).json({
      status: "success",
      message: "Jobs fetched successfully",
      response: {
        jobs,
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
      message: "Failed to fetch jobs",
      response: error.message
    });
    return;
  }
};

export const getAllJobsByClient = async (req: Request, res: Response) => {
  try {
    const { client_id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Validate client_id
    if (!client_id) {
      res.status(400).json({
        status: "fail",
        message: "Client ID is required",
        response: null
      });
      return;
    }

    // Find jobs by client with pagination and populate artisan details
    const jobs = await Job.find({ client: client_id })
      .populate({
        path: "aritisan",
        select:
          "first_name last_name email location profile_description profile_picture categories years_of_experience reviews" // Select only necessary fields
      })
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Job.countDocuments({ client: client_id });

    res.status(200).json({
      status: "success",
      message: "Jobs fetched successfully",
      response: {
        jobs,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    });
    return;
  } catch (error) {
    console.error("Error fetching client jobs:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch client jobs",
      response: error instanceof Error ? error.message : String(error)
    });
    return;
  }
};

export const getJobById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job) {
      res.status(404).json({
        status: "fail",
        message: "Job not found",
        response: null
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Job fetched successfully",
      response: job
    });
    return;
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch job",
      response: error
    });
    return;
  }
};

export const updateJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);
    if (!job) {
      res.status(404).json({
        status: "fail",
        message: "Job not found",
        response: null
      });
      return;
    }

    const {
      description,
      deadline,
      location,
      budget,
      images,
      categories,
      status
    }: {
      description?: string;
      deadline?: number;
      location?: string;
      budget?: string;
      images?: string[];
      categories?: string[];
      status?: JobStatus;
    } = req.body;

    if (description !== undefined) job.description = description;
    if (deadline !== undefined) job.deadline = deadline;
    if (location !== undefined) job.location = location;
    if (budget !== undefined) job.budget = budget;
    if (images !== undefined) job.images = images;
    if (categories !== undefined) job.categories = categories as category[];
    if (status !== undefined) job.status = status;

    const updated = await job.save();

    res.status(200).json({
      status: "success",
      message: "Job updated successfully",
      response: updated
    });
    return;
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: "Failed to update job",
      response: error.message
    });
    return;
  }
};

export const deleteJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Job.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({
        status: "fail",
        message: "Job not found",
        response: null
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Job deleted successfully",
      response: null
    });
    return;
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to delete job",
      response: error
    });
    return;
  }
};

export const getJobProposals = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const proposals = await Proposal.find({ job: jobId }).populate(
      "artisan",
      "first_name last_name profile_picture categories years_of_experience"
    );

    res.status(200).json({
      status: "success",
      message: "Proposals fetched",
      response: proposals
    });
    return;
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: "Failed to get proposals",
      response: error.message
    });
    return;
  }
};
