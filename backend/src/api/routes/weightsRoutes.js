import router from "./baseRouter.js";
import {
  insertWeights,
  getUserAvgWeights,
  getAllAvgWeights,
} from "../controllers/weightsController.js";

router.get("/getAllAvgWeights", getAllAvgWeights);
router.post("/insertWeights", insertWeights);
router.post("/getUserAvgWeights", getUserAvgWeights);

export default router;
