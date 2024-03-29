const Product = require("../model/Product");
const Firm = require("../model/Firm");
const multer = require("multer");
const path = require("path");

// uploading images with multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Specify the directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Specify a unique filename for uploaded files
  },
});

const upload = multer({ storage: storage });

const addProduct = async (req, res) => {
  try {
    const { productName, price, category, bestSeller, description } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);
    if (!firm) {
      return res.status(404).json({ error: "No Firm found" });
    }

    const product = new Product({
      productName,
      price,
      category,
      bestSeller,
      description,
      image,
      firm: firm._id,
    });

    const savedProduct = await product.save();

    firm.products.push(savedProduct);

    await firm.save();

    res.status(200).json(savedProduct);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "Internal server error" });
  }
};

const getProuctsByFirm = async (req, res) => {
  try {
    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);

    if (!firm) {
      return res.status(404).json({ error: "No Firm Found" });
    }
    const restartName = firm.firmName;
    const products = await Product.find({ firm: firmId });
    res.status(200).json({ restartName, products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    const deleteProduct = await Product.findByIdAndDelete(productId);
    if (!deleteProduct) {
      return res.status(404).json({ error: "No Product found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addProduct: [upload.single("image"), addProduct],
  getProuctsByFirm,
  deleteProductById,
};
