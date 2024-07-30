
const asyncHandler = require("../utils/asyncHandler")
const ApiError = require("../utils/ApiError")
const User = require("../models/user.models")
const uploadOnCloudinary = require("../utils/cloudinary")
const ApiResponse = require("../utils/ApiResponse")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

module.exports.registerUser = asyncHandler(async (req, res) => {


    const { email, userName, password } = req.body
    //console.log("email: ", email);

    if (
        [email, userName, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    const user = await User.create({
        email,
        password,
        userName: userName.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

})

module.exports.loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body
    console.log(email);

    if (!email) {
        throw new ApiError(400, "email is required")
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }
    user.role = 'user'
    await user.save()

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")


    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        )

})

module.exports.loginAdmin = asyncHandler(async (req, res) => {

    const { email, password, adminSecret } = req.body
    console.log(email);

    if (!email) {
        throw new ApiError(400, "email is required")
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid || adminSecret !== process.env.ADMIN_SECRET) {
        throw new ApiError(401, "Invalid admin credentials")
    }
    user.role = 'admin'
    await user.save()

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")


    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "Admin logged In Successfully"
            )
        )

})

module.exports.logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "User logged Out"))
})

module.exports.refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")

        }

        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

module.exports.addToCart = asyncHandler(async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        // Check if the product already exists in the cart
        const cartItem = user.cart.find(item => item.productId.toString() === productId);
        if (cartItem) {
            // If the product is already in the cart, increment the quantity
            cartItem.quantity += 1;
        } else {
            // If the product is not in the cart, add it with quantity 1
            user.cart.push({ productId, quantity: 1 });
        }

        // Save the user with the updated cart
        await user.save();

        return res.status(200).json(new ApiResponse(200, user.cart, 'Item added to cart successfully'));
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

module.exports.incrementCartItemQuantity = asyncHandler(async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        // Find the cart item
        const cartItem = user.cart.find(item => item.productId.toString() === productId);
        if (!cartItem) {
            throw new ApiError(404, 'Product not found in cart');
        }

        // Increment the quantity
        cartItem.quantity += 1;

        // Save the user
        await user.save();

        return res.status(200).json(new ApiResponse(200, user.cart, 'Cart item quantity incremented successfully'));
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

module.exports.decrementCartItemQuantity = asyncHandler(async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user._id;

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        // Find the cart item
        const cartItem = user.cart.find(item => item.productId.toString() === productId);
        if (!cartItem) {
            throw new ApiError(404, 'Product not found in cart');
        }

        // Decrement the quantity, ensuring it doesn't drop below 1
        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
        } else {
            throw new ApiError(400, 'Quantity cannot be less than 1');
        }

        // Save the user
        await user.save();

        return res.status(200).json(new ApiResponse(200, user.cart,'Cart item quantity decremented successfully'));
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

module.exports.getCurrentUser = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(404, 'User not found');
    }
    return res.status(200).json(
        new ApiResponse(200,req.user,"")
    )
})

module.exports.getCartItems = asyncHandler(async(req,res)=>{
    try {
        const user = await User.findById(req.user._id)
        .populate('cart.productId')  // Populate product details
        .exec();
        if (!user) {
            throw new ApiError(404, 'User not found');
        }
      return res.status(200).json(new ApiResponse(200, user.cart,'Cart Items retrieved successfully'));
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})