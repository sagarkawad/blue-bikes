const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect(
    "mongodb+srv://spkawad21:od4j59PaMgPl7tmi@cluster0.fwvfyuv.mongodb.net/bluebikes?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connected!"));

const Product = mongoose.model("Products", { name: String });

const product = new Product({
  name: "sam",
});

product.save().then(() => {
  console.log("product successfully stored!");
});

app.listen(3000, () => {
  console.log("server is up and running on port 3000");
});
