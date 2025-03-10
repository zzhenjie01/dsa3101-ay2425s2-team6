import express from "express";
import cors from "cors";
import { registerUser, loginUser, getProfile } from "./authController.js";

export const router = express.Router();

router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.get("/auth/profile", getProfile);

export default router;
