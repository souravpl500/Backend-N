const express = require("express");
const Cart = require("../models/cart.model");
const app = express.Router();
const jwt = require("jsonwebtoken");

const middleware = async (req, res, next) => {
  const { token } = req.headers;
  try {
    if (!token) {
      return res.status(400).send({
        message: "Token not found",
      });
    }
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    console.log("userId: ", userId);
    req.userId = userId;
    next();
  } catch (error) {
    return res.status(400).send({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

app.use(middleware);

app.get("/", async (req, res) => {
  const { token } = req.headers;
  try {
    const { userId } = req;
    console.log("userId: ", userId);

    const cartProducts = await Cart.find({ userId })
      .populate("productId")
      .select("-userId");

    return res.status(200).send({
      cartProducts,
    });
  } catch (error) {
    return res.status(400).send({
      message: "Something went wrong",
      error: error.message,
    });
  }
});

app.post("/", async (req, res) => {
  const { token } = req.headers;
  const { productId, quantity } = req.body;
  try {
    const { userId } = req;
    console.log("userId: ", userId);

    const isExist = await Cart.findOne({ userId, productId });

    if (isExist) {
      return res.status(500).send({
        message: "Product already exist in cart",
      });
    }
    await Cart.create({
      userId,
      productId,
      quantity,
    });

    const product = await Cart.findOne({ userId, productId })
      .populate("productId")
      .select("-userId");

    return res.status(201).send({
      message: "Product added to cart",
      product,
    });
  } catch (error) {
    return res.status(400).send({
      message: "Something went wrong",
      error: error.message,
    });
  }
});

app.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { userId } = req;
    console.log("userId: ", userId);

    await Cart.findByIdAndDelete(id);

    return res.status(200).send({
      message: "Product deleted from cart",
    });
  } catch (error) {
    return res.status(400).send({
      message: "Something went wrong",
      error: error.message,
    });
  }
});

app.put("/", async (req, res) => {
  try {
    const { userId } = req;
    console.log("userId: ", userId);

    await Cart.deleteMany({ userId });

    return res.status(200).send({
      message: "Order placed successfully",
    });
  } catch (error) {
    return res.status(400).send({
      message: "Something went wrong",
      error: error.message,
    });
  }
});

module.exports = app;
