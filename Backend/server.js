require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");

const Contact = require("./models/Contact");

const app = express();
const PORT = process.env.PORT || 5000;


// ─────────────────────────────────────────────────────────────
// ✅ Security Middleware
// ─────────────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);


// ─────────────────────────────────────────────────────────────
// ✅ CORS Configuration
// ─────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_ORIGIN,
  "http://localhost:3000",
  "http://localhost:5173", // Vite default (you missed this)
  "http://localhost:5500",
  "http://127.0.0.1:5500",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      if (origin.includes("vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);


// ─────────────────────────────────────────────────────────────
// ✅ Rate Limiter
// ─────────────────────────────────────────────────────────────
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many requests. Try again later.",
  },
});


// ─────────────────────────────────────────────────────────────
// ✅ Body Parser
// ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));


// ─────────────────────────────────────────────────────────────
// ✅ MongoDB Connection
// ─────────────────────────────────────────────────────────────
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI not defined in .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};


// ─────────────────────────────────────────────────────────────
// ✅ Routes
// ─────────────────────────────────────────────────────────────

// Health check
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API running",
    timestamp: new Date().toISOString(),
  });
});


// ─────────────────────────────────────────────────────────────
// ✅ Contact Route
// ─────────────────────────────────────────────────────────────
app.post(
  "/api/contact",
  contactLimiter,
  [
    body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 100 }),

    body("age")
      .notEmpty()
      .withMessage("Age is required")
      .isInt({ min: 1, max: 120 })
      .withMessage("Age must be between 1 and 120"),

    body("gmail")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email")
      .normalizeEmail(),

    body("subject").trim().notEmpty().withMessage("Subject is required").isLength({ max: 200 }),

    body("message").trim().notEmpty().withMessage("Message is required").isLength({ max: 2000 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { name, age, gmail, subject, message } = req.body;

      const newContact = new Contact({
        name,
        age: Number(age),
        gmail,
        subject,
        message,
      });

      await newContact.save();

      return res.status(201).json({
        success: true,
        message: "Message sent successfully ✅",
      });
    } catch (err) {
      console.error("❌ Contact error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);


// ─────────────────────────────────────────────────────────────
// ✅ 404 Handler
// ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


// ─────────────────────────────────────────────────────────────
// ✅ Global Error Handler
// ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("❌ Global error:", err.stack);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});


// ─────────────────────────────────────────────────────────────
// ✅ Start Server ONLY after DB connects
// ─────────────────────────────────────────────────────────────
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
module.exports = app;
