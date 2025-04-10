import express from "express";
import { getCategories, createCategory, deleteCategory, updateCategory  } from "../controllers/categoriesController.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/create", createCategory);
router.patch("/update/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
