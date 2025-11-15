import express from "express";
import { registerUser, loginUser, validate, dashboard, sendotp } from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/sendotp", sendotp);
router.post("/validate", validate);
router.get("/", protect, dashboard);


export default router;
