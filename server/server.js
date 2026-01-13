const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
require("./utils/emailScheduler");
// Routes
const authRoutes = require("./routes/authRoutes");
const loanRoutes = require("./routes/loanRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

// Connect Database
connectDB();

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [process.env.CLIENT_URL, "https://your-frontend-domain.vercel.app"]
        : ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Logger
app.use((req, res, next) => {
  console.log(
    `${req.method} ${req.path} - User: ${
      req.headers.authorization ? "Authenticated" : "Anonymous"
    }`
  );
  next();
});

// Test Route
app.get("/", (req, res) => {
  res.json({
    message: "Loan Management System API is running 🚀",
    status: "OK",
  });
});

// Test Login
app.post("/api/auth/test-login", (req, res) => {
  const jwt = require("jsonwebtoken");
  const token = jwt.sign(
    { userId: "test123", email: "test@example.com" },
    process.env.JWT_SECRET || "fallback_secret",
    { expiresIn: "24h" }
  );
  res.json({ token, message: "Test login successful" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);

// Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
