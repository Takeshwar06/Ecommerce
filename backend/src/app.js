const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.routes")
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes")
const app = express();

app.use(express.json());
app.use(cors())

app.use("/api/v1/users",userRoutes);
app.use("/api/v1/products",productRoutes);
app.use("/api/v1/orders",orderRoutes);
app.use("/api/v1/payments",paymentRoutes);

module.exports=app;
