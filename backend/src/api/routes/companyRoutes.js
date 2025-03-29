import router from "./baseRouter.js";
import { getAllCompanyData } from "../controllers/companyController.js";

/* 
Defines the API routes based on the semantics of HTTP requests
Uses the helper functions from its respective controller file
*/

router.get("/getAllCompanyData", getAllCompanyData);

export default router;
