import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const Auth = async (req, res, next) => {
  try {
    const userId = req.cookies.senderToken;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Send user not found",
      });
    }

    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("SEND USER AUTH ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export default Auth;