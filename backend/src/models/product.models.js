const mongoose = require("mongoose");
const { Schema } = mongoose;
const productSchema = new mongoose.Schema({
    productName: { 
        type: String, 
        required: true, 
        lowercase: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    productImage:{
        type:String,
        default:""
    },
    stockQuantity: { 
        type: Number, 
        required: true 
    },

},{timestamps:true})

module.exports = mongoose.model("Product", productSchema);