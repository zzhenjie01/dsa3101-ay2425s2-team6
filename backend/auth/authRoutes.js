import express from "express";
import cors from "cors";
import {
  registerUser,
  loginUser,
  logoutUser,
  insertWeights,
  getProfile,
  updateProfile,
  getAvgWeights,
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
router.post("/auth/insertWeights", insertWeights);
router.post("/auth/getAvgWeights", getAvgWeights);
router.get("/auth/getProfile", getProfile);
router.put("/auth/updateProfile", updateProfile);

export default router;
