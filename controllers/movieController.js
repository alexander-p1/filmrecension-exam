import Movie from "../models/Movie.js";
import Review from "../models/Review.js";

// Create a new movie
const createMovie = async (req, res) => {
  try {
    const { title, director, releaseYear, genre } = req.body;

    // Check if movie already exists
    const existingMovie = await Movie.findOne({
      title: title.trim(),
      director: director.trim(),
      releaseYear,
    });

    if (existingMovie) {
      return res.status(400).json({
        success: false,
        message:
          "Movie with this title, director and release year already exists",
      });
    }

    // Create new movie
    const movie = new Movie({
      title,
      director,
      releaseYear,
      genre,
    });

    await movie.save();

    res.status(201).json({
      success: true,
      message: "Movie created successfully",
      movie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating movie",
      error: error.message,
    });
  }
};

// Get all movies
const getAllMovies = async (req, res) => {
  try {
    const { genre, year, search } = req.query;
    let filter = {};

    // Apply filters if provided
    if (genre) {
      filter.genre = { $regex: genre, $options: "i" };
    }
    if (year) {
      filter.releaseYear = year;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { director: { $regex: search, $options: "i" } },
      ];
    }

    const movies = await Movie.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: movies.length,
      movies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching movies",
      error: error.message,
    });
  }
};

// Get movie by ID
const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.status(200).json({
      success: true,
      movie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching movie",
      error: error.message,
    });
  }
};

// Update movie
const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, director, releaseYear, genre } = req.body;

    // Check if user is admin (assuming only admins can update movies)
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update movies",
      });
    }

    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    // Update movie fields
    movie.title = title || movie.title;
    movie.director = director || movie.director;
    movie.releaseYear = releaseYear || movie.releaseYear;
    movie.genre = genre || movie.genre;

    await movie.save();

    res.status(200).json({
      success: true,
      message: "Movie updated successfully",
      movie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating movie",
      error: error.message,
    });
  }
};

// Delete movie
const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is admin (assuming only admins can delete movies)
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete movies",
      });
    }

    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    // Delete all reviews for this movie first
    await Review.deleteMany({ movieId: id });

    // Delete the movie
    await Movie.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Movie and associated reviews deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting movie",
      error: error.message,
    });
  }
};

// Get all reviews for a specific movie
const getMovieReviews = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if movie exists
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    // Get all reviews for this movie
    const reviews = await Review.find({ movieId: id })
      .populate("userId", "username")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      movie: {
        id: movie._id,
        title: movie.title,
        director: movie.director,
        releaseYear: movie.releaseYear,
        genre: movie.genre,
      },
      totalReviews: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching movie reviews",
      error: error.message,
    });
  }
};

export default {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
  getMovieReviews,
};
