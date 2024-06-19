import mongoose from "mongoose";

// Define a schema for the items
export const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
});

export const orderSchema = new mongoose.Schema({
  items: [itemSchema],
  user: {
    type: String,
    required: true,
  },
});

export const productSchema = new mongoose.Schema({
  img: String,
  color: String,
  name: String,
  price: Number,
});

export const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  address: {
    type: String,
  },
  products: [itemSchema],
});
