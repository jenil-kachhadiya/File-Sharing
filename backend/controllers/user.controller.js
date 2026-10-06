import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { nanoid } from "nanoid";
import Folder from "../models/folder.model.js";

export const signup = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    let userId;

    do {
      userId = nanoid(15);
    } while (await User.exists({ userId }));

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      userId,
      password: hashedPassword,
    });

    await Folder.create({
      name: "Root",
      parentFolderId: null,
      userId: user._id,
    });

    res.cookie("senderToken", user.userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      secure: false,
    });

    return res.status(201).json({
      success: true,
      message: "Send user created successfully",
      userId: user.userId,
    });
  } catch (error) {
    console.error("CREATE SEND USER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const checkAccount = async (req, res) => {
  try {
    const userId = req.cookies.senderToken;

    if (!userId) {
      return res.json({success: true,exists: false});
    }

    const user = await User.findOne({ userId });

    if (!user) {
      return res.json({success: true,exists: false});
    }
    return res.json({success: true,exists: true,userId: user.userId});
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};