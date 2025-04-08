import express from "express";
import { getCategories, createCategory, deleteCategory } from "../controllers/categoriesController.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/create", createCategory);
//router.put("/:id", updateProduct);
router.delete("/:id", deleteCategory);

export default router;
