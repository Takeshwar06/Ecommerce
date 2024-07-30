const express = require("express");
const verifyJWT = require("../middlewares/auth.middlewares");
const { placeOrder, getUserOrders, getAllOrders } = require("../controllers/order.controllers");
const verifyAdmin = require("../middlewares/admin.middlewares");

const router = express.Router();

router.route("/place-order").post(verifyJWT,placeOrder);
router.route("/get-user-orders").get(verifyJWT,getUserOrders);
// protected admin routes
router.route("/get-all-orders").get(verifyJWT,verifyAdmin,getAllOrders);
module.exports = router;