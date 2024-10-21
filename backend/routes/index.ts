import express from "express";
const router = express.Router();

/* ----------------------------------- API ---------------------------------- */
router.use("api/", require("./api/api.routes.js"));

export default router;
