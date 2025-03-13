import express from "express";
import cors from "cors";
import {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  updateProfile,
} from "./authController.js";

export const router = express.Router();

router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.post("/auth/logout", logoutUser);
router.get("/auth/profile", getProfile);
router.put("/auth/updateProfile", updateProfile);

export default router;
