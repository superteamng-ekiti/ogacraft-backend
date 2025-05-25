// middleware/validateCategories.ts
import { type Request, type Response, type NextFunction } from "express";
import { category_list as validCategories } from "../schema/Schema.ts";

export const validateCategories = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { categories } = req.body;

  if (!categories) {
    res.status(400).json({
      status: "fail",
      message: "Missing categories in required fields",
      response: null
    });
    return;
  }
  categories = categories.split(",");

  if (!Array.isArray(categories)) {
    res.status(400).json({
      status: "fail",
      message: "Categories must be an array",
      response: null
    });
    return;
  }

  const invalid = categories.filter((cat) => !validCategories.includes(cat));

  if (invalid.length > 0) {
    res.status(400).json({
      status: "fail",
      message: "Invalid categories provided",
      response: invalid
    });
    return;
  }

  return next();
};
