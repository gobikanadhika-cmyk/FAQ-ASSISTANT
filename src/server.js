require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const faqRoutes = require("./routes/faqRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

const corsOptions = {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

// CORS
app.use(cors(corsOptions));

// JSON
app.use(express.json());

// Handle login preflight request
app.options("/api/auth/login", cors(corsOptions));

// MongoDB
connectDB();

// Home
app.get("/", (req, res) => {
    res.send("FAQ Assistant is working!");
});

// FAQ routes
app.use("/api/faqs", faqRoutes);

// Auth routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});