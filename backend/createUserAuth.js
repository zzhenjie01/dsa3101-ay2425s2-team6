import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "./createUserCredentialsCollection.js";

// Set up express server
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // React App port
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
app.use(express.json());

// JWT Secret
const JWT_SECRET = process.env.JWT_KEY;

// Registration route
app.get("/api/register", async (req, res) => {
  console.log("Registration request received:", req.body);

  const { email, password } = req.body;
  const saltLayers = 10;
  const hashedPassword = await bcrypt.hash(password, saltLayers);

  try {
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error); // Log the error on the server
    res
      .status(500)
      .json({ error: "Error registering user", details: error.message }); // Send details to frontend
  }
});

// Login route
app.get("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ error: "Invalid credentials. Please try again." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ error: "Invalid credentials. Please try again." });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
}

app.listen(5000, () => console.log("Server running on port 5000"));
