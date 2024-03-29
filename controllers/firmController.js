const Firm = require("../model/Firm");
const Vendor = require("../model/Vendor");
const multer = require("multer");
const path = require("path");

// uploading images with multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Specify the directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const addFirm = async (req, res) => {
  try {
    const { firmName, area, category, region, offer } = req.body;

    const image = req.file ? req.file.filename : undefined;
    const vendor = await Vendor.findById(req.vendorId);

    if (!vendor) {
      res.status(404).json({ mess: "Vendor not found" });
    }

    if (vendor.firm.length > 0) {
      return res.status(400).json({ mess: "vendor can have only one firm" });
    }

    const firm = new Firm({
      firmName,
      area,
      category,
      region,
      offer,
      image,
      vendor: vendor._id,
    });

    const savedFirm = await firm.save();

    const firmId = savedFirm._id;
    const vendorFristName = savedFirm.firmName;

    vendor.firm.push(savedFirm);

    await vendor.save();

    return res
      .status(200)
      .json({ mess: "Firm add Successfully", firmId, vendorFristName });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteFirmById = async (req, res) => {
  try {
    const firmId = req.params.firmId;

    const deleteProduct = await Firm.findByIdAndDelete(firmId);
    if (!deleteProduct) {
      return res.status(404).json({ error: "No Product found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { addFirm: [upload.single("image"), addFirm], deleteFirmById };
