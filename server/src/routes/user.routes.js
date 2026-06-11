import express from "express";
import { login, register, checkUser, detailsUser, deleteAUser, googleAuth } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { userRegisterSchema, userLoginSchema, googleAuthSchema } from "../validators/index.js";

const router = express.Router();

router.post("/google-auth", validate(googleAuthSchema), googleAuth);
router.post("/create", validate(userRegisterSchema), register);
router.post("/login", validate(userLoginSchema), login);
router.get("/check", checkUser);
router.get("/:id", protect, detailsUser);
router.delete("/:id", protect, deleteAUser);

export default router;
