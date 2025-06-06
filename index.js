import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/database.js";
// Route imports
import movieRoutes from "./routes/movieRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const PORT = process.env.PORT || 8000;
const app = express();

connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/movies", movieRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Your API is working!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
