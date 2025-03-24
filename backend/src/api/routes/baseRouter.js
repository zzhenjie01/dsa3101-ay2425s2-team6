import express from "express";
import cors from "cors";

export const router = express.Router();

router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

export default router;
