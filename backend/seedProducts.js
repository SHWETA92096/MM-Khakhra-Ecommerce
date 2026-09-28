const mongoose = require("mongoose");
const Product = require("./models/Product");

mongoose
  .connect("mongodb://127.0.0.1:27017/khakhraDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const products = [
  {
    name: "Methi Khakhra",
    flavor: "Methi",
    weight: "40g",
    shape: "Mini",
    price: 25,
    stock: 100,
    description: "Healthy crispy methi khakhra.",
    image: "methi40.png"
  },
  {
    name: "Methi Khakhra",
    flavor: "Methi",
    weight: "200g",
    shape: "Round",
    price: 90,
    stock: 100,
    description: "Healthy crispy methi khakhra.",
    image: "methi200.png"
  },
  {
    name: "Plain Khakhra",
    flavor: "Plain",
    weight: "40g",
    shape: "Mini",
    price: 20,
    stock: 100,
    description: "Traditional plain khakhra.",
    image: "plain40.png"
  },
  {
    name: "Plain Khakhra",
    flavor: "Plain",
    weight: "200g",
    shape: "Round",
    price: 80,
    stock: 100,
    description: "Traditional plain khakhra.",
    image: "plain200.png"
  },
  {
    name: "Masala Khakhra",
    flavor: "Masala",
    weight: "40g",
    shape: "Mini",
    price: 25,
    stock: 100,
    description: "Spicy masala khakhra.",
    image: "masala40.png"
  },
  {
    name: "Masala Khakhra",
    flavor: "Masala",
    weight: "200g",
    shape: "Round",
    price: 90,
    stock: 100,
    description: "Spicy masala khakhra.",
    image: "masala200.png"
  },
  {
    name: "Jeera Khakhra",
    flavor: "Jeera",
    weight: "40g",
    shape: "Mini",
    price: 20,
    stock: 100,
    description: "Crunchy jeera khakhra.",
    image: "jeera40.png"
  },
  {
    name: "Jeera Khakhra",
    flavor: "Jeera",
    weight: "200g",
    shape: "Round",
    price: 90,
    stock: 100,
    description: "Crunchy jeera khakhra.",
    image: "jeera200.png"
  },
  {
    name: "Moong Khakhra",
    flavor: "Moong",
    weight: "40g",
    shape: "Mini",
    price: 25,
    stock: 100,
    description: "Healthy moong khakhra.",
    image: "moong40.png"
  },
  {
    name: "Moong Khakhra",
    flavor: "Moong",
    weight: "200g",
    shape: "Round",
    price: 100,
    stock: 100,
    description: "Healthy moong khakhra.",
    image: "moong200.png"
  }
];

async function seedData() {
  try {
    await Product.deleteMany();
    await Product.insertMany(products);

    console.log("✅ 10 Products Added Successfully");

    mongoose.connection.close();
  } catch (error) {
    console.log(error);
  }
}

seedData();