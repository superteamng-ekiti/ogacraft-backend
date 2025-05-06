import {
  response,
  type NextFunction,
  type Request,
  type Response
} from "express";
import { category_list } from "../schema/Schema.ts";

const get_categories_controller = async (req: Request, res: Response) => {
  res.status(200).json({
    response: category_list,
    message: "that went well.. 🙂"
  });
  return;
};

export { get_categories_controller };
