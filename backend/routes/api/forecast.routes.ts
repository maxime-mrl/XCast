import { getCapabilities } from "@controllers/forecast.controller";
import express from "express";
const router = express.Router();

router.get("/getcapabilities", getCapabilities);

export default router;
