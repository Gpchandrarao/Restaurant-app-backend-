const Vender = require("../model/Vendor");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const verification = async (req, res, next) => {
  const token = req.headers.token;

  if (!token) {
    return res.status(401).json({ error: "token is required" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const vendor = await Vender.findById(decoded.vendorId);

    if (!vendor) {
      return res.status(404).json({ error: "vendor not found" });
    }
    req.vendorId = vendor._id;

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error");
  }
};

module.exports = verification;
