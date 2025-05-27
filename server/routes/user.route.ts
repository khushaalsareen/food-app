import express from "express";
import { checkAuth, forgotPassword, login, logout, resetPassword, signup, updateProfile, verifyEmail } from "../controller/user.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { grantAdminRole } from "../controller/superadmin.controller";
import { isSuperAdmin } from "../middlewares/isSuperAdmin";
import { User } from "../models/user.model";
import { blockAccount } from "../controller/restaurant.controller";

const router = express.Router();

router.route("/check-auth").get(isAuthenticated, checkAuth);
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/verify-email").post(verifyEmail);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
router.route("/profile/update").put(isAuthenticated, updateProfile);
router.post('/grant-admin-role', isAuthenticated, isSuperAdmin, grantAdminRole);
router.post('/block-account', isAuthenticated, isSuperAdmin, blockAccount);
export default router;
