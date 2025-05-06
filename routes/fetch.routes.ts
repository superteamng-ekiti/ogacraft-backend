import { Router } from "express";
import { get_categories_controller } from "../controllers/category.ts";

const extra_router = Router();

extra_router.get("/categories", get_categories_controller);

export { extra_router };
