const crypto = require('crypto')
const Razorpay = require('razorpay')
const Payment = require("../models/payment.models");
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const Product = require("../models/product.models")
const Order = require("../models/order.models")
require("dotenv").config();

module.exports.getkey = asyncHandler(async (req, res) => {
    try {
        res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
    } catch (error) {
        throw new ApiError(500, error?.message || "Internal server error !!")
    }
})
module.exports.ordergenerate = asyncHandler(async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_API_KEY,
            key_secret: process.env.RAZORPAY_API_SECRET
        })
        const options = {
            amount: req.body.amount * 100,
            currency: "INR",
        }
        const order = await instance.orders.create(options)

        res.status(200).json({ success: true, order })

    } catch (error) {
        throw new ApiError(500, error?.message || "Internal server error !!")
    }
}
)

module.exports.paymentSuccess = asyncHandler(async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        console.log(razorpay_order_id, razorpay_payment_id);
        if (!body) {
            throw new ApiError(400, "Invailid payment creadicial !!");
        }
        const expectedSignature = crypto   // after run  sha256 algo must be equal razorpay_signature and expectedSignature
            .createHmac('sha256', process.env.RAZORPAY_API_SECRET)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature; // this

        if (!isAuthentic) {
            throw new ApiError(401, "Unauthorized payment creadicial!")
        }
    console.log(req.body.orderItems,"orderitems");
        const { orderItems } = req.body;
        const customerId = req.user._id;

        // Validate order items
        if (!orderItems || orderItems.length === 0) {
            throw new ApiError(400, 'Order items are required');
        }

        // Fetch product details and calculate order price
        let orderPrice = 0;
        for (let item of orderItems) {
            const product = await Product.findById(item.productId._id);
            if (!product) {
                throw new ApiError(404, `Product with ID ${item.productId} not found`);
            }
            orderPrice += product.price * item.productId.quantity;
        }

        //  TODO: first check payment and its status\

        // Create a new order
        const newOrder = new Order({
            orderPrice,
            customer: customerId,
            orderItems,
            paymentStatus: "completed",
            razorpay_payment_id, razorpay_order_id, razorpay_signature 
        });

        // Save the order to the database
        const savedOrder = await newOrder.save();
        return res.status(201).json(new ApiResponse(201, savedOrder, 'Order placed successfully'));
    } catch (error) {
        throw new ApiError(500, error?.message || "Internal server error !!")
    }
})