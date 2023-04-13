const express = require("express");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const app = express.Router();

// Signup

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const isExist = await User.findOne({ email });
    if (isExist) {
      return res.status(400).send({
        message: "User already exist Please login",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });
    return res.status(201).send({
      message: "User created successfully",
    });
  } catch (error) {
    return res.status(400).send({
      message: "Something went wrong",
      error: error.message,
    });
  }
});

// Login

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({
        message: "User not found Please signup",
      });
    }

    if (user.password !== password) {
      return res.status(400).send({
        message: "Invalid Credentials",
      });
    }
    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7days" }
    );

    return res.status(200).send({
      message: "Login Successful",
      username: user.name,
      token,
    });
  } catch (error) {
    return res.status(400).send({
      message: "Something went wrong",
      error: error.message,
    });
  }
});

module.exports = app;
