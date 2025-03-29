import router from "./baseRouter.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  updateProfile,
} from "../controllers/authController.js";

/* 
Defines the API routes based on the semantics of HTTP requests
Uses the helper functions from its respective controller file
*/

router.get("/getProfile", getProfile);
router.put("/updateProfile", updateProfile);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;
