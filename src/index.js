const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT;
const app = express();
const connectDB = require("./config/db");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/cart.routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/carts", cartRoutes);

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server http://localhost:${PORT} `);
});
