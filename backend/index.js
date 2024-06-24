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
import {
  User,
  userSchema,
  productSchema,
  orderSchema,
  itemSchema,
} from "./schemas/schemas.js";

//import custom modules
import { emailsender } from "./modules/emailsender.js";

//import middlewares
import { userVerify, existingUser } from "./middlewares/middlewares.js";

//constants
const MONGO_DB_URL = process.env.MONGO_DB;
const JWT_SECRET = process.env.JWT_SECRET;

mongoose.connect(MONGO_DB_URL).then(() => console.log("Connected!"));

const Product = mongoose.model("Product", productSchema);
const Order = mongoose.model("Order", orderSchema);

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

app.post("/me", async function (req, res) {
  try {
    const DBUser = await User.findOne({ email: req.decoded.email });
    res.json(DBUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/payment", async function (req, res) {
  const order = new Order({ items: req.body.cart, user: req.decoded.email });
  await order.save();
  res.json({ msg: "order placed" });

  const user = await User.findOne({ email: order.user });
  const orderNo = await Order.countDocuments();
  console.log("Order with user details:", { order, user });

  let html = `
  <section>
  <b>Blue Bikes - Order No : ${orderNo}</b>
  <table id="data-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Color</th>
        <th>Price</th>
      </tr>
    </thead>
    <tbody>
      <!-- Data rows will be inserted here -->
      
      ${order.items.map((el) => {
        return `<tr>
            <td>${el.name}</td>
            <td>${el.color}</td>
            <td>${el.price}</td>
          </tr>`;
      })}
      
    </tbody>
  </table>
  <b>This order is placed by the email id ${user.email} and from the address ${
    user.address
  }</b>
  </section>`;
  // send an email
  emailsender(
    "sagar_kawad_mca@moderncoe.edu.in",
    "Order Placement",
    `Blue Bikes - Order No : ${orderNo}`,
    html
  );
});

app.post("/address", async function (req, res) {
  const DBUser = await User.updateOne(
    { email: req.decoded.email },
    { $set: { address: req.body.address } }
  );
  res.json({ msg: DBUser });
});

app.post("/addtocart", async function (req, res) {
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

app.listen(3000, process.env.SERVER, () => {
  console.log("server is up and running" + process.env.SERVER + "on port 3000");
});
