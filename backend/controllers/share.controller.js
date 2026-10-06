import User from "../models/user.model.js";
import File from "../models/file.model.js";
import Folder from "../models/folder.model.js";
import bcrypt from "bcrypt";


export const receiveLogin = async (req, res) => {
  try {
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({
        success: false,
        message: "User ID and password are required",
      });
    }

    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid User ID or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid User ID or password",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Receiver access granted",
      userId: user.userId,
    });
  } catch (error) {
    console.error("Receive login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const getFolderItems = async (req, res) => {
  try {
    const { folderId } = req.params;
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

    const parentFolderId =
      folderId === "root" ? null : folderId;

    const folders = await Folder.find({
      userId: user._id,
      parentFolderId,
      name: { $ne: "Root" },
    }).sort({ name: 1 });

    const files = await File.find({
      userId: user._id,
      parentFolderId,
    }).sort({ name: 1 });

    return res.status(200).json({
      success: true,
      folders,
      files,
    });
  } catch (error) {
    console.error("Get shared folder error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load shared files",
    });
  }
};


export const downloadFile = async (req, res) => {
  try {
    const { fileId } = req.params;
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

    const file = await File.findOne({
      _id: fileId,
      userId: user._id,
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    if (!file.url) {
      return res.status(404).json({
        success: false,
        message: "File URL not found",
      });
    }

    return res.status(200).json({
      success: true,
      url: file.url,
      name: file.name,
    });
  } catch (error) {
    console.error("Download error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to download file",
    });
  }
};