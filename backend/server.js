import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import userRoute from "./routes/user.route.js";
import folderRoutes from "./routes/folder.route.js";
import fileRoutes from "./routes/file.route.js"
import shareRoutes from "./routes/share.route.js"
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true}));

app.use("/api", userRoute);
app.use("/api/folder", folderRoutes);
app.use("/api/file", fileRoutes);
app.use("/api/share", shareRoutes);


app.get("/", (req, res) => {
    res.json({message: "Backend is Running"})
});

const PORT = process.env.PORT;

app.listen(PORT, ()=> {
    console.log(`Server starting`);   
})