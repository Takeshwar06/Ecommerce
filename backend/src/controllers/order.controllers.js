const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const Product = require("../models/product.models");
const Order = require("../models/order.models");


module.exports.placeOrder = asyncHandler(async (req, res) => {
    try {
        const { orderItems } = req.body;
        const customerId = req.user._id;

        // Validate order items
        if (!orderItems || orderItems.length === 0) {
            return next(new ApiError(400, 'Order items are required'));
        }

        // Fetch product details and calculate order price
        let orderPrice = 0;
        for (let item of orderItems) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return next(new ApiError(404, `Product with ID ${item.productId} not found`));
            }
            orderPrice += product.price * item.quantity;
        }

        //  TODO: first check payment and its status\

        // Create a new order
        const newOrder = new Order({
            orderPrice,
            customer: customerId,
            orderItems,
            paymentStatus: "TODO:"
        });

        // Save the order to the database
        const savedOrder = await newOrder.save();
        return res.status(201).json(new ApiResponse(201, savedOrder, 'Order placed successfully'));
    } catch (error) {
        throw new ApiError(500, error?.message || "Internal server error !!");
    }
})

module.exports.getUserOrders = asyncHandler(async (req, res) => {
    try {
        const customerId = req.user._id;

        // Find all orders for the logged-in user
        const orders = await Order.find({ customer: customerId })
            .populate('orderItems.productId')  // Populate product details
            .exec();

        return res.status(200).json(new ApiResponse(200, orders, 'Orders retrieved successfully'));
    } catch (error) {
        throw new ApiError(500, error?.message || "Internal server error !!");
    }
})

module.exports.getAllOrders = asyncHandler(async(req,res)=>{
    try {
        const orders = await Order.find()
        .populate({
          path: 'orderItems.productId',  // Populate product details
          select: ''  
        })
        .populate({
          path: 'customer',
          select: '-password -refreshToken -cart -role'  // Exclude some fields
        })
        .exec();
  
      return res.status(200).json(new ApiResponse(200, orders,'Orders retrieved successfully',));
    } catch (error) {
        throw new ApiError(500, error?.message || "Internal server error !!");
    }
})