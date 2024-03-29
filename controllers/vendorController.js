const Vendor = require("../model/Vendor");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const vendorRegister = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const vendorEmail = await Vendor.findOne({ email });
    if (vendorEmail) {
      return res.status(400).json("Email alreday taken");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newVendor = new Vendor({
      username,
      email,
      password: hashedPassword,
    });
    await newVendor.save();

    res.status(201).json({ mes: "vendor registered successfully" });
    console.log("register");
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error From Vender Register" + error);
  }
};

const vendorLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const vendor = await Vendor.findOne({ email });
    const comparePass = await bcrypt.compare(password, vendor.password);
    if (!vendor || !comparePass) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    const token = jwt.sign(
      { vendorId: vendor._id },
      process.env.JWT_SECRET_KEY
    );
    const vendorId = vendor._id;

    res.status(200).json({ sucess: "Login successful", token, vendorId });
    console.log(email, "token: " + token);
  } catch (error) {
    console.log("error from Vender Login: " + error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().populate("firm");
    res.json({ vendors });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getVendorById = async (req, res) => {
  const vendorId = req.params.id;

  try {
    const vendor = await Vendor.findById(vendorId).populate("firm");
    if (!vendor) {
      return res.status(404).json({ error: "Vendor Not Found" });
    }
    res.status(200).json({ vendor });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { vendorRegister, vendorLogin, getAllVendors, getVendorById };
