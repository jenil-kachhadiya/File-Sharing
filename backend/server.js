import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";

import userRoute from "./routes/user.route.js";
import folderRoutes from "./routes/folder.route.js";
import fileRoutes from "./routes/file.route.js";
import shareRoutes from "./routes/share.route.js";

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://file-sharing-sage.vercel.app",
    ],
    credentials: true,
  })
);


app.use("/api", userRoute);

app.use("/api/folder", folderRoutes);

app.use("/api/file", fileRoutes);

app.use("/api/share", shareRoutes);


app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running",
  });
});

export default app;