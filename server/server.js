/* ===== Existing Imports ===== */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const apiRoutes = require("./routes");

// ===== Express Setup =====
const app = express();
const PORT = process.env.PORT || 5000;

// ===== Connect Database =====
connectDB();

// ===== Middleware =====
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ===== Routes Registration =====
app.use("/api", apiRoutes);

app.get("/", (req, res) => res.send("FYP Auto Tester API is running"));

// ===== Error Handling Middleware =====
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// ===== Server Listen =====
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});