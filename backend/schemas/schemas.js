import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
    ref: "User",
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

// Pre-save hook to hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create and export the User model
export const User = mongoose.model("User", userSchema);
