const express = require('express');
const verifyJWT = require('../middlewares/auth.middlewares');
const verifyAdmin = require('../middlewares/admin.middlewares');
const { upload } = require('../middlewares/multer.middlewares');
const { createProduct, 
    getAllProducts, 
    updateProductDetails, 
    updateProductImage, 
    deleteProduct 
} = require('../controllers/product.controllers');

const router = express.Router();

router.route("/get-products").get(verifyJWT, getAllProducts);

// protected admin routes
router.route("/create").post(
    verifyJWT,
    verifyAdmin,
    upload.single("productImage"),
    createProduct
);
router.route("/update-details/:id").patch(
    verifyJWT,
    verifyAdmin,
    updateProductDetails
);
router.route("/update-image/:id").patch(
    verifyJWT,
    verifyAdmin,
    updateProductImage
);
router.route("/delete/:id").delete(
    verifyJWT,
    verifyAdmin,
    deleteProduct
);


module.exports = router;