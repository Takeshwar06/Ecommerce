export const host="http://localhost:4000";

export const getCurrentUser = `${host}/api/v1/users/current-user`
export const userRegister = `${host}/api/v1/users/register`
export const userLogin = `${host}/api/v1/users/login`
export const adminLogin = `${host}/api/v1/users/login-admin`
export const refreshToke = `${host}/api/v1/users/refresh-token`
export const logout = `${host}/api/v1/users/logout`
export const addToCart = `${host}/api/v1/users/cart/add`
export const getCartItems = `${host}/api/v1/users/cart/items`
export const incrementCartItemQuantity = `${host}/api/v1/users/cart/increament`
export const decrementCartItemQuantity = `${host}/api/v1/users/cart/decreament`


export const getAllProducts = `${host}/api/v1/products/get-products`
export const addNewProduct = `${host}/api/v1/products/create`
export const updateProductDetails = `${host}/api/v1/products/update-details` // id
export const updateProductImage = `${host}/api/v1/products/update-image` // id
export const deleteProduct = `${host}/api/v1/products/delete` // id


export const getKey = `${host}/api/v1/payments/getkey`
export const orderGenerate = `${host}/api/v1/payments/ordergenerate`
export const paymentSuccess = `${host}/api/v1/payments/paymentsuccess` // in this i handle the order placeing

export const getUserOrders = `${host}/api/v1/orders/get-user-orders`
export const getAllOrders = `${host}/api/v1/orders/get-all-orders`