import express from "express";
import reviewController from "../controllers/reviewController.js";
import auth from "../middleware/auth.js";
const router = express.Router();

// Routes
router.post("/", auth, reviewController.createReview);
router.get("/", auth, reviewController.getAllReviews);
router.get("/:id", auth, reviewController.getReviewById);
router.put("/:id", auth, reviewController.updateReview);
router.delete("/:id", auth, reviewController.deleteReview);

export default router;
