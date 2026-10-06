import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import userRoute from "./routes/user.route.js";
import folderRoutes from "./routes/folder.route.js";
import fileRoutes from "./routes/file.route.js";
import shareRoutes from "./routes/share.route.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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


const frontendPath = path.join(__dirname, "../frontend/dist");

app.use(express.static(frontendPath));

app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});