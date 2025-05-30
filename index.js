import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import { movieRoutes, reviewRoutes, userRoutes } from "./routes";

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;
const app = express();

mongoose.connect(MONGO_URI);
app.use(express.json())

// Routes 
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/movies", movieRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
