import Review from '../models/Review.js';
import Movie from '../models/Movie.js';

// Create a new review
const createReview = async (req, res) => {
  try {
    const { movieId, rating, comment } = req.body;
    const userId = req.user.userId; // From auth middleware

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Check if user already reviewed this movie
    const existingReview = await Review.findOne({ movieId, userId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this movie'
      });
    }

    // Create new review
    const review = new Review({
      movieId,
      userId,
      rating,
      comment
    });

    await review.save();
    
    // Populate movie and user details
    await review.populate('movieId', 'title director');
    await review.populate('userId', 'username');

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      review
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating review',
      error: error.message
    });
  }
};

// Get all reviews
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('movieId', 'title director releaseYear')
      .populate('userId', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

// Get review by ID
const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id)
      .populate('movieId', 'title director releaseYear genre')
      .populate('userId', 'username');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.status(200).json({
      success: true,
      review
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching review',
      error: error.message
    });
  }
};

// Update review
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.userId;

    // Find review
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review or is admin
    if (review.userId.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    // Update review
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    await review.save();
    await review.populate('movieId', 'title director');
    await review.populate('userId', 'username');

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      review
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating review',
      error: error.message
    });
  }
};

// Delete review
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Find review
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review or is admin
    if (review.userId.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    await Review.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error.message
    });
  }
};

export default {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview
};