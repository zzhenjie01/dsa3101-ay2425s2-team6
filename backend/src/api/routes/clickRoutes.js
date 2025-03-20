import router from "./baseRouter.js";
import {
  insertClick,
  getUserRecommendations,
} from "../controllers/clickController.js";

router.get("/getUserRecommendations", getUserRecommendations);
router.post("/insertClick", insertClick);

export default router;
