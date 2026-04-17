require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB =require("./config/db");

const authRoutes= require("./routes/authRoutes")
const userRoutes= require("./routes/userRoutes")
const taskRoutes= require("./routes/taskRoutes")
const reportRoutes= require("./routes/reportRoutes")

const app = express();

// Middleware to handle CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//Connect Database
connectDB();

// Middleware
app.use(express.json());

// 1) Logging middleware — put near top so all requests are logged
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

// 2) Ping route (simple health check)
app.get('/ping', (req, res) => res.json({ ok: true, now: new Date().toISOString() }));

// 3) Serve uploaded files (so returned URLs work)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);

//Server uploads folder
app.use('/uploads',express.static(path.join(__dirname,"uploads")));
// Start Server
const PORT = process.env.PORT || 8000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
