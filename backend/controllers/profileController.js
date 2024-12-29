const User = require("../models/User");
const Resume = require("../models/Resume");

exports.updateProfile = async (req, res) => {
  try {
    const { user_id, name, email, phone, linkedin, portfolio } = req.body;
    if (!user_id) return res.status(400).json({ error: "User ID is required" });

    const user = await User.findById(user_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const updatedProfile = {
      user_id,
      name: name || user.studentName,
      email: email || user.email,
      phone,
      linkedin,
      portfolio,
    };

    await Resume.updateOne(
      { user_id },
      { $set: updatedProfile },
      { upsert: true }
    );
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
