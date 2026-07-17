import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import skillsRouter from "./skills.js";
import templatesRouter from "./templates.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(skillsRouter);
router.use(templatesRouter);

export default router;
