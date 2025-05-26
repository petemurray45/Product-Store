import express from "express";
import {
  deleteProduct,
  getAllProducts,
  updateProduct,
  getProduct,
  createProduct,
} from "../controllers/productController.js";

import { get } from "http";

const router = express.Router();

router.get("/", getAllProducts);
router.post("/", createProduct);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
