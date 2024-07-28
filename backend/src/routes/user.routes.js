const express = require("express");
const { registerUser, 
    loginUser, 
    loginAdmin, 
    logoutUser, 
    refreshAccessToken, 
    addToCart,
    incrementCartItemQuantity,
    decrementCartItemQuantity
} = require("../controllers/user.controllers");
const verifyJWT = require("../middlewares/auth.middlewares");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/login-admin").post(loginAdmin);
router.route("/refresh-token").post(refreshAccessToken);
// protect user route
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/cart/add").post(verifyJWT,addToCart);
router.route("/cart/increament").post(verifyJWT,incrementCartItemQuantity);
router.route("/cart/decreament").post(verifyJWT,decrementCartItemQuantity);
module.exports = router;