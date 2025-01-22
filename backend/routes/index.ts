import path from "path";
import express from "express";
const router = express.Router();
import rootPath from "@rootPath";
import mapRoutes from "./api/forecast.routes";
import userRoutes from "./api/users.routes";

/* ----------------------------------- API ---------------------------------- */
router.use("/api/forecast", mapRoutes);
router.use("/api/user", userRoutes);

/* ----------------------------- PUBLIC FOLDERS ----------------------------- */
router.use("/map", express.static(path.join(rootPath, "public", "map")));

/* ------------------------------ 404 HANDLING ------------------------------ */
router.use("*", () => {
  throw { status: 404 };
});

export default router;
