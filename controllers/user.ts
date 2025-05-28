import { type Request, type Response } from "express"
import UserSchema from "../schema/Schema.ts"

export const getAllArtisans = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const { location, categories } = req.query

    const filter: Record<string, any> = {
      account_type: "artisan"
    }

    if (location) {
      filter.location = { $regex: new RegExp(location as string, "i") }
    }

    if (categories) {
      const categoryList = Array.isArray(categories)
        ? categories
        : (categories as string).split(",")

      filter.categories = { $in: categoryList }
    }

    const artisans = await UserSchema.find(filter)
      .select("-auth_id -wallet_address") // Exclude sensitive fields
      .skip(skip)
      .limit(limit)

    const total = await UserSchema.countDocuments(filter)

    res.status(200).json({
      status: "success",
      message: "Artisans fetched successfully",
      response: {
        artisans,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    })
    return
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch artisans",
      response: error.message
    })
    return
  }
} 