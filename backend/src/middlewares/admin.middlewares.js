// import { ApiError } from "../utils/ApiError.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import jwt from "jsonwebtoken"
// import { User } from "../models/user.model.js";
const ApiError = require("../utils/ApiError")
const asyncHandler =require("../utils/asyncHandler")
const User = require("../models/user.models");

const verifyAdmin = asyncHandler(async(req, _, next) => {
    try {
        
        if (req.user.role !== 'admin') {
            throw new ApiError(401, "Access denied. User is not and admin.")
        }
    
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
    
})

module.exports = verifyAdmin;