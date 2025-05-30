import express from "express"
import { blockAccount, createRestaurant, getAllBlockedRestaurants, getAllRestaurants, getRestaurant, getRestaurantOrder, getSingleRestaurant, rateRestaurant, searchRestaurant, unBlockAccount, updateOrderStatus, updateRestaurant } from "../controller/restaurant.controller";
import upload from "../middlewares/multer";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isSuperAdmin } from "../middlewares/isSuperAdmin";

const router = express.Router();

router.route("/").post(isAuthenticated, upload.single("imageFile"), createRestaurant);
router.route("/").get(isAuthenticated, getRestaurant);
router.route("/all").get(isAuthenticated, getAllRestaurants);
router.route("/blocked").get(isAuthenticated, isSuperAdmin, getAllBlockedRestaurants);
router.route("/").put(isAuthenticated, upload.single("imageFile"), updateRestaurant);
router.route("/order").get(isAuthenticated, getRestaurantOrder);
router.route("/order/:orderId/status").put(isAuthenticated, updateOrderStatus);
router.route("/search/:searchText").get(isAuthenticated, searchRestaurant);
router.route("/:id").get(isAuthenticated, getSingleRestaurant);
router.post('/block-account', isAuthenticated, isSuperAdmin, blockAccount);
router.post('/unblock-account', isAuthenticated, isSuperAdmin, unBlockAccount);
router.post('/rate', isAuthenticated, rateRestaurant);
export default router;



