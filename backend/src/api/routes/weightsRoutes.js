import router from "./baseRouter.js";
import {
  insertWeights,
  getUserAvgWeights,
  getAllOtherAvgWeights,
} from "../controllers/weightsController.js";

router.get("/getUserAvgWeights", getUserAvgWeights);
router.get("/getAllOtherAvgWeights", getAllOtherAvgWeights);
router.post("/insertWeights", insertWeights);

export default router;
