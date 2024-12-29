const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { studentName, email, password } = req.body;
    if (!studentName || !email || !password)
      return res.status(400).json({ error: "All fields are required" });

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(409).json({ error: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ studentName, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User successfully registered" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email, studentName: user.studentName },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
