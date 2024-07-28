const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.routes")
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");

const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

app.use("/api/v1/users",userRoutes);
app.use("/api/v1/products",productRoutes);
app.use("/api/v1/orders",orderRoutes);

module.exports=app;