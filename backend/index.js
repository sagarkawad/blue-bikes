//import libraries
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

//import schemas
import { userSchema, productSchema, orderSchema } from "./schemas/schemas.js";

//import middlewares
import { existingUser, userVerify } from "./middlewares/middlewares.js";

//constants
const MONGO_DB_URL = process.env.MONGO_DB;
const JWT_SECRET = process.env.JWT_SECRET;

mongoose.connect(MONGO_DB_URL).then(() => console.log("Connected!"));

const Product = mongoose.model("Product", productSchema);
const Order = mongoose.model("Order", orderSchema);
const User = mongoose.model("User", userSchema);

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

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

app.post("/register", existingUser, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = new User({ email, password });
    await user.save();
    res.status(201).send("User registered");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid email or password");
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).send("Invalid email or password");
    }
    const token = jwt.sign({ email }, JWT_SECRET);
    res.send({ token });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/products", async function (req, res) {
  const products = await Product.find();
  res.json(products);
});

//middleware for the further routes
app.use(userVerify);

app.post("/payment", async function (req, res) {
  const order = new Order({ items: req.body.cart, user: req.decoded.email });
  await order.save();
  res.json({ msg: "order placed" });
});

app.post("/address", async function (req, res) {
  const DBUser = await User.updateOne(
    { email: req.decoded.email },
    { $set: { address: req.body.address } }
  );
  res.json({ msg: DBUser });
});

app.post("/addtocart", async function (req, res) {
  if (!req.decoded) {
    return;
  }

  try {
    console.log(req.body.products);
    const DBUser = await User.updateOne(
      { email: req.decoded.email },
      { $set: { products: req.body.products } }
    );
    res.json({ msg: "hey there: ", DBUser });
  } catch (err) {
    res.json({ msg: err });
  }
});

app.post("/getcart", async function (req, res) {
  if (!req.decoded) {
    return;
  }

  async function findUser() {
    try {
      const user = await User.findOne({ email: req.decoded.email });
      res.send(user);
    } catch (err) {
      res.status(500).send(err);
    }
  }

  findUser();
});

app.listen(3000, () => {
  console.log("server is up and running on port 3000");
});
