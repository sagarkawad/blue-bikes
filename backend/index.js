//import libraries
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const app = express();

app.use(cors());
app.use(express.json());

//import schemas
import { userSchema, productSchema, orderSchema } from "./schemas/schemas.js";

//import middlewares
import { existingUser } from "./middlewares/middlewares.js";

const JWT_SECRET = "secret";

mongoose
  .connect(
    "mongodb+srv://spkawad21:od4j59PaMgPl7tmi@cluster0.fwvfyuv.mongodb.net/bluebikes?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connected!"));

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

app.post("/payment", async function (req, res) {
  jwt.verify(req.body.token, JWT_SECRET, async function (error, decoded) {
    if (error) {
      res.json({ error });
    }
    const order = new Order({ items: req.body.cart, user: decoded.email });
    await order.save();
    res.json({ msg: "order placed" });
  });
});

app.post("/address", async function (req, res) {
  jwt.verify(req.body.token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      res.json({ error: err });
    }
    console.log("Token is valid:", decoded);
    const DBUser = await User.updateOne(
      { email: decoded.email },
      { $set: { address: req.body.address } }
    );
    res.json({ msg: DBUser });
  });
});

async function decodeUser(req, res, next) {
  jwt.verify(req.body.token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      res.json({ error: err });
    }
    console.log("Token is valid:", decoded);
    req.decoded = decoded;
    next();
  });
}

app.post("/addtocart", decodeUser, async function (req, res) {
  if (!req.decoded) {
    console.log("user cannot be found");
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

app.post("/getcart", decodeUser, async function (req, res) {
  if (!req.decoded) {
    console.log("user cannot be found");
    return;
  }

  async function findUser() {
    try {
      const user = await User.findOne({ email: req.decoded.email });
      console.log(user);
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
