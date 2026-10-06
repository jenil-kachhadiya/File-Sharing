import express from "express";
import { checkAccount, signup } from "../controllers/user.controller.js";
const router = express.Router();

router.post("/signup", signup);
router.get("/check-account", checkAccount);

export default router;