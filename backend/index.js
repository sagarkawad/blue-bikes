const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = "secret";

mongoose
  .connect(
    "mongodb+srv://spkawad21:od4j59PaMgPl7tmi@cluster0.fwvfyuv.mongodb.net/bluebikes?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connected!"));

const Product = mongoose.model("Product", {
  img: String,
  color: String,
  name: String,
  price: Number,
});

// Define a schema for the items
const itemSchema = new mongoose.Schema({
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
});

const Order = mongoose.model("Order", {
  items: [itemSchema],
  user: {
    type: String,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
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

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already registered");
    }

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

app.listen(3000, () => {
  console.log("server is up and running on port 3000");
});
