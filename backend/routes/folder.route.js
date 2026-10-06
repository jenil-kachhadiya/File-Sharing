import express from "express";
import {createFolder,getFolderItems,getAllFolders, saveFolders} from "../controllers/folder.controller.js";
import Auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/", createFolder);
router.post("/save", saveFolders);
router.get("/:folderId", getFolderItems);
router.get("/", getAllFolders);

export default router;
