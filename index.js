const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const vendorRoutes = require("./routes/vendorRoutes");
const firmRoutes = require("./routes/firmRoutes");
const productRoutes = require("./routes/productRoutes");
const path = require("path");

const app = express();
const PORT = 8000;

dotenv.config();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGOOSE_URL)
  .then(console.log("mongoose connect"))
  .catch((error) => {
    console.log(`Error from mongoose ${error}`);
  });

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});

app.use("/vendor", vendorRoutes);
app.use("/firm", firmRoutes);
app.use("/product", productRoutes);
app.use("/uploads", express.static("uploads"));
