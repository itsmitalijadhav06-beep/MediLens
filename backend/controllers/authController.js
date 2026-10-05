const User = require("../models/User");
const Counter = require("../models/Counter");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "medilens_secret_key_2026", {
    expiresIn: "7d"
  });
};

exports.register = async (req, res) => {
  try {
    const { phoneNumber, email, username, password } = req.body;

    if (!phoneNumber || !email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }]
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Safely generate atomic numeric userId starting at 101
    let counter = await Counter.findOneAndUpdate(
      { _id: "userId" },
      { $inc: { seq: 1 } },
      { returnDocument: "after", upsert: true }
    );
    let userId = counter.seq;
    if (userId < 101) {
      counter = await Counter.findOneAndUpdate(
        { _id: "userId" },
        { $set: { seq: 101 } },
        { returnDocument: "after" }
      );
      userId = counter.seq;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      userId,
      username,
      email: email.toLowerCase(),
      phoneNumber,
      password: hashedPassword
    });

    res.status(201).json({
      message: "Registration successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        userId: user.userId,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        userId: user.userId,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};