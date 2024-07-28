const mongoose = require("mongoose");
const bcrypt= require("bcrypt");
const jwt = require("jsonwebtoken");
const { Schema } = mongoose;

const cartItemSchema = new mongoose.Schema({
    productId:{
        type: Schema.Types.ObjectId,
        ref: "Product",
    },
    quantity:{
        type:Number,
        required:true
    }
})
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    address: {
        type: String,
        default: "",
    },
    cart: [cartItemSchema],
    refreshToken: {
        type: String
    }

},{timestamps:true})

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            role:this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
module.exports = mongoose.model("User", userSchema);