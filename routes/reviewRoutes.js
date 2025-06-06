import express from "express";
import {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import auth from "../middleware/auth.js";
const router = express.Router();

// Routes
router.post("/", auth, createReview);
router.get("/", getAllReviews);
router.get("/:id", getReviewById);
router.put("/:id", auth, updateReview);
router.delete("/:id", auth, deleteReview);

export default router;
