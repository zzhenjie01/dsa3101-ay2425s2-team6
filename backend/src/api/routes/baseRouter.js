import express from "express";
import cors from "cors";

/* 
Defines the base router that all other routers use
To prevent redundant definition of the router in the other files
*/

export const router = express.Router();

router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

export default router;
