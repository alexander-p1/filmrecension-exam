const auth = async (req, res, next) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID required",
      });
    }

    req.user = { userId };
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Authentication failed",
      error: error.message,
    });
  }
};

export default auth;
