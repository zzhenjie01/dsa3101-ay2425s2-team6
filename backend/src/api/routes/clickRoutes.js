import router from "./baseRouter.js";
import {
  insertClick,
  getUserRecommendations,
} from "../controllers/clickController.js";

/* 
Defines the API routes based on the semantics of HTTP requests
Uses the helper functions from its respective controller file
*/

router.get("/getUserRecommendations", getUserRecommendations);
router.post("/insertClick", insertClick);

export default router;
