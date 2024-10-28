import path from "path";
import express from "express";
const router = express.Router();
import rootPath from "../rootPath";
import api from "./api/api.routes";

/* ----------------------------------- API ---------------------------------- */
router.use("/api", api);

/* ----------------------------- PUBLIC FOLDERS ----------------------------- */
router.use("/map", express.static(path.join(rootPath, "public", "map")));

/* ------------------------------ 404 HANDLING ------------------------------ */
router.use("*", (_req, res) => {
    res.end("Not found") // temporary
});

export default router;
