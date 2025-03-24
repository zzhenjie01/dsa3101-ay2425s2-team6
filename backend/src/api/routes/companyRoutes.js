import router from "./baseRouter.js";
import { getAllCompanyData } from "../controllers/companyController.js";

router.get("/getAllCompanyData", getAllCompanyData);

export default router;
