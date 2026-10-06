import cloudinary from "../config/cloudinary.js";
import File from "../models/file.model.js";
import User from "../models/user.model.js";

export const uploadFile = async (req, res) => {
  try {
    const { userId, parentFolderId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto", folder: "file-sharing",
    });

    const newFile = await File.create({
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
      url: result.secure_url,
      publicId: result.public_id,
      parentFolderId: parentFolderId || null,
      userId: user._id,
    });

    return res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      file: newFile,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAllFiles = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const files = await File.find({userId: user._id}).sort({ name: 1 });

    return res.status(200).json({
      success: true,
      files,
    });
  } catch (error) {
    console.error("GET ALL FILES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};