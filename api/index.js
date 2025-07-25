import express from "express";
import fs from "fs";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import path from "path";
//import { logEvents, logger } from "./middleware/logger.js";
import { corsOptions } from "./config/corsOptions.js";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, "uploads");
const avatarsDir = path.join(__dirname, "assets", "avatars");
const coursesDir = path.join(__dirname, "assets", "courses");
const projectsDir = path.join(__dirname, "assets", "projects");

const directories = [uploadsDir, avatarsDir, coursesDir, projectsDir];

function createDirectoryIfNotExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
    console.log(`Created directory: ${directory}`);
  } else {
    console.log(`Directory already exists: ${directory}`);
  }
}

directories.forEach(createDirectoryIfNotExists);

const PORT = process.env.PORT || 3000;

// Routes
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import lessonRoutes from "./routes/lesson.routes.js";
import courseRoutes from "./routes/course.routes.js";
import masterRoutes from "./routes/master.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import projectRoutes from "./routes/project.routes.js";

function startServer() {
  const app = express();

  // Middleware
  //app.use(logger);
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(cookieParser());

  // Static Files
  app.use(express.static(path.join(__dirname, "assets")));

  // Routes
  app.use("/api/users", userRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/lessons", lessonRoutes);
  app.use("/api/courses", courseRoutes);
  app.use("/api/masters", masterRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/profiles", profileRoutes);
  app.use("/api/projects", projectRoutes);

  // 404
  app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts("json")) {
      res.json({ message: "404 Not Found" });
    } else {
      res.type("txt").send("404 Not Found");
    }
  });

  // Error Handling
  app.use((err, req, res, next) => {
    // logEvents(
    //   `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    //   "errLog.log"
    // );
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res
      .status(statusCode)
      .json({ success: false, statusCode, message, isError: true });
  });

  app.listen(PORT, () => {
    const baseURL =
      process.env.NODE_ENV === "production"
        ? `${process.env.SERVER_URL}`
        : `http://localhost:${PORT}`;

    console.log(`Listening on ${baseURL}`);
  });
}

// Connect to MongoDB
console.log(`Connecting to ${process.env.DB_HOST}`);
mongoose
  .connect(process.env.DB_HOST)
  .then(() => {
    console.log("Connected to MongoDB");
    startServer();
  })
  .catch((err) => {
    console.log("Could not connect to MongoDB");
    console.log(err);
    // logEvents(
    //   `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    //   "mongoErrLog.log"
    // );
  });
