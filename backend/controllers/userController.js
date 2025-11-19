import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone} = req.body;
    const user = await User.create({ name, email, password, phone});

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const validate = async (req, res) => {
  try {
    const { email, password, phone } = req.body;
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const emailexisting = await User.findOne({ email });
    if (emailexisting) {
      return res.status(400).json({ message: "Email already exists" });
    }
    if(phone.length < 10){
      return res.status(400).json({ message: "Phone number must be of 10 digits" });
    }
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      return res.status(400).json({ message: "Phone number already exists" });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    res.json({ message: "Valid details. You may send OTP." });
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        success : true,
        message: "Login Successful",
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      console.log("Invalid login attempt for email:", email);
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const dashboard = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};