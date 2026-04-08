const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");

dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(express.json());

// 🔥 Serve Frontend (IMPORTANT)
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/todos", require("./routes/todoRoutes"));

// Optional: fallback (open index.html on root)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});