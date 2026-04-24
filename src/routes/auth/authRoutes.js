import express from "express";
import * as authController from "../../controllers/auth/authenticationController.js";
import { loginSchema, registerSchema } from "../../utils/validationSchemas.js";
import { validate } from "../../middlewares/validationMiddleware.js";

const router = express.Router();

router.get("/register", authController.showRegisterForm);
router.post("/register", validate(registerSchema), authController.register);

router.post("verify-email", authController.verifyEmail)

router.get("/login", authController.showLoginForm);
router.post("/login", validate(loginSchema), authController.login);

router.post("/logout", authController.logout);

export default router;