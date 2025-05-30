import express from "express"
import movieController from "../controllers/movieController.js"
import auth from "../middleware/auth.js"
const router = express.Router()

// Routes
router.post("/", auth, movieController.createMovie)
router.get("/", auth, movieController.getAllMovies)
router.get("/:id", auth, movieController.getMovieById)
router.get("/:id/reviews", auth, movieController.getMovieReviews)
router.put("/:id", auth, movieController.updateMovie)
router.delete("/:id", auth, movieController.deleteMovie)




export default router;