const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const Product = require("../models/product.models");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const ApiResponse = require("../utils/ApiResponse")

module.exports.createProduct = asyncHandler(async (req, res) => {
    try {
        const { productName, description, price, stockQuantity } = req.body;
        // console.log(productName, description, price, stockQuantity)
        if (
            [productName, description].some((field) => field?.trim() === "") ||
            !price || !stockQuantity
        ) {
            throw new ApiError(400, "All fields are required")
        }


        const existedPrduct = await Product.findOne({ productName })

        if (existedPrduct) {
            throw new ApiError(409, "Product already exists")
        }

        const productImageLocalPath = req.file?.path;
        console.log(req.file)
        if (!productImageLocalPath) {
            throw new ApiError(400, "Product image file is required")
        }

        const productImage = await uploadOnCloudinary(productImageLocalPath)

        if (!productImage) {
            throw new ApiError(400, "Error while uploading product Image")
        }


        const product = await Product.create({
            productName,
            productImage: productImage.url,
            description,
            price: Number(price),
            stockQuantity: Number(stockQuantity)
        })

        if (!product) {
            throw new ApiError(500, "Something went wrong while creating product")
        }

        return res.status(201).json(
            new ApiResponse(200, product, "Product created Successfully")
        )
    } catch (error) {
        throw new ApiError(500, error?.message || "Internal server error !!")
    }
})

module.exports.getAllProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find();
        console.log(products);
        res.status(200).json( new ApiResponse(200, products, "succefully retrive data"));
    } catch (error) {
        throw new ApiError(500, error?.message || "Internal server error !!");
    }
})

module.exports.updateProductImage = asyncHandler(async (req, res) => {
    try {

        const productImageLocalPath = req.file?.path;

        if (!productImageLocalPath) {
            return next(new ApiError(400, "Product image file is required"));
        }

        const productImage = await uploadOnCloudinary(productImageLocalPath);

        if (!productImage) {
            return next(new ApiError(400, "Error while uploading product image"));
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { productImage: productImage.url },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return next(new ApiError(404, "Product not found"));
        }

        res.status(200).json(new ApiResponse(200, updatedProduct, "Product image updated successfully"));

    } catch (error) {
        throw new ApiError(500, error?.message || "Internal server error !!")
    }
})

module.exports.updateProductDetails = asyncHandler(async (req, res) => {
    try {

        const { productName, description, price, stockQuantity } = req.body;
        // console.log(productName, description, price, stockQuantity)
        if (
            [productName, description].some((field) => field?.trim() === "") ||
            !price || !stockQuantity
        ) {
            throw new ApiError(400, "All fields are required")
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { productName, description, price, stockQuantity },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return next(new ApiError(404, "Product not found"));
        }

        res.status(200).json(
            new ApiResponse(200, updatedProduct, "Product updated successfully")
        );

    } catch (error) {
        throw new ApiError(500, error?.message || "Internal server error !!")
    }
})

module.exports.deleteProduct = asyncHandler(async (req, res) => {
    try {
        const productId = req.params.id
        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
            return next(new ApiError(404, "Product not found"));
        }

        return res.status(200).json(
            new ApiResponse(200,{}, "Product deleted successfully")
        );

    } catch (error) {
        throw new ApiError(500, error?.message || "Internal server error !!")
    }
})