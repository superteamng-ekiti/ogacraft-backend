import { Router } from "express";
import { get_categories_controller } from "../controllers/category.ts";
import { getAllArtisans } from "../controllers/user.ts";

const extra_router = Router();

extra_router.get("/categories", get_categories_controller);
extra_router.get("/artisans", getAllArtisans);

export { extra_router };
