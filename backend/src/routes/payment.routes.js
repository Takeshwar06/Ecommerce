const express=require('express');
const { ordergenerate, paymentVarification, getkey, paymentSuccess } = require('../controllers/payment.controllers');
const verifyJWT = require('../middlewares/auth.middlewares');

const router=express.Router();

router.route("/getkey").get(verifyJWT,getkey);
router.route("/ordergenerate").post(verifyJWT,ordergenerate);
router.route("/paymentsuccess").post(verifyJWT,paymentSuccess);


module.exports= router;