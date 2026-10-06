import express from "express";
import { uploadFile, getAllFiles } from "../controllers/file.controller.js";
import upload from "../middlewares/upload.js";
import Auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadFile);
router.get("/all", getAllFiles);

export default router;