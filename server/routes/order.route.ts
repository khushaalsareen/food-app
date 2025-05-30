import express from "express"
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { addToCart, clearCart, createCheckoutSession, getCart, getOrders, removeItemFromCart, stripeWebhook } from "../controller/order.controller";
const router = express.Router();

router.route("/").get(isAuthenticated, getOrders);
router.route("/addtocart").post(isAuthenticated, addToCart);
router.route("/removeItemFromCart").post(isAuthenticated, removeItemFromCart);
router.route("/getcart").get(isAuthenticated, getCart);
router.route("/clearCart").post(isAuthenticated, clearCart);
router.route("/checkout/create-checkout-session").post(isAuthenticated, createCheckoutSession);
router.route("/webhook").post(express.raw({ type: 'application/json' }), stripeWebhook);

export default router;