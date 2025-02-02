import { Router } from "express";
import * as controller from "../controllers/users.controller";

const router = Router();

router.route("/:name").get(controller.getUserProfile);

export default router;
