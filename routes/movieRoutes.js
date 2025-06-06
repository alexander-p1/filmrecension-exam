import express from "express";
import {
  createMovie,
  getAllMovies,
  getMovieById,
  getMovieReviews,
  updateMovie,
  deleteMovie,
} from "../controllers/movieController.js";
const router = express.Router();

// Routes
router.post("/", createMovie);
router.get("/", getAllMovies);
router.get("/:id", getMovieById);
router.get("/:id/reviews", getMovieReviews);
router.put("/:id", updateMovie);
router.delete("/:id", deleteMovie);

export default router;
