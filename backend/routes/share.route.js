import express from "express";

import { receiveLogin, getFolderItems, downloadFile } from "../controllers/share.controller.js";

const router = express.Router();

router.post("/receive-login",receiveLogin);
router.get("/folder/:folderId" ,getFolderItems);
router.get("/file/:fileId/download" ,downloadFile);

export default router;