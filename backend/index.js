const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

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

app.get("/products", async function (req, res) {
  const products = await Product.find();
  res.json(products);
});

app.listen(3000, () => {
  console.log("server is up and running on port 3000");
});
