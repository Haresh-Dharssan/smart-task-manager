import express from "express";
import { registerUser, loginUser, validate, dashboard } from "../controllers/userController.js";
import { sendPhoneOtp, sendEmailOtp, verifyOtp} from "../controllers/otpVerification.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/send-phone-otp", sendPhoneOtp);
router.post("/send-email-otp", sendEmailOtp);
router.post("/validate", validate);
router.post("/verifyotp", verifyOtp);
router.get("/", protect, dashboard);


export default router;
