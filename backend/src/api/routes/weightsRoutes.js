import router from "./baseRouter.js";
import {
  insertWeights,
  getUserAvgWeights,
  getAllOtherAvgWeights,
} from "../controllers/weightsController.js";

/* 
Defines the API routes based on the semantics of HTTP requests
Uses the helper functions from its respective controller file
*/

router.get("/getUserAvgWeights", getUserAvgWeights);
router.get("/getAllOtherAvgWeights", getAllOtherAvgWeights);
router.post("/insertWeights", insertWeights);

export default router;
