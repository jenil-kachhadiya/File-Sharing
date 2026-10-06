import Folder from "../models/folder.model.js";
import File from "../models/file.model.js";
import User from "../models/user.model.js";

export const createFolder = (folderName) => {
  const existingFolders = JSON.parse(localStorage.getItem("Folders")) || [];

  const newFolder = {
    id: crypto.randomUUID(),
    name: folderName,
    parentFolderId: currentFolderId,
  };

  existingFolders.push(newFolder);

  localStorage.setItem("Folders", JSON.stringify(existingFolders));
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

    const parentFolderId = folderId === "root" ? null : folderId;

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
    console.error("GET FOLDER ITEMS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllFolders = async (req, res) => {
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

    const folders = await Folder.find({
      userId: user._id,
    }).sort({ name: 1 });

    return res.status(200).json({
      success: true,
      folders,
    });
  } catch (error) {
    console.error("GET ALL FOLDERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const saveFolders = async (req, res) => {
  try {
    const { userId, folders } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!folders || folders.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No folders found",
      });
    }

    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const folderData = {};
    let remainingFolders = [...folders];

    while (remainingFolders.length > 0) {
      let folderCreated = false;

      for (let i = 0; i < remainingFolders.length; i++) {
        const folder = remainingFolders[i];

        const tempId = folder.tempId;
        const tempParentId = folder.parentFolderId;

        let realParentId = null;

        if (tempParentId) {
          realParentId = folderData[tempParentId];

          if (!realParentId) {
            continue;
          }
        }

        const newFolder = await Folder.create({
          name: folder.name,
          parentFolderId: realParentId,
          userId: user._id,
        });

        if (!newFolder || !newFolder._id) {
          return res.status(500).json({
            success: false,
            message: `Failed to create folder: ${folder.name}`,
          });
        }

        folderData[tempId] = newFolder._id.toString();
        remainingFolders.splice(i, 1);
        i--;

        folderCreated = true;
      }

      if (!folderCreated) {
        return res.status(400).json({
          success: false,
          message: "Invalid folder hierarchy. Parent folder not found.",
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: "Folders saved successfully",
      folderData,
    });
  } catch (error) {
    console.error("SAVE FOLDERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const download = async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await File.findOne({
      _id: fileId,
      userId: req.user.sharedUserId,
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    return res.status(200).json({
      success: true,
      url: file.url,
      fileName: file.name,
    });
  } catch (error) {
    console.error("Download file error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to download file",
    });
  }
};
