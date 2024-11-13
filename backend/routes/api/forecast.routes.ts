import { getCapabilities, getForecast } from "@controllers/forecast.controller";
import express from "express";
const router = express.Router();

router.get("/getcapabilities", getCapabilities);
router.get("/point", getForecast);

export default router;
