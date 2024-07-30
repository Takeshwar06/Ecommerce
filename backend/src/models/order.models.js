const mongoose= require("mongoose");
const { Schema } = mongoose;
const orderItemSchema = new mongoose.Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
})
const orderSchema = new mongoose.Schema({
    orderPrice: {
        type: Number,
        required: true
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    orderItems: [orderItemSchema],
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
        lowercase: true
    },
    razorpay_payment_id:{
        type:String,
        required:true,
    }, 
    razorpay_order_id:{
        type:String,
        required:true,
    },
    razorpay_signature:{
        type:String,
        required:true,
    }, 

}, { timestamps: true })

module.exports = mongoose.model("Order", orderSchema);