import { getCapabilities } from "@controllers/map.controller";
import express from "express";
const router = express.Router();

router.get("/getcapabilities", getCapabilities);

export default router;
