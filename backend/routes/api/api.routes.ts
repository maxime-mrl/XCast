import express from "express";
const router = express.Router();

router.get("/test", (_req, res) => {
    res.end("Hello World") // temporary
});

export default router;
